import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { usePanier } from '../../store/index.js'
import CategoryIcon from '../CategoryIcon.jsx'
export default function PanierDrawer() {
  const { articles, ouvert, fermer, modifierQuantite, retirerArticle, sousTotal } = usePanier()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Close drawer whenever the route changes
  useEffect(() => {
    fermer()
  }, [location.pathname])

  const sous       = sousTotal()
  const livraison  = sous > 0 && sous < 300 ? 30 : 0
  const total      = sous + livraison
  const nbArticles = articles.reduce((t, a) => t + a.quantite, 0)

  return (
    <AnimatePresence>
      {ouvert && (
        <>
          {/* Overlay — clicking closes drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={fermer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-vert-600" />
                <h2 className="font-bold text-gray-900 text-lg">Mon panier</h2>
                {nbArticles > 0 && (
                  <span className="w-6 h-6 bg-vert-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                    {nbArticles}
                  </span>
                )}
              </div>
              <button
                onClick={fermer}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-9 h-9 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Panier vide</h3>
                  <p className="text-sm text-gray-400 mb-6">Ajoutez des produits pour commencer</p>
                  <button
                    onClick={() => { fermer(); navigate('/produits') }}
                    className="btn-vert text-sm"
                  >
                    Voir les produits
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {articles.map(({ produit, quantite }) => (
                    <motion.div
                      key={produit.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                    >
                      <Link
                        to={`/produits/${produit.slug}`}
                        onClick={fermer}
                        className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden"
                      >
                        {produit.image
                          ? <img src={produit.image} alt={produit.nom} className="w-full h-full object-contain p-1" />
                          : <CategoryIcon slug={produit.categorie?.slug} className="w-7 h-7 text-gray-300" />
                        }
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/produits/${produit.slug}`}
                          onClick={fermer}
                          className="text-sm font-semibold text-gray-900 hover:text-vert-700 line-clamp-2 leading-snug transition-colors"
                        >
                          {produit.nom}
                        </Link>
                        {produit.marque && <p className="text-xs text-gray-400 mt-0.5">{produit.marque}</p>}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => modifierQuantite(produit.id, quantite - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold border-x border-gray-200 h-8 flex items-center justify-center">
                              {quantite}
                            </span>
                            <button
                              onClick={() => modifierQuantite(produit.id, quantite + 1)}
                              disabled={quantite >= produit.stock}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:text-gray-200 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => retirerArticle(produit.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {(Number(produit.prix_effectif) * quantite).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">MAD</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {articles.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-semibold">{sous.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className={`font-semibold ${livraison === 0 ? 'text-vert-600' : ''}`}>
                      {livraison === 0 ? 'GRATUITE' : `${livraison} MAD`}
                    </span>
                  </div>
                  {livraison > 0 && (
                    <p className="text-xs text-gray-400">
                      Plus que {(300 - sous).toFixed(0)} MAD pour la livraison gratuite
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="prix-principal text-lg">{total.toFixed(2)} MAD</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to="/panier"   onClick={fermer} className="btn-blanc flex-1 text-sm py-3">Voir le panier</Link>
                  <Link to="/checkout" onClick={fermer} className="btn-vert flex-1 text-sm py-3">
                    Commander <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
