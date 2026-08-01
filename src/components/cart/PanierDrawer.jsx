import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePanier } from '../../store/index.js'
import useFocusTrap from '../../hooks/useFocusTrap.js'
import ImageProduit from '../product/ImageProduit.jsx'
import BarreLivraison from '../BarreLivraison.jsx'
import { formatPrix } from '../../utils/format.js'
import { produitsApi } from '../../api/index.js'
import { SITE } from '../../config.js'
import toast from 'react-hot-toast'

export default function PanierDrawer() {
  const { articles, ouvert, fermer, modifierQuantite, retirerArticle, sousTotal, ajouterArticle } = usePanier()
  const navigate   = useNavigate()
  const location   = useLocation()
  const drawerRef  = useFocusTrap(ouvert, fermer)

  const { data: allData } = useQuery({
    queryKey: ['panier-suggestions'],
    queryFn:  () => produitsApi.liste({ par_page: 999 }),
    staleTime: 5 * 60 * 1000,
  })
  const tousProduits = allData?.data?.data || []

  const suggestions = useMemo(() => {
    if (articles.length === 0 || tousProduits.length === 0) return []
    const idsPanier = new Set(articles.map(a => a.produit.id))
    const catIds = new Set(articles.map(a => a.produit.categorie_id))
    return tousProduits
      .filter(p => p.en_stock && p.actif !== false && !idsPanier.has(p.id))
      .map(p => ({ ...p, memeCat: catIds.has(p.categorie_id) }))
      .sort((a, b) => (b.memeCat - a.memeCat) || (b.note || 0) - (a.note || 0))
      .slice(0, 3)
  }, [articles, tousProduits])

  // Close drawer whenever the route changes
  useEffect(() => {
    fermer()
  }, [location.pathname])

  const sous       = sousTotal()
  const livraison  = sous > 0 && sous < SITE.fraisLivraisonGratuite ? SITE.fraisLivraison : 0
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
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
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
                aria-label="Fermer le panier"
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
                        <ImageProduit produit={produit} className="w-full h-full p-1" iconeClass="w-7 h-7" />
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
                          {formatPrix(Number(produit.prix_effectif) * quantite)}
                        </p>
                        <p className="text-xs text-gray-400">MAD</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Cross-sell suggestions */}
              {articles.length > 0 && suggestions.length > 0 && (
                <div className="pt-5 mt-2 border-t border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Complétez votre panier
                  </p>
                  <div className="space-y-2.5">
                    {suggestions.map(p => (
                      <div key={p.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-2.5">
                        <Link
                          to={`/produits/${p.slug}`}
                          onClick={fermer}
                          className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden"
                        >
                          <ImageProduit produit={p} className="w-full h-full p-0.5" iconeClass="w-5 h-5" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/produits/${p.slug}`} onClick={fermer} className="text-xs font-semibold text-gray-800 hover:text-vert-700 line-clamp-1 transition-colors">
                            {p.nom}
                          </Link>
                          <p className="text-xs font-bold text-vert-700">{formatPrix(p.prix_effectif)} MAD</p>
                        </div>
                        <button
                          onClick={() => {
                            ajouterArticle(p, 1)
                            toast.success('Ajouté au panier', { id: `sugg-${p.id}` })
                          }}
                          aria-label={`Ajouter ${p.nom} au panier`}
                          className="w-8 h-8 flex-shrink-0 rounded-lg bg-vert-600 hover:bg-vert-700 text-white flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {articles.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
                <BarreLivraison sousTotal={sous} compact />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-semibold">{formatPrix(sous)} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className={`font-semibold ${livraison === 0 ? 'text-vert-600' : ''}`}>
                      {livraison === 0 ? 'GRATUITE' : `${formatPrix(livraison)} MAD`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="prix-principal text-lg">{formatPrix(total)} MAD</span>
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
