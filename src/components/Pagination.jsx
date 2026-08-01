import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPage }) {
  if (!meta || meta.derniere_page <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <button
        disabled={meta.page_actuelle <= 1}
        onClick={() => onPage(meta.page_actuelle - 1)}
        aria-label="Page précédente"
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {Array.from({ length: meta.derniere_page }, (_, i) => i + 1)
        .filter(p => p === 1 || p === meta.derniere_page || Math.abs(p - meta.page_actuelle) <= 2)
        .map((p, i, arr) => (
          <span key={p} className="flex items-center gap-2">
            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 text-sm">…</span>}
            <button
              onClick={() => onPage(p)}
              aria-label={`Page ${p}`}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                p === meta.page_actuelle
                  ? 'bg-vert-600 text-white shadow-md'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          </span>
        ))
      }

      <button
        disabled={meta.page_actuelle >= meta.derniere_page}
        onClick={() => onPage(meta.page_actuelle + 1)}
        aria-label="Page suivante"
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}
