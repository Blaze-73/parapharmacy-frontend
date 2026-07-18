import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, Download } from 'lucide-react'
import { adminApi } from '../../api/index.js'

function KPICard({ titre, valeur, Icone, couleur }) {
  return (
    <div className="carte p-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${couleur}`}>
        <Icone className="w-6 h-6" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-1 font-mono tracking-tight">{valeur}</p>
      <p className="text-sm font-medium text-gray-600">{titre}</p>
    </div>
  )
}

const STATUTS = {
  en_attente: 'badge-jaune',
  confirmee:  'badge-vert',
  expediee:   'badge-bleu',
  livree:     'badge-vert',
  annulee:    'badge-rouge',
}

export default function AdminTableau() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tableau'],
    queryFn:  adminApi.tableau,
    refetchInterval: 60_000,
  })

  const d = data?.data?.data

  if (isLoading) return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-36 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Tableau de bord</h1>
          <p className="text-gray-500 mt-1 text-sm">Vue d'ensemble de votre boutique</p>
        </div>
        <button onClick={adminApi.exporterDonnees} className="btn btn-ghost text-sm gap-2">
          <Download className="w-4 h-4" />
          Exporter les données
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard titre="Chiffre d'affaires" valeur={`${Number(d?.chiffre_affaires || 0).toLocaleString()} MAD`} Icone={TrendingUp} couleur="bg-vert-100 text-vert-700" />
        <KPICard titre="Commandes"          valeur={d?.total_commandes || 0}  Icone={ShoppingBag} couleur="bg-blue-100 text-blue-700" />
        <KPICard titre="Produits"           valeur={d?.total_produits  || 0}  Icone={Package}     couleur="bg-purple-100 text-purple-700" />
        <KPICard titre="Clients"            valeur={d?.total_clients   || 0}  Icone={Users}       couleur="bg-orange-100 text-orange-700" />
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="carte overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Syne' }}>Commandes récentes</h2>
            <Link to="/admin/commandes" className="text-sm text-vert-600 hover:underline font-medium">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(d?.commandes_recentes || []).slice(0, 8).map(c => (
              <div key={c.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-semibold font-mono text-gray-900">{c.numero}</p>
                  <p className="text-xs text-gray-400">{c.user?.nom}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono">{Number(c.total).toFixed(2)} MAD</p>
                  <span className={STATUTS[c.statut] || 'badge-jaune'}>{c.statut?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
            {(!d?.commandes_recentes || d.commandes_recentes.length === 0) && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">Aucune commande</p>
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="carte overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Syne' }}>Stock faible</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(d?.produits_stock_bas || []).map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <p className="text-sm text-gray-800 font-medium line-clamp-1 flex-1 mr-3">{p.nom}</p>
                <span className="badge-rouge flex-shrink-0"><span className="font-mono">{p.stock}</span> restants</span>
              </div>
            ))}
            {(!d?.produits_stock_bas || d.produits_stock_bas.length === 0) && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">Tous les stocks sont bons ✅</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
