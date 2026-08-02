import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, Download, Star, Plus } from 'lucide-react'
import { adminApi } from '../../api/index.js'
import { formatPrix } from '../../utils/format.js'
import { useAuth } from '../../store/index.js'
import usePageMeta from '../../hooks/usePageMeta.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import toast from 'react-hot-toast'

const STATUTS = {
  en_attente: 'badge-jaune',
  confirmee:  'badge-vert',
  expediee:   'badge-bleu',
  livree:     'badge-vert',
  annulee:    'badge-rouge',
}

const dateCourte = iso => {
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }
  catch { return '' }
}

function KPICard({ titre, valeur, Icone, grad }) {
  return (
    <div className="carte p-4 lg:p-5 group">
      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}>
        <Icone className="w-5 h-5 text-white" />
      </div>
      <p className="text-xl lg:text-2xl font-extrabold text-gray-900 font-mono tracking-tight leading-none">{valeur}</p>
      <p className="text-xs lg:text-sm font-medium text-gray-500 mt-1.5">{titre}</p>
    </div>
  )
}

function Thumb({ produit }) {
  const [err, setErr] = useState(false)
  if (err || !produit?.image) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vert-100 to-emerald-100 flex items-center justify-center text-vert-700 font-bold flex-shrink-0">
        {produit?.nom?.[0]?.toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={produit.image}
      alt={produit.nom}
      loading="lazy"
      onError={() => setErr(true)}
      className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0 bg-white"
    />
  )
}

export default function AdminTableau() {
  usePageMeta({ title: 'Admin — Tableau de bord', path: '/admin', noindex: true })
  usePageTitle('Admin — Tableau de bord')
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tableau'],
    queryFn:  adminApi.tableau,
    refetchInterval: 60_000,
  })

  const d = data?.data?.data
  const panierMoyen = d?.total_commandes ? Math.round((d?.chiffre_affaires || 0) / d.total_commandes) : 0
  const prenom = (user?.nom || 'Admin').split(' ')[0]
  const dateAuj = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  function handleExporter() {
    adminApi.exporterDonnees()
    toast.success('Rapport HTML téléchargé — ouvrable sur téléphone sans logiciel')
  }

  if (isLoading) return (
    <div className="p-4 lg:p-8 space-y-6 animate-pulse">
      <div className="h-44 bg-gray-200 rounded-3xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vert-600 via-vert-600 to-emerald-700 text-white p-6 lg:p-8">
        <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute -bottom-20 -right-6 w-60 h-60 rounded-full bg-white/5" aria-hidden="true" />

        <div className="relative">
          <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
            <div className="min-w-0">
              <p className="text-vert-100 text-sm font-semibold">Bonjour 👋</p>
              <h1 className="text-2xl lg:text-3xl font-extrabold mt-1" style={{ fontFamily: 'Syne' }}>
                Bienvenue, {prenom}
              </h1>
              <p className="text-vert-100/90 text-sm mt-1 capitalize">{dateAuj}</p>
            </div>
            <button
              onClick={handleExporter}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur hover:bg-white/25 text-white px-3 py-2 rounded-xl transition-colors flex-shrink-0 ml-auto"
            >
              <Download className="w-3.5 h-3.5" /> Exporter
            </button>
          </div>

          <div className="mt-6 lg:mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-vert-100/85 text-xs font-semibold uppercase tracking-wider">Chiffre d'affaires total</p>
              <p className="text-3xl lg:text-4xl font-extrabold font-mono tracking-tight mt-1">
                {Number(d?.chiffre_affaires || 0).toLocaleString('fr-FR')}
                <span className="text-base lg:text-lg font-bold text-vert-100 ml-1">MAD</span>
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 text-center flex-shrink-0">
              <p className="text-xl lg:text-2xl font-extrabold font-mono flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                {Number(d?.note_moyenne || 0).toFixed(1)}
              </p>
              <p className="text-[11px] text-vert-100 mt-0.5">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard titre="Commandes"    valeur={d?.total_commandes || 0}  Icone={ShoppingBag} grad="from-blue-500 to-indigo-600" />
        <KPICard titre="Produits"     valeur={d?.total_produits  || 0}  Icone={Package}     grad="from-purple-500 to-fuchsia-600" />
        <KPICard titre="Clients"      valeur={d?.total_clients   || 0}  Icone={Users}       grad="from-orange-400 to-amber-600" />
        <KPICard titre="Panier moyen" valeur={panierMoyen.toLocaleString('fr-FR')} Icone={TrendingUp} grad="from-vert-500 to-emerald-600" />
      </div>

      {/* ── Actions rapides ──────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-wrap">
        <Link
          to="/admin/produits"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:border-vert-500 hover:text-vert-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-vert-600" /> Ajouter un produit
        </Link>
        <Link
          to="/admin/commandes"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:border-vert-500 hover:text-vert-700 transition-colors flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-vert-600" /> Commandes
        </Link>
        <Link
          to="/admin/clients"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:border-vert-500 hover:text-vert-700 transition-colors flex-shrink-0"
        >
          <Users className="w-4 h-4 text-vert-600" /> Clients
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:border-vert-500 hover:text-vert-700 transition-colors flex-shrink-0"
        >
          <TrendingUp className="w-4 h-4 text-vert-600" /> Voir la boutique
        </Link>
      </div>

      {/* ── Tableaux ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Commandes récentes */}
        <section className="carte overflow-hidden">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
              <span className="w-1.5 h-4 rounded-full bg-vert-500 inline-block" />
              Commandes récentes
            </h2>
            <Link to="/admin/commandes" className="text-sm text-vert-600 hover:underline font-medium">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(d?.commandes_recentes || []).slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 lg:px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                  {c.user?.nom?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold font-mono text-gray-900 truncate">{c.numero}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.user?.nom} · {dateCourte(c.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-bold font-mono text-gray-900">{formatPrix(c.total)} MAD</p>
                  <span className={`${STATUTS[c.statut] || 'badge-jaune'} mt-1`}>{c.statut?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
            {(!d?.commandes_recentes || d.commandes_recentes.length === 0) && (
              <p className="px-4 py-8 text-center text-sm text-gray-400">Aucune commande</p>
            )}
          </div>
        </section>

        {/* Stock faible */}
        <section className="carte overflow-hidden">
          <div className="flex items-center gap-2 px-4 lg:px-6 py-4 border-b border-gray-100">
            <span className="w-1.5 h-4 rounded-full bg-orange-500 inline-block" />
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Syne' }}>Stock faible</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(d?.produits_stock_bas || []).map(p => {
              const niveau = Math.max(8, Math.min(100, (Number(p.stock) / 20) * 100))
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 lg:px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <Thumb produit={p} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.nom}</p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                        style={{ width: `${niveau}%` }}
                      />
                    </div>
                  </div>
                  <span className="badge-rouge flex-shrink-0"><span className="font-mono">{p.stock}</span> restants</span>
                </div>
              )
            })}
            {(!d?.produits_stock_bas || d.produits_stock_bas.length === 0) && (
              <p className="px-4 py-8 text-center text-sm text-gray-400">Tous les stocks sont bons ✅</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
