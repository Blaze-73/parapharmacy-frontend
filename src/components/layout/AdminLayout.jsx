import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../store/index.js'
import { authApi } from '../../api/index.js'

const NAV = [
  { href: '/admin',             label: 'Tableau de bord', Icone: LayoutDashboard },
  { href: '/admin/produits',    label: 'Produits',        Icone: Package },
  { href: '/admin/commandes',   label: 'Commandes',       Icone: ShoppingBag },
  { href: '/admin/clients',     label: 'Clients',         Icone: Users },
]

export default function AdminLayout() {
  const { user, deconnexion } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [ouvert, setOuvert] = useState(false)

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
              <span className="text-white font-extrabold" style={{ fontFamily: 'Syne' }}>P</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Syne' }}>ParaPharma</p>
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
          <div className="ml-auto flex items-center gap-2">
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
