import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, MapPin, User, Package, CreditCard } from 'lucide-react'
import { adminApi } from '../../api/index.js'
import { formatPrix } from '../../utils/format.js'
import Pagination from '../../components/Pagination.jsx'
import toast from 'react-hot-toast'
import usePageMeta from '../../hooks/usePageMeta.js'

const STATUTS = [
  { v: 'en_attente', l: 'En attente',  cls: 'badge-jaune' },
  { v: 'confirmee',  l: 'Confirmée',   cls: 'badge-vert' },
  { v: 'expediee',   l: 'Expédiée',    cls: 'badge-bleu' },
  { v: 'livree',     l: 'Livrée',      cls: 'badge-vert' },
  { v: 'annulee',    l: 'Annulée',     cls: 'badge-rouge' },
]

const TRANSITIONS = {
  en_attente: ['confirmee', 'annulee'],
  confirmee:  ['expediee', 'annulee'],
  expediee:   ['livree', 'annulee'],
  livree:     [],
  annulee:    [],
}

function numWhatsApp(num) {
  let n = (num || '').replace(/[^\d]/g, '')
  if (n.startsWith('0')) n = '212' + n.slice(1)
  return n
}

function OptionsStatut({ statut, onChange, className }) {
  const suivants = TRANSITIONS[statut] || []
  if (suivants.length === 0) {
    return <span className="text-xs text-gray-400 italic">—</span>
  }
  return (
    <select
      value={statut}
      onChange={e => onChange(e.target.value)}
      className={className}
    >
      {STATUTS.filter(s => s.v === statut || suivants.includes(s.v)).map(s => (
        <option key={s.v} value={s.v}>{s.v === statut ? `${s.l} (actuel)` : s.l}</option>
      ))}
    </select>
  )
}

export default function AdminCommandes() {
  usePageMeta({ title: 'Admin — Commandes', path: '/admin/commandes', noindex: true })
  const qc = useQueryClient()
  const [filtreStatut, setFiltreStatut] = useState('')
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!detail) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [detail])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-commandes', filtreStatut, recherche, page],
    queryFn:  () => adminApi.commandes({
      statut: filtreStatut || undefined,
      recherche: recherche || undefined,
      page,
      par_page: 10,
    }),
  })

  const mutation = useMutation({
    mutationFn: ({ id, statut }) => adminApi.statutCommande(id, statut),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-commandes'] })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Transition de statut invalide'),
  })

  const commandes = data?.data?.data || []
  const meta       = data?.data?.meta

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Commandes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {meta ? meta.total : commandes.length} commande{(meta ? meta.total : commandes.length) !== 1 ? 's' : ''}
          </p>
        </div>
        <select
          value={filtreStatut}
          onChange={e => { setFiltreStatut(e.target.value); setPage(1) }}
          className="champ py-2 w-auto text-sm"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={recherche}
          onChange={e => { setRecherche(e.target.value); setPage(1) }}
          placeholder="Rechercher numéro, client, email, ville…"
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
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="carte overflow-x-auto">
          {/* Desktop table */}
          <table className="w-full text-sm min-w-[600px] hidden sm:table">
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
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${c.user.telephone}`}
                            className="flex items-center gap-1.5 text-vert-700 hover:text-vert-800 font-medium text-sm hover:underline"
                          >
                            📞 {c.user.telephone}
                          </a>
                          <a
                            href={`https://wa.me/${numWhatsApp(c.user.telephone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contacter sur WhatsApp"
                            className="w-7 h-7 rounded-full bg-vert-100 hover:bg-vert-200 flex items-center justify-center text-vert-700 text-sm transition-colors flex-shrink-0"
                          >
                            💬
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {formatPrix(c.total)} MAD
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {st && <span className={st.cls}>{st.l}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <OptionsStatut
                        statut={c.statut}
                        onChange={statut => mutation.mutate({ id: c.id, statut })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-vert-400"
                      />
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

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {commandes.map(c => {
              const st = STATUTS.find(s => s.v === c.statut)
              return (
                <div key={c.id} className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setDetail(detail?.id === c.id ? null : c)}
                      className="font-mono font-semibold text-vert-700 hover:underline text-sm"
                    >
                      {c.numero}
                    </button>
                    {st && <span className={st.cls}>{st.l}</span>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{c.user?.nom}</span>
                    <span className="font-bold text-gray-900">{formatPrix(c.total)} MAD</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      {c.user?.telephone || '—'}
                      {c.user?.telephone && (
                        <a
                          href={`https://wa.me/${numWhatsApp(c.user.telephone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contacter sur WhatsApp"
                          className="w-6 h-6 rounded-full bg-vert-100 hover:bg-vert-200 flex items-center justify-center text-vert-700 flex-shrink-0"
                        >
                          💬
                        </a>
                      )}
                    </span>
                    <span>{new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="pt-1">
                    <OptionsStatut
                      statut={c.statut}
                      onChange={statut => mutation.mutate({ id: c.id, statut })}
                      className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-vert-400"
                    />
                  </div>
                </div>
              )
            })}
            {commandes.length === 0 && (
              <p className="px-4 py-10 text-center text-gray-400 text-sm">Aucune commande</p>
            )}
          </div>
        </div>
      )}

      <Pagination meta={meta} onPage={setPage} />

      {/* Order detail modal */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setDetail(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label={`Détail de la commande ${detail.numero}`}
              className="fixed inset-x-4 top-[5vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-xl z-50 max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Syne' }}>Détail — {detail.numero}</h2>
                  <span className="mt-0.5 inline-block">{STATUTS.find(s => s.v === detail.statut)?.l && <span className={STATUTS.find(s => s.v === detail.statut).cls}>{STATUTS.find(s => s.v === detail.statut).l}</span>}</span>
                </div>
                <button
                  onClick={() => setDetail(null)}
                  aria-label="Fermer le détail"
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Client
                    </p>
                    <p className="font-semibold text-gray-900">{detail.user?.nom}</p>
                    <p className="text-sm text-gray-600">{detail.user?.email}</p>
                    {detail.user?.telephone && (
                      <div className="flex items-center gap-2 mt-2">
                        <a href={`tel:${detail.user.telephone}`} className="text-sm text-vert-700 hover:underline font-medium">
                          📞 {detail.user.telephone}
                        </a>
                        <a
                          href={`https://wa.me/${numWhatsApp(detail.user.telephone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-vert-700 bg-vert-100 hover:bg-vert-200 rounded-full px-3 py-1.5 transition-colors"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Livraison
                    </p>
                    <p className="text-sm text-gray-700">{detail.adresse_livraison}</p>
                    <p className="text-sm text-gray-700">{detail.ville} {detail.code_postal}</p>
                    {detail.notes && <p className="text-sm text-gray-500 italic mt-1">Note : {detail.notes}</p>}
                  </div>
                </div>

                {detail.items?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Articles
                    </p>
                    <div className="space-y-1.5">
                      {detail.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-sm gap-3">
                          <span className="text-gray-700 flex-1 min-w-0 truncate">{it.nom}</span>
                          <span className="text-gray-500 flex-shrink-0">×{it.quantite}</span>
                          <span className="font-semibold text-gray-900 flex-shrink-0">{formatPrix(Number(it.prix_effectif) * it.quantite)} MAD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 gap-3 flex-wrap">
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="font-semibold">{detail.paiement === 'livraison' ? 'Paiement à la livraison' : 'Carte bancaire'}</span>
                    </p>
                    {detail.statut_updated_at && (
                      <p className="text-xs text-gray-400 mt-1">Mise à jour : {new Date(detail.statut_updated_at).toLocaleString('fr-FR')}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Livraison : {formatPrix(detail.frais_livraison)} MAD</p>
                    <p className="font-bold text-gray-900 text-lg">Total : {formatPrix(detail.total)} MAD</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
