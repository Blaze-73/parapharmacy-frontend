import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart, ArrowLeft, Check } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import { usePanier } from '../store/index.js'
import CarteProduit from '../components/product/CarteProduit.jsx'
import toast from 'react-hot-toast'

export default function DetailProduit() {
  const { slug } = useParams()
  const { ajouterArticle, ouvrir } = usePanier()
  const [qty, setQty] = useState(1)
  const [ajoute, setAjoute] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['produit', slug],
    queryFn:  () => produitsApi.detail(slug),
    enabled:  !!slug,
  })

  const produit    = data?.data?.data?.produit
  const similaires = data?.data?.data?.similaires || []

  function handleAjouter() {
    if (!produit?.en_stock) return
    ajouterArticle(produit, qty)
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
    toast.success(`${produit.nom.slice(0, 30)}… ajouté !`)
    ouvrir()
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

  const emoji = produit.categorie?.icone || '💊'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/produits" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-vert-700 mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Retour aux produits
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden"
        >
          {produit.image ? (
            <img
              src={produit.image}
              alt={produit.nom}
              loading="lazy"
              className="w-full h-full object-contain p-8"
            />
          ) : (
            <span style={{ fontSize: '8rem', lineHeight: 1 }}>{emoji}</span>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
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

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="prix-principal text-3xl">
              {Number(produit.prix_effectif).toFixed(2)} MAD
            </span>
            {produit.en_solde && (
              <>
                <span className="prix-barre text-xl">{Number(produit.prix).toFixed(2)} MAD</span>
                <span className="badge-rouge px-3 py-1 text-sm">-{produit.remise}%</span>
              </>
            )}
          </div>

          {produit.description && (
            <p className="text-gray-600 leading-relaxed">{produit.description}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${produit.en_stock ? 'bg-vert-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-semibold ${produit.en_stock ? 'text-vert-700' : 'text-red-600'}`}>
              {produit.en_stock ? `En stock (${produit.stock} disponibles)` : 'Rupture de stock'}
            </span>
          </div>

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

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            {[
              ['🚚', 'Livraison', 'Gratuite dès 300 MAD'],
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
        </motion.div>
      </div>

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
    </div>
  )
}
