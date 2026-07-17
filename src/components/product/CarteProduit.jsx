import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import CategoryIcon from '../CategoryIcon.jsx'
import { usePanier } from '../../store/index.js'
import toast from 'react-hot-toast'

const GRADIENTS = {
  'soins-visage':     'from-pink-50 to-rose-100',
  'vitamines':        'from-amber-50 to-yellow-100',
  'bebe-maman':       'from-sky-50 to-blue-100',
  'cheveux':          'from-violet-50 to-purple-100',
  'solaires':         'from-orange-50 to-amber-100',
  'hygiene':          'from-teal-50 to-cyan-100',
  'nutrition':        'from-lime-50 to-green-100',
  'premiers-secours': 'from-red-50 to-rose-100',
}

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
  const slug     = produit.categorie?.slug || ''
  const gradient = GRADIENTS[slug] || 'from-gray-50 to-slate-100'
  const emoji    = produit.categorie?.icone || '💊'
  const catSlug  = produit.categorie?.slug || ''

  function handleAjouter(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!produit.en_stock) { toast.error('Ce produit est épuisé'); return }
    ajouterArticle(produit)
    toast.success('Ajouté au panier !')
    ouvrir()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/produits/${produit.slug}`} className="carte-produit group block">

        {/* Image */}
        <div
          className={`relative bg-gradient-to-br ${gradient} overflow-hidden`}
          style={{ aspectRatio: '1/1' }}
        >
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
          {produit.note >= 4.8 && !produit.en_solde && !produit.en_vedette && (
            <div className="absolute top-2 right-2 z-10 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
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

          <div className="img-produit w-full h-full flex items-center justify-center p-4">
            {produit.image ? (
              <img
                src={produit.image}
                alt={produit.nom}
                className="w-full h-full object-contain drop-shadow-sm"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ display: produit.image ? 'none' : 'flex' }}
            >
              <CategoryIcon slug={catSlug} className="w-12 h-12 text-gray-300" />
            </div>
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

          {produit.note > 0 && (
            <div className="mb-2">
              <Etoiles note={produit.note} size={11} />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="prix-principal text-base sm:text-lg">
                {Number(produit.prix_effectif).toFixed(2)}
                <span className="text-xs font-normal ml-0.5">MAD</span>
              </span>
              {produit.en_solde && (
                <span className="prix-barre text-xs ml-1.5">
                  {Number(produit.prix).toFixed(2)}
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
        </div>
      </Link>
    </motion.div>
  )
}
