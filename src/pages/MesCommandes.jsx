import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { commandesApi } from '../api/index.js'

const STATUTS = {
  en_attente: { label: 'En attente',  cls: 'badge-jaune' },
  confirmee:  { label: 'Confirmée',   cls: 'badge-vert' },
  expediee:   { label: 'Expédiée',    cls: 'badge-bleu' },
  livree:     { label: 'Livrée',      cls: 'badge-vert' },
  annulee:    { label: 'Annulée',     cls: 'badge-rouge' },
}

export default function MesCommandes() {
  const { data, isLoading } = useQuery({ queryKey: ['mes-commandes'], queryFn: commandesApi.liste })
  const commandes = data?.data?.data || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
            return (
              <div key={c.id} className="carte p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-gray-900 font-mono text-base">{c.numero}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{new Date(c.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{c.adresse_livraison}, {c.ville}</p>
                  </div>
                  <div className="text-right">
                    <span className={st.cls}>{st.label}</span>
                    <p className="prix-principal text-xl mt-1">{Number(c.total).toFixed(2)} MAD</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
