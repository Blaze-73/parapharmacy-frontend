import { Clock, Truck, Flame, AlertCircle } from 'lucide-react'
import { formatDateLivraison } from '../../utils/format.js'

export function StockUrgence({ stock, enStock, compact = false }) {
  if (!enStock) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
        <AlertCircle className="w-3.5 h-3.5" /> Rupture de stock
      </span>
    )
  }
  if (stock > 0 && stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
        <Flame className="w-3.5 h-3.5" />
        {compact ? `Plus que ${stock} en stock !` : `Plus que ${stock} exemplaires en stock !`}
      </span>
    )
  }
  return null
}

export function DelaiLivraison({ compact = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${compact ? 'text-[11px]' : 'text-xs'} text-gray-500`}>
      <Truck className="w-3.5 h-3.5 text-vert-600" />
      Livré entre {formatDateLivraison()}
    </span>
  )
}

export function CommandeAvant() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <Clock className="w-3.5 h-3.5 text-vert-600" />
      Commandez avant 17h — expédition aujourd'hui
    </span>
  )
}
