import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="relative mb-8">
          <div className="text-[120px] font-extrabold text-gray-100 leading-none" style={{ fontFamily: 'Syne' }}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne' }}>
          Page introuvable
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-vert inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <Link to="/produits" className="btn-blanc">
            Voir nos produits
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { to: '/produits?categorie=soins-visage', label: '🧴 Soins visage' },
            { to: '/produits?categorie=vitamines', label: '💊 Vitamines' },
            { to: '/produits?categorie=bebe-maman', label: '👶 Bébé' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
