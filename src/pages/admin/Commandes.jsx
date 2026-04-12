import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/index.js'
import toast from 'react-hot-toast'

const STATUTS = [
  { v: 'en_attente', l: 'En attente',  cls: 'badge-jaune' },
  { v: 'confirmee',  l: 'Confirmée',   cls: 'badge-vert' },
  { v: 'expediee',   l: 'Expédiée',    cls: 'badge-bleu' },
  { v: 'livree',     l: 'Livrée',      cls: 'badge-vert' },
  { v: 'annulee',    l: 'Annulée',     cls: 'badge-rouge' },
]

export default function AdminCommandes() {
  const qc = useQueryClient()
  const [filtreStatut, setFiltreStatut] = useState('')
  const [detail, setDetail] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-commandes', filtreStatut],
    queryFn:  () => adminApi.commandes(filtreStatut ? { statut: filtreStatut } : undefined),
  })

  const mutation = useMutation({
    mutationFn: ({ id, statut }) => adminApi.statutCommande(id, statut),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-commandes'] })
      toast.success('Statut mis à jour.')
    },
  })

  const commandes = data?.data?.data || []

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Commandes</h1>
          <p className="text-gray-500 text-sm mt-1">{commandes.length} commande{commandes.length !== 1 ? 's' : ''}</p>
        </div>
        <select
          value={filtreStatut}
          onChange={e => setFiltreStatut(e.target.value)}
          className="champ py-2 w-auto text-sm"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="carte overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Numéro', 'Client', 'Téléphone', 'Total', 'Date', 'Statut', 'Changer'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {commandes.map(c => {
                const st = STATUTS.find(s => s.v === c.statut)
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetail(detail?.id === c.id ? null : c)}
                        className="font-mono font-semibold text-vert-700 hover:underline"
                      >
                        {c.numero}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.user?.nom}</p>
                      <p className="text-xs text-gray-400">{c.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {c.user?.telephone ? (
                        <a
                          href={`tel:${c.user.telephone}`}
                          className="flex items-center gap-1.5 text-vert-700 hover:text-vert-800 font-medium text-sm hover:underline"
                        >
                          📞 {c.user.telephone}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {Number(c.total).toFixed(2)} MAD
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {st && <span className={st.cls}>{st.l}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.statut}
                        onChange={e => mutation.mutate({ id: c.id, statut: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-vert-400"
                      >
                        {STATUTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
              {commandes.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-gray-400">Aucune commande</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail panel */}
      {detail && (
        <div className="mt-6 carte p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Syne' }}>
              Détail — {detail.numero}
            </h2>
            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-sm">
              Fermer ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Client</p>
              <p className="font-semibold text-gray-900">{detail.user?.nom}</p>
              <p className="text-sm text-gray-600">{detail.user?.email}</p>
              {detail.user?.telephone && (
                <a href={`tel:${detail.user.telephone}`} className="text-sm text-vert-700 hover:underline font-medium">
                  📞 {detail.user.telephone}
                </a>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Livraison</p>
              <p className="text-sm text-gray-700">{detail.adresse_livraison}</p>
              <p className="text-sm text-gray-700">{detail.ville} {detail.code_postal}</p>
              {detail.notes && <p className="text-sm text-gray-500 italic mt-1">Note : {detail.notes}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Paiement : <span className="font-semibold">{detail.paiement === 'livraison' ? 'À la livraison' : 'Carte bancaire'}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Livraison : {Number(detail.frais_livraison).toFixed(2)} MAD</p>
              <p className="font-bold text-gray-900 text-lg">Total : {Number(detail.total).toFixed(2)} MAD</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
