import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { useRecents } from '../../store/index.js'
import ImageProduit from './ImageProduit.jsx'
import { formatPrix } from '../../utils/format.js'

export default function RecentsProduits({ currentId, limit = 8, titre = 'Récemment consultés' }) {
  const { produits } = useRecents()
  const recents = produits.filter(p => p.id !== currentId).slice(0, limit)

  if (recents.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5" style={{ fontFamily: 'Syne' }}>
        <History className="w-6 h-6 text-vert-600" />
        {titre}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {recents.map(p => (
          <Link
            key={p.id}
            to={`/produits/${p.slug}`}
            className="carte overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square overflow-hidden">
              <ImageProduit produit={p} className="w-full h-full group-hover:scale-105 transition-transform" iconeClass="w-10 h-10" />
              {!p.en_stock && (
                <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-gray-500">
                  Épuisé
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5">{p.nom}</p>
              <span className="prix-principal text-sm">{formatPrix(p.prix_effectif)} MAD</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
