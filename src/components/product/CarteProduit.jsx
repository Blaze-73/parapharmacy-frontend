import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react'
import ImageProduit from './ImageProduit.jsx'
import QuickView from './QuickView.jsx'
import { StockUrgence, DelaiLivraison } from './StockUrgence.jsx'
import { usePanier, useWishlist } from '../../store/index.js'
import { formatPrix } from '../../utils/format.js'
import toast from 'react-hot-toast'
import { useState } from 'react'

function Etoiles({ note, size = 12 }) {
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
      <span className="text-xs font-semibold text-gray-500 ml-1">{note}</span>
    </div>
  )
}

export default function CarteProduit({ produit, index = 0 }) {
  const { ajouterArticle, ouvrir } = usePanier()
  const { ids, basculer } = useWishlist()
  const estFavori = ids.includes(produit.id)
  const [imgError, setImgError] = useState(false)
  const [quickView, setQuickView] = useState(false)

  function handleAjouter(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!produit.en_stock) { toast.error('Ce produit est épuisé'); return }
    ajouterArticle(produit)
    toast.success('Ajouté au panier !')
    ouvrir()
  }

  function handleFavori(e) {
    e.preventDefault()
    e.stopPropagation()
    const devientFavori = !estFavori
    basculer(produit.id)
    if (devientFavori) toast.success('Ajouté aux favoris ❤️')
    else toast('Retiré des favoris')
  }

  function handleQuickView(e) {
    e.preventDefault()
    e.stopPropagation()
    setQuickView(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/produits/${produit.slug}`} className="carte-produit group block">

        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
          {produit.en_solde && produit.remise && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
              -{produit.remise}%
            </div>
          )}
          {produit.en_vedette && !produit.en_solde && (
            <div className="absolute top-2 left-2 z-10 bg-vert-600 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              ⭐ Vedette
            </div>
          )}
          <button
            onClick={handleFavori}
            aria-label={estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={estFavori}
            className="absolute top-2 right-2 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm transition-all"
          >
            <Heart className={`w-4 h-4 transition-colors ${estFavori ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
          </button>
          {produit.note >= 4.8 && !produit.en_solde && !produit.en_vedette && (
            <div className="absolute bottom-2 left-2 z-10 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              🏆 Top
            </div>
          )}
          {!produit.en_stock && (
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
              <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow border border-gray-200">
                Épuisé
              </span>
            </div>
          )}

          <div className="img-produit w-full h-full">
            {produit.image && !imgError ? (
              <img
                src={produit.image}
                alt={produit.nom}
                className="w-full h-full object-contain p-4 drop-shadow-sm"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImageProduit produit={produit} className="w-full h-full" iconeClass="w-14 h-14" />
            )}
          </div>

          {/* Quick view — appears on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-semibold rounded-xl shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Aperçu rapide
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          {produit.marque && (
            <p className="text-xs font-bold text-vert-600 uppercase tracking-wider mb-1 truncate">
              {produit.marque}
            </p>
          )}
          <h3
            className="text-sm font-semibold text-gray-900 leading-snug mb-1"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {produit.nom}
          </h3>

          <div className="mb-1.5">
            <StockUrgence stock={produit.stock} enStock={produit.en_stock} compact />
          </div>

          {produit.note > 0 && (
            <div className="mb-2">
              <Etoiles note={produit.note} size={11} />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="prix-principal text-base sm:text-lg">
                {formatPrix(produit.prix_effectif)}
                <span className="text-xs font-normal ml-0.5">MAD</span>
              </span>
              {produit.en_solde && (
                <span className="prix-barre text-xs ml-1.5">
                  {formatPrix(produit.prix)}
                </span>
              )}
            </div>
            <button
              onClick={handleAjouter}
              disabled={!produit.en_stock}
              aria-label="Ajouter au panier"
              className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                !produit.en_stock
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-vert-50 text-vert-600 hover:bg-vert-600 hover:text-white active:scale-90'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-gray-100">
            <DelaiLivraison compact />
          </div>
        </div>
      </Link>

      <QuickView produit={quickView ? produit : null} onClose={() => setQuickView(false)} />
    </motion.div>
  )
}
