import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import CarteProduit from '../components/product/CarteProduit.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { useWishlist } from '../store/index.js'
import usePageMeta from '../hooks/usePageMeta.js'

export default function Favoris() {
  usePageMeta({ title: 'Mes favoris', path: '/favoris', noindex: true })
  const { ids } = useWishlist()

  const { data, isLoading } = useQuery({
    queryKey: ['favoris'],
    queryFn:  () => produitsApi.liste({ par_page: 999 }),
    staleTime: 5 * 60 * 1000,
  })

  const tous    = data?.data?.data || []
  const favoris = tous.filter(p => ids.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Mes favoris' }]} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
        <p className="text-gray-500 text-sm mt-1">
          {favoris.length} produit{favoris.length !== 1 ? 's' : ''} dans votre liste
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="carte overflow-hidden animate-pulse">
              <div className="bg-gray-200 aspect-square" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : favoris.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart className="w-9 h-9 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
            Touchez le cœur sur un produit pour le retrouver ici, en un instant.
          </p>
          <Link to="/produits" className="btn-vert">Découvrir les produits</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favoris.map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
        </div>
      )}
    </div>
  )
}
