import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, Check, Star, ChevronDown, ChevronUp, Heart, X, ZoomIn, Share2, Truck, ShieldCheck, RotateCcw, BellRing } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import ImageProduit from '../components/product/ImageProduit.jsx'
import { StockUrgence, DelaiLivraison, CommandeAvant } from '../components/product/StockUrgence.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { usePanier, useWishlist, useRecents, useAlertesStock } from '../store/index.js'
import CarteProduit from '../components/product/CarteProduit.jsx'
import RecentsProduits from '../components/product/RecentsProduits.jsx'
import { formatPrix, formatDateLivraison } from '../utils/format.js'
import { SITE } from '../config.js'
import toast from 'react-hot-toast'
import usePageMeta from '../hooks/usePageMeta.js'

function Etoiles({ note, size = 18, afficherNote = true }) {
  const full = Math.floor(note)
  const half = note - full >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? 'fill-amber-400 text-amber-400' : i === full && half ? 'fill-amber-400/50 text-amber-400' : 'text-gray-200'}
        />
      ))}
      {afficherNote && <span className="text-sm font-semibold text-gray-600 ml-1.5">{note}/5</span>}
    </div>
  )
}

function EtoilesInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className="p-0.5">
          <Star size={22} className={i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200 hover:text-amber-300 transition-colors'} />
        </button>
      ))}
    </div>
  )
}

export default function DetailProduit() {
  const { slug } = useParams()
  const { ajouterArticle, ouvrir } = usePanier()
  const { ids, basculer } = useWishlist()
  const { ajouter: ajouterRecents } = useRecents()
  const { ids: alertesIds, basculer: basculerAlerte } = useAlertesStock()
  const qc = useQueryClient()
  const [qty, setQty] = useState(1)
  const [ajoute, setAjoute] = useState(false)
  const [voirAvis, setVoirAvis] = useState(true)
  const [onglet, setOnglet] = useState('description')
  const [imageActive, setImageActive] = useState(0)
  const [lightboxOuvert, setLightboxOuvert] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [formAvis, setFormAvis] = useState({ note: 0, commentaire: '' })
  const [formEnvoye, setFormEnvoye] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['produit', slug],
    queryFn:  () => produitsApi.detail(slug),
    enabled:  !!slug,
  })

  const produit    = data?.data?.data?.produit
  const similaires = data?.data?.data?.similaires || []
  const avis       = data?.data?.data?.avis || []

  useEffect(() => {
    if (produit?.id) {
      ajouterRecents({
        id: produit.id,
        slug: produit.slug,
        nom: produit.nom,
        marque: produit.marque,
        prix_effectif: produit.prix_effectif,
        prix: produit.prix,
        en_solde: produit.en_solde,
        en_stock: produit.en_stock,
        stock: produit.stock,
        note: produit.note,
        image: produit.image,
        categorie: produit.categorie,
      })
    }
  }, [produit?.id])

  function handlePartager() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: produit?.nom || 'Produit', url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).then(() => toast.success('Lien copié !')).catch(() => {})
    }
  }

  const avisMutation = useMutation({
    mutationFn: ({ pid, note, commentaire }) => produitsApi.soumettreAvis(pid, note, commentaire),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['produit', slug] })
      toast.success('Votre avis a été publié !')
      setFormAvis({ note: 0, commentaire: '' })
      setFormEnvoye(true)
      setTimeout(() => setFormEnvoye(false), 3000)
    },
    onError: () => toast.error('Erreur lors de l\'envoi de l\'avis'),
  })

  const estFavori  = ids.includes(produit?.id)

  usePageMeta({
    title: produit?.nom || 'Produit',
    description: produit?.description
      ? `${produit.nom} — ${produit.marque}. ${produit.description.slice(0, 150)} Prix : ${produit.prix_effectif} MAD.`
      : undefined,
    path: `/produits/${slug}`,
    image: produit?.image || undefined,
    schema: produit?.id
      ? [
          {
            '@type': 'Product',
            '@id': `${SITE.domaine}/produits/${slug}#product`,
            name: produit.nom,
            sku: `ELM-${produit.id}`,
            brand: { '@type': 'Brand', name: produit.marque },
            category: produit.categorie?.nom,
            image: (produit.images && produit.images.length
              ? produit.images.map((i) => (i.startsWith('/') ? SITE.domaine + i : i))
              : [SITE.domaine + produit.image]).filter(Boolean),
            description: produit.description,
            url: `${SITE.domaine}/produits/${slug}`,
            offers: {
              '@type': 'Offer',
              url: `${SITE.domaine}/produits/${slug}`,
              priceCurrency: 'MAD',
              price: produit.prix_effectif,
              availability: produit.en_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
              seller: { '@id': `${SITE.domaine}/#organization` },
            },
            ...(produit.note && produit.nb_avis
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: produit.note,
                    reviewCount: produit.nb_avis,
                  },
                }
              : {}),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE.domaine + '/' },
              { '@type': 'ListItem', position: 2, name: 'Produits', item: SITE.domaine + '/produits' },
              ...(produit.categorie?.slug
                ? [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: produit.categorie.nom,
                      item: `${SITE.domaine}/produits?categorie=${produit.categorie.slug}`,
                    },
                  ]
                : []),
              {
                '@type': 'ListItem',
                position: produit.categorie?.slug ? 4 : 3,
                name: produit.nom,
                item: `${SITE.domaine}/produits/${slug}`,
              },
            ],
          },
        ]
      : [],
  })

  const imagesDisponibles = (produit?.images?.length ? produit.images : produit?.image ? [produit.image] : [])

  function handleAjouter() {
    if (!produit?.en_stock) return
    ajouterArticle(produit, qty)
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
    toast.success(`${produit.nom.slice(0, 30)}… ajouté !`)
    ouvrir()
  }

  const alerteActif = alertesIds.includes(produit?.id)
  function handleAlerter() {
    if (!produit?.id) return
    basculerAlerte(produit.id)
    if (alerteActif) toast('Alerte désactivée')
    else toast.success('Alerte activée — vous serez prévenu du retour en stock 🔔')
  }

  function handleZoom(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  function handleSubmitAvis(e) {
    e.preventDefault()
    if (!formAvis.note) { toast.error('Veuillez donner une note'); return }
    if (!formAvis.commentaire.trim()) { toast.error('Veuillez écrire un commentaire'); return }
    avisMutation.mutate({ pid: produit.id, note: formAvis.note, commentaire: formAvis.commentaire })
  }

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-10 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )

  if (!produit) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Produit introuvable</h2>
      <Link to="/produits" className="btn-vert mt-4 inline-flex">Retour aux produits</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-28 sm:pb-8">
      <Breadcrumbs items={[
        { label: 'Produits', to: '/produits' },
        ...(produit.categorie ? [{ label: produit.categorie.nom, to: `/produits?categorie=${produit.categorie.slug}` }] : []),
        { label: produit.nom },
      ]} />

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3 min-w-0"
        >
          <div
            className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative group cursor-zoom-in"
            onMouseMove={handleZoom}
            onClick={() => imagesDisponibles.length > 0 && setLightboxOuvert(true)}
          >
            {imagesDisponibles[imageActive] ? (
              <>
                <img
                  src={imagesDisponibles[imageActive]}
                  alt={produit.nom}
                  loading='lazy'
                  className="w-full h-full object-contain p-8 transition-transform duration-200 group-hover:scale-150"
                  style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </div>
                </div>
              </>
            ) : (
              <ImageProduit produit={produit} className="w-full h-full" iconeClass="w-32 h-32" />
            )}
          </div>
          {imagesDisponibles.length > 1 && (
            <div className="flex gap-2">
              {imagesDisponibles.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageActive(i)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                    i === imageActive ? 'border-vert-500 ring-2 ring-vert-200' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5 min-w-0"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              {produit.marque && (
                <Link
                  to={`/produits?marque=${produit.marque}`}
                  className="text-sm font-bold text-vert-600 uppercase tracking-wider hover:underline"
                >
                  {produit.marque}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Syne' }}>
                {produit.nom}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePartager}
                aria-label="Partager le produit"
                className="flex-shrink-0 w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const devientFavori = !estFavori
                  basculer(produit.id)
                  if (devientFavori) toast.success('Ajouté aux favoris ❤️')
                  else toast('Retiré des favoris')
                }}
                aria-label={estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                aria-pressed={estFavori}
                className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${estFavori ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <Heart className={`w-5 h-5 transition-colors ${estFavori ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          {/* Rating */}
          {produit.note > 0 && (
            <div className="flex items-center gap-2">
              <Etoiles note={produit.note} size={18} />
              <span className="text-sm text-gray-400">({produit.nb_avis || 0} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="prix-principal text-3xl">
              {formatPrix(produit.prix_effectif)} MAD
            </span>
            {produit.en_solde && (
              <>
                <span className="prix-barre text-xl">{formatPrix(produit.prix)} MAD</span>
                <span className="badge-rouge px-3 py-1 text-sm">-{produit.remise}%</span>
              </>
            )}
          </div>

          {produit.description && (
            <p className="text-gray-600 leading-relaxed">{produit.description}</p>
          )}

          <div className="flex items-center gap-2">
            <StockUrgence stock={produit.stock} enStock={produit.en_stock} />
            <span className="text-xs text-gray-400">·</span>
            <DelaiLivraison />
          </div>
          <CommandeAvant />

          {/* Quantity + Add to cart */}
          {produit.en_stock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Quantité :</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 disabled:text-gray-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold border-x border-gray-200 h-11 flex items-center justify-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(produit.stock, q + 1))}
                    disabled={qty >= produit.stock}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 disabled:text-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <motion.button
                onClick={handleAjouter}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl font-bold text-base w-full sm:w-auto transition-all duration-300 ${
                  ajoute ? 'bg-vert-500 text-white' : 'btn-vert'
                }`}
              >
                {ajoute
                  ? <><Check className="w-5 h-5" />Ajouté au panier !</>
                  : <><ShoppingCart className="w-5 h-5" />Ajouter au panier</>
                }
              </motion.button>
            </div>
          )}

          {/* Back-in-stock alert */}
          {!produit.en_stock && (
            <motion.button
              onClick={handleAlerter}
              whileTap={{ scale: 0.97 }}
              aria-pressed={alerteActif}
              className={`flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl font-bold text-base w-full sm:w-auto transition-all duration-300 ${
                alerteActif ? 'bg-vert-500 text-white' : 'border-2 border-vert-600 text-vert-700 hover:bg-vert-50'
              }`}
            >
              {alerteActif
                ? <><Check className="w-5 h-5" /> Alerte activée — nous vous préviendrons</>
                : <><BellRing className="w-5 h-5" /> M'avertir du retour en stock</>}
            </motion.button>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            {[
              ['🚚', 'Livraison', `Gratuite dès ${SITE.fraisLivraisonGratuite} MAD`],
              ['🔒', 'Sécurisé',  'Paiement protégé'],
              ['↩️', 'Retours',   '30 jours'],
            ].map(([ic, t, d]) => (
              <div key={t} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl mb-1">{ic}</p>
                <p className="text-xs font-semibold text-gray-700">{t}</p>
                <p className="text-xs text-gray-400">{d}</p>
              </div>
            ))}
          </div>

          {/* Tabs : description / livraison */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              {[
                ['description', 'Description'],
                ['livraison', 'Livraison & retours'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setOnglet(id)}
                  aria-pressed={onglet === id}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${onglet === id ? 'bg-white text-vert-700 border-b-2 border-vert-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-5 text-sm text-gray-600 leading-relaxed">
              {onglet === 'description' ? (
                <p>{produit.description}</p>
              ) : (
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-vert-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">Livraison :</strong> expédition sous 24h (jours ouvrés), réception estimée entre <strong>{formatDateLivraison()}</strong>. Livraison offerte dès {SITE.fraisLivraisonGratuite} MAD, sinon {SITE.fraisLivraison} MAD.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-vert-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-900">Paiement sécurisé :</strong> paiement à la livraison disponible dans tout le Maroc.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-vert-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-900">Retours :</strong> vous disposez de 30 jours pour changer d'avis, produit non ouvert.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Avis clients */}
      <section className="mb-12">
        <button
          onClick={() => setVoirAvis(v => !v)}
          className="flex items-center justify-between w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Syne' }}>Avis clients</h2>
            <span className="bg-vert-100 text-vert-700 text-xs font-bold px-2.5 py-1 rounded-full">{avis.length} avis</span>
            {produit.note > 0 && <Etoiles note={produit.note} size={16} afficherNote={false} />}
          </div>
          {voirAvis ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {voirAvis && (
          <div className="mt-4 space-y-3">
            {avis.map(a => {
              const initiales = a.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div key={a.id} className="carte p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-vert-100 rounded-full flex items-center justify-center text-vert-700 text-xs font-bold flex-shrink-0">
                      {initiales}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{a.user}</span>
                        <span className="text-xs text-gray-400">· {a.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={12} className={i < a.note ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{a.commentaire}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Review form */}
            <div className="carte p-5 border-dashed border-2 border-vert-100">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Donnez votre avis</h3>
              {formEnvoye ? (
                <p className="text-sm text-vert-700 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> Merci pour votre avis !
                </p>
              ) : (
                <form onSubmit={handleSubmitAvis} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Votre note</label>
                    <EtoilesInput value={formAvis.note} onChange={n => setFormAvis(f => ({ ...f, note: n }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Votre commentaire</label>
                    <textarea
                      value={formAvis.commentaire}
                      onChange={e => setFormAvis(f => ({ ...f, commentaire: e.target.value }))}
                      placeholder="Partagez votre expérience avec ce produit…"
                      rows={3}
                      className="champ resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={avisMutation.isPending}
                    className="btn-vert text-sm py-2.5 px-5"
                  >
                    {avisMutation.isPending ? 'Envoi…' : 'Publier mon avis'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Similaires */}
      {similaires.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Syne' }}>
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {similaires.slice(0, 6).map((p, i) => (
              <CarteProduit key={p.id} produit={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <RecentsProduits currentId={produit.id} />

      {/* Sticky mobile buy bar */}
      <AnimatePresence>
        {produit.en_stock && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 p-3 sm:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <span className="prix-principal text-lg">{formatPrix(produit.prix_effectif)} MAD</span>
                {produit.en_solde && <span className="prix-barre text-xs ml-1">{formatPrix(produit.prix)}</span>}
              </div>
              <motion.button
                onClick={handleAjouter}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${ajoute ? 'bg-vert-500 text-white' : 'btn-vert'}`}
              >
                {ajoute
                  ? <><Check className="w-4 h-4" /> Ajouté !</>
                  : <><ShoppingCart className="w-4 h-4" /> Ajouter</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOuvert && imagesDisponibles[imageActive] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxOuvert(false)}
          >
            <button
              onClick={() => setLightboxOuvert(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              key={imageActive}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={imagesDisponibles[imageActive]}
              alt={produit.nom}
              className="max-w-full max-h-full object-contain"
              onClick={e => e.stopPropagation()}
            />
            {imagesDisponibles.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {imagesDisponibles.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setImageActive(i) }}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                      i === imageActive ? 'border-white ring-2 ring-white/50' : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
