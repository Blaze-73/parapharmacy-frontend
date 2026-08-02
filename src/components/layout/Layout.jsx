import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, ChevronDown, ChevronUp, LogOut, Package, Heart, Cross, MessageCircle, Bell, Home } from 'lucide-react'
import { useAuth, usePanier, useWishlist, useNotifications } from '../../store/index.js'
import { useQuery } from '@tanstack/react-query'
import { authApi, commandesApi } from '../../api/index.js'
import { SITE } from '../../config.js'
import { lienWhatsApp } from '../../utils/format.js'
import PanierDrawer from '../cart/PanierDrawer.jsx'
import SearchBar from '../SearchBar.jsx'
import ConfirmModal from '../ConfirmModal.jsx'
import toast from 'react-hot-toast'

// ── Barre de navigation mobile (bas de page) ──────────────────────────────────
function BottomNav() {
  const { totalArticles, ouvrir } = usePanier()
  const { ids: favorisIds }       = useWishlist()
  const location                  = useLocation()
  const nb                        = totalArticles()
  const nbFavoris                 = favorisIds.length
  const actif = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  const items = [
    { to: '/', label: 'Accueil', Icon: Home },
    { to: '/produits', label: 'Produits', Icon: Package },
  ]

  return (
    <nav
      aria-label="Navigation principale (mobile)"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-stretch">
        {items.map(({ to, label, Icon }) => (
          <Link key={to} to={to} aria-current={actif(to) ? 'page' : undefined}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors">
            <span className={`relative p-0.5 rounded-lg transition-colors ${actif(to) ? 'text-vert-600' : 'text-gray-400'}`}>
              <Icon className="w-6 h-6" />
              {to === '/produits' && nb > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-vert-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {nb > 9 ? '9+' : nb}
                </span>
              )}
            </span>
            <span className={actif(to) ? 'text-vert-700' : 'text-gray-500'}>{label}</span>
          </Link>
        ))}

        <button onClick={ouvrir}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors">
          <span className="relative p-0.5 rounded-lg text-gray-400">
            <ShoppingCart className="w-6 h-6" />
            {nb > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-vert-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {nb > 9 ? '9+' : nb}
              </span>
            )}
          </span>
          <span className="text-gray-500">Panier</span>
        </button>

        <Link to="/favoris" aria-current={actif('/favoris') ? 'page' : undefined}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors">
          <span className={`relative p-0.5 rounded-lg transition-colors ${actif('/favoris') ? 'text-vert-600' : 'text-gray-400'}`}>
            <Heart className="w-6 h-6" />
            {nbFavoris > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {nbFavoris > 9 ? '9+' : nbFavoris}
              </span>
            )}
          </span>
          <span className={actif('/favoris') ? 'text-vert-700' : 'text-gray-500'}>Favoris</span>
        </Link>
      </div>
    </nav>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function Layout() {
  const { connecte, user, deconnexion } = useAuth()
  const { totalArticles, ouvrir }       = usePanier()
  const { ids: favorisIds }             = useWishlist()
  const { estLu }                       = useNotifications()
  const navigate                        = useNavigate()
  const location                        = useLocation()
  const [menuOuvert, setMenuOuvert]     = useState(false)
  const [menuUser, setMenuUser]         = useState(false)
  const [confirmDeconnexion, setConfirmDeconnexion] = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [showTop, setShowTop]           = useState(false)
  const refUser                         = useRef(null)
  const searchDesktopRef                = useRef(null)
  const searchMobileRef                 = useRef(null)

  useEffect(() => { setMenuOuvert(false); setMenuUser(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Press "/" to focus the visible search input
  useEffect(() => {
    function onKey(e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      e.preventDefault()
      const el = searchDesktopRef.current?.offsetParent ? searchDesktopRef.current : searchMobileRef.current
      if (el) { el.focus(); el.select?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function onClick(e) {
      if (refUser.current && !refUser.current.contains(e.target)) setMenuUser(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function handleDeconnexion() {
    try { await authApi.deconnexion() } catch {}
    deconnexion()
    toast.success('À bientôt !')
    navigate('/')
  }

  const { data: cmdData } = useQuery({
    queryKey: ['mes-commandes'],
    queryFn: () => commandesApi.liste(user?.id),
    enabled: !!connecte,
    staleTime: 60 * 1000,
  })
  const livraisons = (cmdData?.data?.data || []).filter(c => c.statut === 'livree')
  const nbNonLus   = livraisons.filter(c => !estLu(c.id)).length

  const nb = totalArticles()
  const nbFavoris = favorisIds.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link (accessibility) */}
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-vert-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-semibold focus:text-sm"
      >
        Aller au contenu principal
      </a>

      {/* Top bar */}
      <div className="bg-vert-700 text-white text-xs py-2 text-center hidden sm:block">
        🚚 Livraison gratuite dès {SITE.fraisLivraisonGratuite} MAD &nbsp;|&nbsp; 📦 Livraison en 24–48h &nbsp;|&nbsp; 🔒 Paiement sécurisé
      </div>

      {/* Navbar */}
      <header className={`bg-white sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center h-16 gap-1 sm:gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0" aria-label="Parapharmacie Elmakhfi">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-vert-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cross className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg xl:text-xl font-extrabold text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Syne' }}>
              <span className="sm:hidden">Elmakhfi</span>
              <span className="hidden sm:inline">Parapharmacie <span className="text-vert-600">Elmakhfi</span></span>
            </span>
          </Link>

          {/* Desktop search with suggestions */}
          <div className="flex-1 max-w-lg min-w-0 hidden lg:flex items-center gap-2">
            <SearchBar inputRef={searchDesktopRef} />
          </div>

          {/* Nav links */}
          <nav className="hidden xl:flex items-center gap-1 flex-shrink-0">
            <Link to="/produits" className="btn-ghost text-sm">Produits</Link>
            <Link to="/produits?categorie=soins-visage" className="btn-ghost text-sm">Soins</Link>
            <Link to="/produits?categorie=vitamines" className="btn-ghost text-sm">Vitamines</Link>
            <Link to="/produits?en_promo=true" className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-semibold text-sm transition-colors">
              🔥 Promos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
            {/* Favoris (caché sur mobile — présent dans la barre du bas) */}
            <Link
              to="/favoris"
              aria-label={`Mes favoris (${nbFavoris})`}
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {nbFavoris > 0 && (
                <motion.span
                  key={nbFavoris}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {nbFavoris > 9 ? '9+' : nbFavoris}
                </motion.span>
              )}
            </Link>

            {/* Cart (caché sur mobile — présent dans la barre du bas) */}
            <button onClick={ouvrir} aria-label={`Voir le panier (${nb} article${nb !== 1 ? 's' : ''})`} className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {nb > 0 && (
                <motion.span
                  key={nb}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-vert-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {nb > 9 ? '9+' : nb}
                </motion.span>
              )}
            </button>

            {/* Notifications (livraisons) */}
            <Link to="/mes-commandes" aria-label="Mes commandes et notifications"
              className="relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              {nbNonLus > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </Link>

            {/* User */}
            {connecte ? (
              <div className="relative" ref={refUser}>
                <button onClick={() => setMenuUser(v => !v)}
                  className="flex items-center gap-1.5 px-1.5 sm:px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 bg-vert-100 rounded-full flex items-center justify-center text-vert-700 font-bold text-sm flex-shrink-0">
                    {user?.nom?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">
                    {user?.nom?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                </button>
                <AnimatePresence>
                  {menuUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.nom}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-vert-50 hover:text-vert-700 transition-colors">
                            ⚙️ Tableau de bord
                          </Link>
                        )}
                        <Link to="/mes-commandes" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Package className="w-4 h-4" /> Mes commandes
                        </Link>
                        <Link to="/favoris" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4" /> Mes favoris
                          {nbFavoris > 0 && <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 rounded-full px-2 py-0.5">{nbFavoris}</span>}
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button onClick={() => setConfirmDeconnexion(true)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/connexion" className="btn-ghost text-sm hidden lg:inline-flex">Connexion</Link>
                <Link to="/inscription" className="btn-vert text-sm py-2 px-4 hidden lg:inline-flex">S'inscrire</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOuvert(v => !v)}
              className="xl:hidden p-1.5 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 sm:ml-1">
              {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden px-4 pb-3">
          <SearchBar mobile inputRef={searchMobileRef} />
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  ['/', 'Accueil'],
                  ['/produits', 'Tous les produits'],
                  ['/produits?categorie=soins-visage', 'Soins du visage'],
                  ['/produits?categorie=vitamines', 'Vitamines'],
                  ['/produits?en_promo=true', '🔥 Promotions'],
                  ['/favoris', '❤️ Mes favoris'],
                ].map(([href, label]) => (
                  <Link key={href} to={href}
                    className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                    {label}
                  </Link>
                ))}
                {!connecte && (
                  <div className="pt-2 flex gap-2 border-t border-gray-100 mt-2">
                    <Link to="/connexion" className="btn-blanc flex-1 text-center text-sm py-2">Connexion</Link>
                    <Link to="/inscription" className="btn-vert flex-1 text-center text-sm py-2">Inscription</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="contenu-principal" className="flex-1 pb-14 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-vert-600 rounded-lg flex items-center justify-center">
                  <Cross className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white" style={{ fontFamily: 'Syne' }}>Parapharmacie Elmakhfi</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Votre parapharmacie en ligne de confiance. Produits de santé et bien-être livrés chez vous.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Syne' }}>Navigation</h4>
              <ul className="space-y-2 text-sm">
                {[['/produits','Tous les produits'],['/produits?en_promo=true','Promotions'],['/produits?categorie=vitamines','Vitamines']].map(([h,l]) => (
                  <li key={h}><Link to={h} className="hover:text-vert-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Syne' }}>Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 {SITE.contact.telephone}</li>
                <li>✉️ {SITE.contact.email}</li>
                <li>📍 {SITE.contact.adresse}</li>
                <li>🕐 {SITE.contact.horaires}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Parapharmacie Elmakhfi. Tous droits réservés.
          </div>
        </div>
      </footer>

      <PanierDrawer />

      <ConfirmModal
        ouvert={confirmDeconnexion}
        titre="Se déconnecter ?"
        message="Voulez-vous vraiment vous déconnecter de votre compte ?"
        confirmLabel="Se déconnecter"
        tone="danger"
        onConfirm={async () => { setConfirmDeconnexion(false); await handleDeconnexion() }}
        onCancel={() => setConfirmDeconnexion(false)}
      />

      {/* Bottom mobile navigation */}
      <BottomNav />

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Revenir en haut de page"
            className="fixed bottom-[5.5rem] md:bottom-20 right-5 z-40 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-vert-700 hover:border-vert-300 transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp support (hidden on product detail — sticky buy bar is there) */}
      {!location.pathname.startsWith('/produits/') && (
        <a
          href={lienWhatsApp(SITE.contact.telephone, `Bonjour ${SITE.nom} 👋, j'aimerais poser une question.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter le support sur WhatsApp"
          title="Contacter le support"
          className="fixed bottom-[4.5rem] md:bottom-5 right-5 z-40 w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      )}
    </div>
  )
}
