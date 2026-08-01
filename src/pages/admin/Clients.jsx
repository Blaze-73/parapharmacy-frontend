import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { adminApi } from '../../api/index.js'
import Pagination from '../../components/Pagination.jsx'
import usePageMeta from '../../hooks/usePageMeta.js'

export default function AdminClients() {
  usePageMeta({ title: 'Admin — Clients', path: '/admin/clients', noindex: true })
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-clients', recherche, page],
    queryFn:  () => adminApi.utilisateurs({ recherche: recherche || undefined, page, par_page: 10 }),
  })
  const clients = data?.data?.data || []
  const meta    = data?.data?.meta

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Clients</h1>
        <p className="text-gray-500 text-sm mt-1">
          {meta ? meta.total : clients.length} client{(meta ? meta.total : clients.length) !== 1 ? 's' : ''} inscrits
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={recherche}
          onChange={e => { setRecherche(e.target.value); setPage(1) }}
          placeholder="Rechercher nom, email, téléphone…"
          className="champ pl-10"
        />
        {recherche && (
          <button
            onClick={() => { setRecherche(''); setPage(1) }}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="carte overflow-x-auto">
          {/* Desktop table */}
          <table className="w-full text-sm min-w-[560px] hidden sm:table">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Nom','Email','Téléphone','Commandes','Inscrit le'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.nom}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500">{c.telephone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="badge-vert">{c.commandes_count}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-400">Aucun client</td></tr>
              )}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {clients.map(c => (
              <div key={c.id} className="px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900 text-sm">{c.nom}</p>
                  <span className="badge-vert text-xs">{c.commandes_count} cmd</span>
                </div>
                <p className="text-xs text-gray-600">{c.email}</p>
                <p className="text-xs text-gray-400">{c.telephone || '—'} · {new Date(c.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
            {clients.length === 0 && (
              <p className="px-4 py-10 text-center text-gray-400 text-sm">Aucun client</p>
            )}
          </div>
        </div>
      )}

      <Pagination meta={meta} onPage={setPage} />
    </div>
  )
}
