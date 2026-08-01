import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta.js'
import SuiviCommande from '../components/SuiviCommande.jsx'
import { SITE } from '../config.js'
import { lienWhatsApp } from '../utils/format.js'

export default function CommandeOk() {
  const { numero } = useParams()
  usePageMeta({ title: 'Commande confirmée', path: `/commande-confirmee/${numero}`, noindex: true })

  const messageWhatsApp = numero
    ? `Bonjour ${SITE.nom} 👋\n\nJe viens de passer la commande ${numero}.\nPourriez-vous me confirmer sa prise en charge ?`
    : 'Bonjour, je viens de passer commande sur votre site.'

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
        <div className="w-24 h-24 bg-vert-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-vert-600" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">Merci pour votre confiance. Votre commande a bien été enregistrée.</p>
        <p className="text-sm text-gray-400 mb-8">
          Numéro : <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{numero}</span>
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <SuiviCommande statut="en_attente" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 text-center">
        <a
          href={lienWhatsApp(SITE.contact.telephone, messageWhatsApp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 btn-blanc w-full sm:w-auto mb-3"
        >
          <MessageCircle className="w-4 h-4" />
          Confirmer via WhatsApp
        </a>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/mes-commandes" className="btn-blanc">Voir mes commandes</Link>
          <Link to="/produits" className="btn-vert">Continuer mes achats</Link>
        </div>
      </motion.div>
    </div>
  )
}
