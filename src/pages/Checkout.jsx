import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Truck, ChevronDown } from 'lucide-react'
import { usePanier, useAuth } from '../store/index.js'
import { commandesApi } from '../api/index.js'
import { useForm } from 'react-hook-form'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import BarreLivraison from '../components/BarreLivraison.jsx'
import { formatPrix, formatDateLivraison } from '../utils/format.js'
import { SITE } from '../config.js'
import toast from 'react-hot-toast'
import usePageMeta from '../hooks/usePageMeta.js'

export default function Checkout() {
  usePageMeta({ title: 'Finaliser ma commande', path: '/checkout', noindex: true })
  const { articles, viderPanier, sousTotal, fermer } = usePanier()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { paiement: 'livraison' } })
  const [resumeOuvert, setResumeOuvert] = useState(false)
  const sous = sousTotal()
  const livraison = sous > 0 && sous < SITE.fraisLivraisonGratuite ? SITE.fraisLivraison : 0
  const total = sous + livraison

  if (articles.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500 mb-5">Votre panier est vide.</p>
      <Link to="/produits" className="btn-vert">Voir les produits</Link>
    </div>
  )

  async function onSubmit(data) {
    setChargement(true)
    try {
      const payload = {
        items: articles.map(a => ({ produit_id: a.produit.id, quantite: a.quantite })),
        user_id: user?.id,
        user: user ? { id: user.id, nom: user.nom, email: user.email, telephone: user.telephone || data.telephone } : undefined,
        adresse_livraison: data.adresse,
        ville: data.ville,
        telephone: data.telephone,
        paiement: data.paiement,
        notes: data.notes || '',
      }
      const res = await commandesApi.creer(payload)
      viderPanier()
      fermer()
      toast.success('Commande passée avec succès !')
      navigate(`/commande-confirmee/${res.data.data.numero}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la commande.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Panier', to: '/panier' }, { label: 'Commander' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Passer la commande</h1>

      {/* Mobile collapsible order summary */}
      <div className="lg:hidden carte mb-5 overflow-hidden">
        <button
          type="button"
          onClick={() => setResumeOuvert(v => !v)}
          aria-expanded={resumeOuvert}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2 font-bold text-gray-900">
            <ShoppingBag className="w-4 h-4 text-vert-600" />
            Votre commande
          </span>
          <span className="flex items-center gap-2">
            <span className="prix-principal text-lg">{formatPrix(total)} MAD</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${resumeOuvert ? 'rotate-180' : ''}`} />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {resumeOuvert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="space-y-2 mb-4 mt-4">
                  {articles.map(({ produit, quantite }) => (
                    <div key={produit.id} className="flex justify-between text-sm gap-2">
                      <span className="text-gray-600 line-clamp-1 flex-1">{produit.nom}</span>
                      <span className="font-semibold text-gray-900 flex-shrink-0">
                        ×{quantite} — {formatPrix(Number(produit.prix_effectif) * quantite)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-vert-50 rounded-lg p-2.5">
                  <Truck className="w-4 h-4 text-vert-600 flex-shrink-0" />
                  Livraison estimée : <strong className="text-gray-700">{formatDateLivraison()}</strong>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span><span>{formatPrix(sous)} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className={livraison === 0 ? 'text-vert-600 font-semibold' : ''}>
                      {livraison === 0 ? 'GRATUITE' : `${formatPrix(livraison)} MAD`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                    <span>Total</span>
                    <span className="prix-principal text-xl">{formatPrix(total)} MAD</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="carte p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">📍 Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse *</label>
                  <input {...register('adresse', { required: "L'adresse est obligatoire." })}
                    className={`champ ${errors.adresse ? 'border-red-400' : ''}`}
                    placeholder="Numéro et nom de rue" />
                  {errors.adresse && <p className="erreur">{errors.adresse.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville *</label>
                  <input {...register('ville', { required: 'La ville est obligatoire.' })}
                    className={`champ ${errors.ville ? 'border-red-400' : ''}`}
                    placeholder="Casablanca" />
                  {errors.ville && <p className="erreur">{errors.ville.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Téléphone <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal"> (pour être contacté sur WhatsApp)</span>
                  </label>
                  <input {...register('telephone', {
                    required: 'Le numéro de téléphone est obligatoire.',
                    pattern: { value: /^[+]?[\d\s-]{9,15}$/, message: 'Numéro de téléphone invalide.' },
                  })}
                    type="tel"
                    className={`champ ${errors.telephone ? 'border-red-400' : ''}`}
                    placeholder="06 12 34 56 78" />
                  {errors.telephone && <p className="erreur">{errors.telephone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Notes <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea {...register('notes')} className="champ resize-none" rows={2}
                    placeholder="Instructions particulières pour la livraison…" />
                </div>
              </div>
            </div>

            <div className="carte p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">💳 Mode de paiement</h2>
              <div className="space-y-3">
                {[
                  { v: 'livraison', label: '💵 Paiement à la livraison', desc: 'Payez en espèces à la réception', disabled: false },
                  { v: 'carte',     label: '💳 Carte bancaire',          desc: 'Paiement sécurisé (bientôt disponible)', disabled: true },
                ].map(opt => (
                  <label key={opt.v}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl transition-colors ${opt.disabled ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer border-gray-100 hover:border-vert-300'}`}>
                    <input {...register('paiement')} type="radio" value={opt.v}
                      disabled={opt.disabled}
                      className="mt-0.5 accent-vert-600 w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="carte p-6 h-fit sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">🛒 Votre commande</h2>
            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
              {articles.map(({ produit, quantite }) => (
                <div key={produit.id} className="flex justify-between text-sm gap-2">
                  <span className="text-gray-600 line-clamp-1 flex-1">{produit.nom}</span>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    ×{quantite} — {formatPrix(Number(produit.prix_effectif) * quantite)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-vert-50 rounded-lg p-2.5">
              <Truck className="w-4 h-4 text-vert-600 flex-shrink-0" />
              Livraison estimée : <strong className="text-gray-700">{formatDateLivraison()}</strong>
            </div>
            <BarreLivraison sousTotal={sous} compact />
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm mt-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span><span>{formatPrix(sous)} MAD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className={livraison === 0 ? 'text-vert-600 font-semibold' : ''}>
                  {livraison === 0 ? 'GRATUITE' : `${formatPrix(livraison)} MAD`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                <span>Total</span>
                <span className="prix-principal text-xl">{formatPrix(total)} MAD</span>
              </div>
            </div>
            <button type="submit" disabled={chargement} className="btn-vert w-full mt-5 py-3.5">
              {chargement
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Confirmer la commande <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
