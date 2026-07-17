import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import CategoryIcon from '../components/CategoryIcon.jsx'
import CarteProduit from '../components/product/CarteProduit.jsx'

export default function Produits() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtreMobile, setFiltreMobile] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('recherche') || '')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const p = new URLSearchParams(searchParams)
      if (searchInput.trim()) {
        p.set('recherche', searchInput.trim())
      } else {
        p.delete('recherche')
      }
      p.set('page', '1')
      setSearchParams(p)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filtres = {
    recherche: searchParams.get('recherche') || undefined,
    categorie: searchParams.get('categorie') || undefined,
    en_promo:  searchParams.get('en_promo')  || undefined,
    en_stock:  searchParams.get('en_stock')  || undefined,
    tri:       searchParams.get('tri')       || 'recent',
    page:      searchParams.get('page')      || '1',
    par_page:  '20',
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['produits', filtres],
    queryFn:  () => produitsApi.liste(filtres),
    placeholderData: prev => prev,
  })

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn:  produitsApi.categories,
    staleTime: 3_600_000,
  })

  const produits   = data?.data?.data    || []
  const meta       = data?.data?.meta
  const categories = catData?.data?.data || []

  function update(k, v) {
    const p = new URLSearchParams(searchParams)
    v ? p.set(k, v) : p.delete(k)
    p.set('page', '1')
    setSearchParams(p)
  }

  function reset() {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }

  function goPage(page) {
    const p = new URLSearchParams(searchParams)
    p.set('page', String(page))
    setSearchParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = !!(filtres.recherche || filtres.categorie || filtres.en_promo || filtres.en_stock)

  function FilterContent() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Filtres</h3>
          {hasFilters && (
            <button onClick={reset} className="text-xs font-semibold text-vert-600 hover:underline">
              Effacer tout
            </button>
          )}
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Catégorie</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="cat" checked={!filtres.categorie} onChange={() => update('categorie', '')} className="accent-vert-600" />
              <span className="text-sm text-gray-700">Toutes</span>
            </label>
            {categories.map(c => (
              <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="cat" checked={filtres.categorie === c.slug} onChange={() => update('categorie', c.slug)} className="accent-vert-600" />
                <span className="text-sm text-gray-700 group-hover:text-vert-700 transition-colors">
                  <CategoryIcon slug={c.slug} className="w-4 h-4 text-gray-500 inline-block align-middle" /> {c.nom}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filtres rapides</p>
          {[
            { k: 'en_promo', label: '🔥 En promotion' },
            { k: 'en_stock', label: '✅ En stock uniquement' },
          ].map(({ k, label }) => (
            <label key={k} className="flex items-center gap-2.5 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={!!searchParams.get(k)}
                onChange={e => update(k, e.target.checked ? 'true' : '')}
                className="accent-vert-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {filtres.categorie
            ? (categories.find(c => c.slug === filtres.categorie)?.nom || 'Produits')
            : filtres.recherche
              ? `Résultats pour "${filtres.recherche}"`
              : 'Tous les produits'
          }
        </h1>
        {meta && (
          <p className="text-gray-500 text-sm mt-1">
            {meta.total} produit{meta.total !== 1 ? 's' : ''}
            {isFetching && !isLoading && <span className="ml-2 text-vert-500 text-xs">• mise à jour…</span>}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Rechercher un produit, une marque…"
          className="champ pl-11 pr-10"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-7">
        {/* Desktop sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <div className="carte p-5 sticky top-24">
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <button
              onClick={() => setFiltreMobile(true)}
              className="md:hidden btn-blanc text-sm py-2 px-4 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {hasFilters && (
                <span className="w-5 h-5 bg-vert-600 text-white rounded-full text-xs flex items-center justify-center">!</span>
              )}
            </button>

            <select
              value={filtres.tri}
              onChange={e => update('tri', e.target.value)}
              className="champ py-2 w-auto text-sm cursor-pointer ml-auto"
            >
              <option value="recent">Plus récents</option>
              <option value="note">Mieux notés</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="nom">Nom A–Z</option>
            </select>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="carte overflow-hidden animate-pulse">
                  <div className="bg-gray-200 aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="flex justify-between mt-2">
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                      <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : produits.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 mb-6 text-sm">
                {filtres.recherche ? `Aucun résultat pour "${filtres.recherche}"` : 'Essayez de modifier vos filtres'}
              </p>
              <button onClick={reset} className="btn-vert">Voir tous les produits</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {produits.map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.derniere_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
              <button
                disabled={meta.page_actuelle <= 1}
                onClick={() => goPage(meta.page_actuelle - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {Array.from({ length: meta.derniere_page }, (_, i) => i + 1)
                .filter(p => p === 1 || p === meta.derniere_page || Math.abs(p - meta.page_actuelle) <= 2)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-400 text-sm">…</span>}
                    <button
                      onClick={() => goPage(p)}
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
                onClick={() => goPage(meta.page_actuelle + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtreMobile && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setFiltreMobile(false)} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }}
            className="fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-2xl overflow-y-auto md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Filtres</h3>
              <button onClick={() => setFiltreMobile(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <FilterContent />
              <button onClick={() => setFiltreMobile(false)} className="btn-vert w-full mt-6">
                Appliquer les filtres
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
