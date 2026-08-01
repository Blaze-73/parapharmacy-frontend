import { motion, AnimatePresence } from 'framer-motion'
import { Truck } from 'lucide-react'
import { formatPrix } from '../utils/format.js'
import { SITE } from '../config.js'

export default function BarreLivraison({ sousTotal, compact = false }) {
  const seuil = Number(SITE.fraisLivraisonGratuite) || 300
  const reste = Math.max(0, seuil - sousTotal)
  const pct   = Math.min(100, Math.round((sousTotal / seuil) * 100))
  const livre = reste <= 0

  if (sousTotal <= 0) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={livre ? 'ok' : 'reste'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={`rounded-xl ${compact ? 'p-2.5' : 'p-3'} ${livre ? 'bg-vert-50' : 'bg-amber-50'}`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Truck className={`w-4 h-4 flex-shrink-0 ${livre ? 'text-vert-600' : 'text-amber-600'}`} />
          {livre ? (
            <p className="text-xs font-bold text-vert-700">
              🎉 Livraison GRATUITE débloquée !
            </p>
          ) : (
            <p className="text-xs text-amber-800">
              Plus que <strong>{formatPrix(reste)} MAD</strong> pour la livraison gratuite
            </p>
          )}
        </div>
        <div className="h-1.5 w-full bg-white/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${livre ? 100 : pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full ${livre ? 'bg-vert-500' : 'bg-amber-500'}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
