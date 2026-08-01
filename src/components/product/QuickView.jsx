import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Check, Star, Heart } from 'lucide-react'
import { useState } from 'react'
import { usePanier, useWishlist } from '../../store/index.js'
import ImageProduit from './ImageProduit.jsx'
import { formatPrix } from '../../utils/format.js'
import useFocusTrap from '../../hooks/useFocusTrap.js'
import toast from 'react-hot-toast'

function Etoiles({ note, size = 14 }) {
  const full = Math.floor(note)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} className={i < full ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
      {note > 0 && <span className="text-xs font-semibold text-gray-500 ml-1.5">{note}/5</span>}
    </div>
  )
}

export default function QuickView({ produit, onClose }) {
  const { ajouterArticle, ouvrir } = usePanier()
  const { ids, basculer } = useWishlist()
  const [qty, setQty] = useState(1)
  const [ajoute, setAjoute] = useState(false)
  const ref = useFocusTrap(!!produit, onClose)
  const estFavori = ids.includes(produit?.id)

  if (!produit) return null

  function handleAjouter() {
    if (!produit.en_stock) { toast.error('Ce produit est épuisé'); return }
    ajouterArticle(produit, qty)
    setAjoute(true)
    setTimeout(() => setAjoute(false), 1500)
    toast.success('Ajouté au panier !')
    ouvrir()
  }

  return (
    <AnimatePresence>
      {produit && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={produit.nom}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Fermer l'aperçu"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-gray-100 shadow flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid sm:grid-cols-2">
              <div className="aspect-square sm:aspect-auto">
                <ImageProduit produit={produit} className="w-full h-full" iconeClass="w-16 h-16" />
              </div>

              <div className="p-6 flex flex-col">
                {produit.marque && (
                  <p className="text-xs font-bold text-vert-600 uppercase tracking-wider mb-1">{produit.marque}</p>
                )}
                <Link to={`/produits/${produit.slug}`} onClick={onClose}>
                  <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2" style={{ fontFamily: 'Syne' }}>
                    {produit.nom}
                  </h3>
                </Link>
                <div className="mb-3"><Etoiles note={produit.note} /></div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="prix-principal text-2xl">{formatPrix(produit.prix_effectif)} MAD</span>
                  {produit.en_solde && <span className="prix-barre text-sm">{formatPrix(produit.prix)} MAD</span>}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{produit.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${produit.en_stock ? 'bg-vert-500' : 'bg-red-400'}`} />
                  <span className={`text-xs font-semibold ${produit.en_stock ? 'text-vert-700' : 'text-red-600'}`}>
                    {produit.en_stock ? `En stock (${produit.stock} disponibles)` : 'Rupture de stock'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:text-gray-300">−</button>
                    <span className="w-10 text-center font-semibold border-x border-gray-200 h-9 flex items-center justify-center text-sm">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(produit.stock, q + 1))} disabled={qty >= produit.stock}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:text-gray-300">+</button>
                  </div>
                  <button
                    onClick={handleAjouter}
                    disabled={!produit.en_stock}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${ajoute ? 'bg-vert-500 text-white' : 'btn-vert'}`}
                  >
                    {ajoute ? <><Check className="w-4 h-4 inline" /> Ajouté !</> : <><ShoppingCart className="w-4 h-4 inline" /> Ajouter</>}
                  </button>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => basculer(produit.id)}
                    aria-pressed={estFavori}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${estFavori ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Heart className={`w-4 h-4 inline mr-1 ${estFavori ? 'fill-red-500 text-red-500' : ''}`} />
                    {estFavori ? 'Dans vos favoris' : 'Favori'}
                  </button>
                  <Link to={`/produits/${produit.slug}`} onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-vert-600 text-vert-700 text-sm font-semibold text-center hover:bg-vert-50 transition-colors">
                    Voir le détail
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
