import { Check, Clock, Truck, PackageCheck, XCircle, Inbox } from 'lucide-react'

const ETAPES = [
  { v: 'en_attente', label: 'En attente',  icone: Inbox },
  { v: 'confirmee',  label: 'Confirmée',   icone: Check },
  { v: 'expediee',   label: 'Expédiée',    icone: Truck },
  { v: 'livree',     label: 'Livrée',      icone: PackageCheck },
]

export default function SuiviCommande({ statut, compact = false }) {
  const index = ETAPES.findIndex(e => e.v === statut)
  const annulee = statut === 'annulee'

  if (annulee) {
    return (
      <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-4 h-4 text-red-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-red-700">Commande annulée</p>
          {!compact && <p className="text-xs text-red-500">Cette commande a été annulée et ne sera pas livrée.</p>}
        </div>
      </div>
    )
  }

  const actuel = index === -1 ? 0 : index

  return (
    <div className={compact ? '' : 'carte p-5'}>
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        <Clock className="w-4 h-4" />
        <p className="text-xs font-semibold uppercase tracking-widest">Suivi de commande</p>
      </div>
      <ol className="flex items-center">
        {ETAPES.map((e, i) => {
          const done = i < actuel
          const current = i === actuel
          const Icone = e.icone
          return (
            <li key={e.v} className={`flex items-center ${i < ETAPES.length - 1 ? 'flex-1' : 'flex-shrink-0'}`}>
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                    done ? 'bg-vert-600 text-white'
                      : current ? 'bg-vert-100 text-vert-700 ring-2 ring-vert-500 ring-offset-1'
                      : 'bg-gray-100 text-gray-400',
                  ].join(' ')}
                  aria-current={current ? 'step' : undefined}
                >
                  {done ? <Check className="w-4 h-4" /> : <Icone className={`w-4 h-4 ${current ? 'animate-pulse' : ''}`} />}
                </div>
                <span className={`mt-1.5 text-[10px] sm:text-xs font-semibold text-center whitespace-nowrap ${current ? 'text-vert-700' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                  {e.label}
                </span>
              </div>
              {i < ETAPES.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 h-1 rounded-full overflow-hidden bg-gray-100 mb-5">
                  <div
                    className={`h-full bg-vert-600 transition-all ${done ? 'w-full' : current ? 'w-1/2' : 'w-0'}`}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
