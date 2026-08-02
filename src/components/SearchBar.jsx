import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import ImageProduit from './product/ImageProduit.jsx'
import { formatPrix } from '../utils/format.js'

export const RECHERCHES_POPULAIRES = ['Vitamine C', 'Sérum', 'Crème solaire', 'Shampoing', 'Bébé', 'Collagène']

export default function SearchBar({ mobile = false, inputRef = null }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSugg, setShowSugg] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef  = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSugg(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setSuggestions([]); setShowSugg(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await produitsApi.liste({ recherche: q.trim(), par_page: 6 })
        setSuggestions(res.data?.data || [])
        setShowSugg(true)
      } catch {}
      finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [q])

  function handleSubmit(e) {
    e.preventDefault()
    if (!q.trim()) return
    setShowSugg(false)
    navigate(`/produits?recherche=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  function handleSelect(produit) {
    setShowSugg(false)
    setQ('')
    navigate(`/produits/${produit.slug}`)
  }

  const inputClass = mobile
    ? 'w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vert-500 focus:bg-white transition-all'
    : 'w-full pl-10 pr-14 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vert-500 focus:border-transparent focus:bg-white transition-all'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${mobile ? 'left-3 w-4 h-4' : 'left-3.5 w-4 h-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setShowSugg(true)}
            placeholder={mobile ? 'Rechercher…' : 'Rechercher un produit, une marque…'}
            className={inputClass}
          />
          {q ? (
            <button type="button" onClick={() => { setQ(''); setSuggestions([]); setShowSugg(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            !mobile && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 bg-white text-[11px] font-semibold text-gray-400">
                  /
                </kbd>
              </span>
            )
          )}
        </div>
        {!mobile && (
          <button type="submit" className="btn-vert py-2.5 px-4 text-sm flex-shrink-0">
            Chercher
          </button>
        )}
      </form>

      <AnimatePresence>
        {showSugg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {!q.trim() && (
              <div className="px-4 py-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Recherches populaires
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {RECHERCHES_POPULAIRES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setShowSugg(false); setQ(''); navigate(`/produits?recherche=${encodeURIComponent(t)}`) }}
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-vert-50 hover:text-vert-700 px-2.5 py-1.5 rounded-full transition-colors"
                    >
                      🔍 {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-vert-500 rounded-full animate-spin" />
                Recherche en cours…
              </div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                Aucun résultat pour <strong>"{q}"</strong>
              </div>
            )}

            {!loading && suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  Suggestions
                </div>
                {suggestions.map((produit) => (
                  <button
                    key={produit.id}
                    onClick={() => handleSelect(produit)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <ImageProduit produit={produit} className="w-full h-full p-0.5" iconeClass="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{produit.nom}</p>
                      <p className="text-xs text-gray-400">{produit.marque || produit.categorie?.nom}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-vert-700">
                        {formatPrix(produit.prix_effectif)} MAD
                      </p>
                      {produit.en_solde && (
                        <p className="text-xs text-red-500 line-through">{formatPrix(produit.prix)}</p>
                      )}
                    </div>
                  </button>
                ))}

                <button
                  onClick={handleSubmit.bind(null, { preventDefault: () => {} })}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setShowSugg(false)
                    navigate(`/produits?recherche=${encodeURIComponent(q.trim())}`)
                    setQ('')
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-vert-700 hover:bg-vert-50 transition-colors text-center border-t border-gray-100 flex items-center justify-center gap-1.5"
                >
                  Voir tous les résultats pour "{q}"
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
