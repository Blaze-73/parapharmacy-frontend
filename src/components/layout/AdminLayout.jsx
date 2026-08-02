import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, Cross, Bell, CheckCheck } from 'lucide-react'
import { useAuth, useNotifications } from '../../store/index.js'
import { authApi, adminApi } from '../../api/index.js'
import { formatPrix } from '../../utils/format.js'
import { ModeSombre } from './Layout.jsx'

const NAV = [
  { href: '/admin',             label: 'Tableau de bord',      Icone: LayoutDashboard },
  { href: '/admin/produits',    label: 'Produits',             Icone: Package },
  { href: '/admin/commandes',   label: 'Commandes & livraisons', Icone: ShoppingBag },
  { href: '/admin/clients',     label: 'Clients',              Icone: Users },
]

function useOutside(ref, cb) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) cb()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

export default function AdminLayout() {
  const { user, deconnexion } = useAuth()
  const { estLu, marquerLus }  = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()
  const [ouvert, setOuvert] = useState(false)
  const [notifOuvert, setNotifOuvert] = useState(false)
  const refNotif = useRef(null)

  const { data: cmdData } = useQuery({
    queryKey: ['admin-commandes', 'notifications'],
    queryFn: () => adminApi.commandes({ par_page: 100 }),
    refetchInterval: 60_000,
  })
  const commandes = cmdData?.data?.data || []
  const livraisons = commandes.filter(c => c.statut === 'livree')
  const nbNonLus = livraisons.filter(c => !estLu(c.id)).length

  useOutside(refNotif, () => setNotifOuvert(false))

  async function handleDeconnexion() {
    try { await authApi.deconnexion() } catch {}
    deconnexion()
    navigate('/')
  }

  function actif(href) {
    return href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)
  }

  function Sidebar() {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="px-5 py-5 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vert-600 rounded-xl flex items-center justify-center">
              <Cross className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Syne' }}>Parapharmacie Elmakhfi</p>
              <p className="text-gray-400 text-xs">Administration</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOuvert(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                actif(item.href)
                  ? 'bg-vert-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.Icone className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"
          >
            ← Voir la boutique
          </Link>
          <button
            onClick={handleDeconnexion}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition-all"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="w-60 flex-shrink-0 hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {ouvert && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setOuvert(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 h-full w-60 z-50 md:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setOuvert(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">

            {/* Theme toggle */}
            <div className="hidden sm:block">
              <ModeSombre />
            </div>

            {/* Notifications */}
            <div className="relative" ref={refNotif}>
              <button
                onClick={() => setNotifOuvert(v => !v)}
                aria-label={`Notifications (${nbNonLus} non lues)`}
                className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {nbNonLus > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                )}
              </button>
              <AnimatePresence>
                {notifOuvert && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900">Notifications</p>
                      {nbNonLus > 0 && (
                        <button onClick={marquerLus} className="flex items-center gap-1 text-xs font-semibold text-vert-700 hover:text-vert-800 transition-colors">
                          <CheckCheck className="w-3.5 h-3.5" /> Tout marquer comme lu
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {livraisons.length === 0 && (
                        <p className="px-4 py-8 text-center text-sm text-gray-400">Aucune livraison pour le moment.</p>
                      )}
                      {livraisons.slice(0, 8).map(c => (
                        <Link
                          key={c.id}
                          to="/admin/commandes"
                          onClick={() => setNotifOuvert(false)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${estLu(c.id) ? '' : 'bg-vert-50/50'}`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-vert-100 text-vert-700 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">Commande {c.numero} livrée</p>
                            <p className="text-xs text-gray-500 truncate">{c.user?.nom} · {formatPrix(c.total)} MAD</p>
                          </div>
                          {!estLu(c.id) && <span className="w-2 h-2 bg-vert-500 rounded-full mt-1.5 flex-shrink-0" />}
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/admin/commandes"
                      onClick={() => setNotifOuvert(false)}
                      className="block text-center py-3 text-sm font-semibold text-vert-700 hover:bg-vert-50 transition-colors border-t border-gray-100"
                    >
                      Voir toutes les commandes
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 bg-vert-100 rounded-full flex items-center justify-center text-vert-700 font-bold text-sm">
              {user?.nom?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.nom}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
