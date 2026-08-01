import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import ImageProduit from '../components/product/ImageProduit.jsx'
import BarreLivraison from '../components/BarreLivraison.jsx'
import { formatPrix } from '../utils/format.js'
import { SITE } from '../config.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { usePanier } from '../store/index.js'
import usePageMeta from '../hooks/usePageMeta.js'

export default function Panier() {
  usePageMeta({ title: 'Mon panier', path: '/panier', noindex: true })
  const { articles, modifierQuantite, retirerArticle, sousTotal, viderPanier } = usePanier()
  const navigate = useNavigate()
  const sous = sousTotal()
  const livraison = sous > 0 && sous < SITE.fraisLivraisonGratuite ? SITE.fraisLivraison : 0
  const total = sous + livraison

  if (articles.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-5" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
      <p className="text-gray-400 mb-8 text-sm">Ajoutez des produits pour continuer vos achats.</p>
      <Link to="/produits" className="btn-vert">Voir nos produits</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Mon panier' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {articles.map(({ produit, quantite }) => (
            <div key={produit.id} className="carte p-4 flex gap-4 items-start">
              <Link to={`/produits/${produit.slug}`}
                className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden">
                <ImageProduit produit={produit} className="w-full h-full p-1" iconeClass="w-8 h-8" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produits/${produit.slug}`}
                  className="font-semibold text-gray-900 hover:text-vert-700 transition-colors line-clamp-2 text-sm sm:text-base">
                  {produit.nom}
                </Link>
                {produit.marque && <p className="text-xs text-gray-400 mt-0.5">{produit.marque}</p>}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => modifierQuantite(produit.id, quantite - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold border-x border-gray-200 h-9 flex items-center justify-center">
                      {quantite}
                    </span>
                    <button onClick={() => modifierQuantite(produit.id, quantite + 1)}
                      disabled={quantite >= produit.stock}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:text-gray-200">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      {formatPrix(Number(produit.prix_effectif) * quantite)} MAD
                    </span>
                    <button onClick={() => retirerArticle(produit.id)}
                      className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => { if (window.confirm('Vider tout le panier ?')) viderPanier() }}
            className="text-sm text-red-400 hover:text-red-600 py-2">
            Vider le panier
          </button>
        </div>

        <div className="carte p-6 h-fit">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Récapitulatif</h2>
          <BarreLivraison sousTotal={sous} />
          <div className="space-y-3 text-sm mt-3">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total ({articles.reduce((t,a) => t+a.quantite, 0)} articles)</span>
              <span className="font-semibold">{formatPrix(sous)} MAD</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span className={`font-semibold ${livraison === 0 ? 'text-vert-600' : ''}`}>
                {livraison === 0 ? 'GRATUITE' : `${formatPrix(livraison)} MAD`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100 text-base">
              <span>Total</span>
              <span className="prix-principal text-xl">{formatPrix(total)} MAD</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-vert w-full mt-5 py-3.5">
            Commander maintenant <ArrowRight className="w-4 h-4" />
          </button>
          <Link to="/produits" className="block text-center text-sm text-vert-600 hover:underline mt-3">
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}
