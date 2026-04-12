import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function CommandeOk() {
  const { numero } = useParams()
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
        <div className="w-24 h-24 bg-vert-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-vert-600" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">Merci pour votre confiance. Votre commande a bien été enregistrée.</p>
        <p className="text-sm text-gray-400 mb-8">Numéro : <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{numero}</span></p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/mes-commandes" className="btn-blanc">Voir mes commandes</Link>
          <Link to="/produits" className="btn-vert">Continuer mes achats</Link>
        </div>
      </motion.div>
    </div>
  )
}
