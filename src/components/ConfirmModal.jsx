import { AnimatePresence, motion } from 'framer-motion'
import { X, LogOut, AlertTriangle } from 'lucide-react'

export default function ConfirmModal({
  ouvert,
  titre = 'Confirmer',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  tone = 'default',
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              role="alertdialog"
              aria-modal="true"
              aria-label={titre}
              className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-start justify-between px-5 pt-5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-vert-50 text-vert-600'
                }`}>
                  {tone === 'danger' ? <LogOut className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <button
                  onClick={onCancel}
                  aria-label="Fermer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 pt-3">
                <h3 className="text-lg font-bold text-gray-900">{titre}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{message}</p>
              </div>

              <div className="flex gap-2.5 p-5">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-colors ${
                    tone === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-vert-600 hover:bg-vert-700'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
