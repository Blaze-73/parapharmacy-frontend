import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingBag, XCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commandesApi } from '../api/index.js'
import { formatPrix } from '../utils/format.js'
import { useAuth } from '../store/index.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import SuiviCommande from '../components/SuiviCommande.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import toast from 'react-hot-toast'
import usePageMeta from '../hooks/usePageMeta.js'

const STATUTS = {
  en_attente: { label: 'En attente',  cls: 'badge-jaune' },
  confirmee:  { label: 'Confirmée',   cls: 'badge-vert' },
  expediee:   { label: 'Expédiée',    cls: 'badge-bleu' },
  livree:     { label: 'Livrée',      cls: 'badge-vert' },
  annulee:    { label: 'Annulée',     cls: 'badge-rouge' },
}

const ANNULABLE = ['en_attente', 'confirmee']

export default function MesCommandes() {
  usePageMeta({ title: 'Mes commandes', path: '/mes-commandes', noindex: true })
  const qc = useQueryClient()
  const { user } = useAuth()
  const { data, isLoading } = useQuery({ queryKey: ['mes-commandes'], queryFn: () => commandesApi.liste(user?.id) })
  const commandes = data?.data?.data || []

  const [annulation, setAnnulation] = useState(null)

  const annulerMutation = useMutation({
    mutationFn: (id) => commandesApi.annuler(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mes-commandes'] })
      toast.success('Commande annulée')
    },
    onError: () => toast.error("Impossible d'annuler la commande"),
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Mes commandes' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>
      {isLoading && <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="carte h-24 animate-pulse bg-gray-100"/>)}</div>}
      {!isLoading && commandes.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-500 mb-5">Vous n'avez pas encore de commandes.</p>
          <Link to="/produits" className="btn-vert">Découvrir nos produits</Link>
        </div>
      )}
      {!isLoading && commandes.length > 0 && (
        <div className="space-y-4">
          {commandes.map(c => {
            const st = STATUTS[c.statut] || { label: c.statut, cls: 'badge-jaune' }
            const peutAnnuler = ANNULABLE.includes(c.statut)
            return (
              <div key={c.id} className="carte p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-gray-900 font-mono text-base">{c.numero}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{new Date(c.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{c.adresse_livraison}, {c.ville}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className={st.cls}>{st.label}</span>
                    <p className="prix-principal text-xl">{formatPrix(c.total)} MAD</p>
                    {peutAnnuler && (
                      <button
                        onClick={() => setAnnulation(c)}
                        disabled={annulerMutation.isPending}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <SuiviCommande statut={c.statut} compact />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        ouvert={!!annulation}
        titre="Annuler la commande ?"
        message={annulation
          ? `Voulez-vous vraiment annuler la commande ${annulation.numero} ? Cette action est définitive.`
          : ''}
        confirmLabel="Annuler la commande"
        tone="danger"
        onConfirm={() => { if (annulation) annulerMutation.mutate(annulation.id); setAnnulation(null) }}
        onCancel={() => setAnnulation(null)}
      />
    </div>
  )
}
