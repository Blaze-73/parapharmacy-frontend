import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, ChevronDown, LogOut, Package, Search } from 'lucide-react'
import { useAuth, usePanier } from '../../store/index.js'
import { authApi, produitsApi } from '../../api/index.js'
import PanierDrawer from '../cart/PanierDrawer.jsx'
import CategoryIcon from '../CategoryIcon.jsx'
import toast from 'react-hot-toast'

// ── Search with suggestions ───────────────────────────────────────────────────
function SearchBar({ mobile = false }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSugg, setShowSugg] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef  = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSugg(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounced fetch
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setSuggestions([]); setShowSugg(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await produitsApi.liste({ recherche: q.trim(), par_page: 6 })
        setSuggestions(res.data?.data || [])
        setShowSugg(true)
      } catch {}
      finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [q])

  function handleSubmit(e) {
    e.preventDefault()
    if (!q.trim()) return
    setShowSugg(false)
    navigate(`/produits?recherche=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  function handleSelect(produit) {
    setShowSugg(false)
    setQ('')
    navigate(`/produits/${produit.slug}`)
  }

  const inputClass = mobile
    ? 'w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vert-500 focus:bg-white transition-all'
    : 'w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vert-500 focus:border-transparent focus:bg-white transition-all'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${mobile ? 'left-3 w-4 h-4' : 'left-3.5 w-4 h-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} />
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            placeholder={mobile ? 'Rechercher…' : 'Rechercher un produit, une marque…'}
            className={inputClass}
          />
          {q && (
            <button type="button" onClick={() => { setQ(''); setSuggestions([]); setShowSugg(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {!mobile && (
          <button type="submit" className="btn-vert py-2.5 px-4 text-sm flex-shrink-0">
            Chercher
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSugg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-vert-500 rounded-full animate-spin" />
                Recherche en cours…
              </div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                Aucun résultat pour <strong>"{q}"</strong>
              </div>
            )}

            {!loading && suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  Suggestions
                </div>
                {suggestions.map((produit) => (
                  <button
                    key={produit.id}
                    onClick={() => handleSelect(produit)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {produit.image
                        ? <img src={produit.image} alt={produit.nom} className="w-full h-full object-contain p-0.5" />
                        : <CategoryIcon slug={produit.categorie?.slug} className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{produit.nom}</p>
                      <p className="text-xs text-gray-400">{produit.marque || produit.categorie?.nom}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-vert-700">
                        {Number(produit.prix_effectif).toFixed(2)} MAD
                      </p>
                      {produit.en_solde && (
                        <p className="text-xs text-red-500 line-through">{Number(produit.prix).toFixed(2)}</p>
                      )}
                    </div>
                  </button>
                ))}

                {/* See all results */}
                <button
                  onClick={handleSubmit.bind(null, { preventDefault: () => {} })}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setShowSugg(false)
                    navigate(`/produits?recherche=${encodeURIComponent(q.trim())}`)
                    setQ('')
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-vert-700 hover:bg-vert-50 transition-colors text-center border-t border-gray-100 flex items-center justify-center gap-1.5"
                >
                  Voir tous les résultats pour "{q}"
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function Layout() {
  const { connecte, user, deconnexion } = useAuth()
  const { totalArticles, ouvrir }       = usePanier()
  const navigate                        = useNavigate()
  const location                        = useLocation()
  const [menuOuvert, setMenuOuvert]     = useState(false)
  const [menuUser, setMenuUser]         = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const refUser                         = useRef(null)

  useEffect(() => { setMenuOuvert(false); setMenuUser(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  const nb = totalArticles()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-vert-700 text-white text-xs py-2 text-center hidden sm:block">
        🚚 Livraison gratuite dès 300 MAD &nbsp;|&nbsp; 📦 Livraison en 24–48h &nbsp;|&nbsp; 🔒 Paiement sécurisé
      </div>

      {/* Navbar */}
      <header className={`bg-white sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-vert-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-lg" style={{ fontFamily: 'Syne' }}>P</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 hidden sm:block" style={{ fontFamily: 'Syne' }}>
              Para<span className="text-vert-600">Pharma</span>
            </span>
          </Link>

          {/* Desktop search with suggestions */}
          <div className="flex-1 max-w-lg hidden md:flex items-center gap-2">
            <SearchBar />
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <Link to="/produits" className="btn-ghost text-sm">Produits</Link>
            <Link to="/produits?categorie=soins-visage" className="btn-ghost text-sm">Soins</Link>
            <Link to="/produits?categorie=vitamines" className="btn-ghost text-sm">Vitamines</Link>
            <Link to="/produits?en_promo=true" className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-semibold text-sm transition-colors">
              🔥 Promos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Cart */}
            <button onClick={ouvrir} className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
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

            {/* User */}
            {connecte ? (
              <div className="relative" ref={refUser}>
                <button onClick={() => setMenuUser(v => !v)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 bg-vert-100 rounded-full flex items-center justify-center text-vert-700 font-bold text-sm flex-shrink-0">
                    {user?.nom?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">
                    {user?.nom?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
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
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button onClick={handleDeconnexion}
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
                <Link to="/connexion" className="btn-ghost text-sm hidden sm:inline-flex">Connexion</Link>
                <Link to="/inscription" className="btn-vert text-sm py-2 px-4">S'inscrire</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOuvert(v => !v)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 ml-1">
              {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar mobile />
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  ['/', 'Accueil'],
                  ['/produits', 'Tous les produits'],
                  ['/produits?categorie=soins-visage', 'Soins du visage'],
                  ['/produits?categorie=vitamines', 'Vitamines'],
                  ['/produits?en_promo=true', '🔥 Promotions'],
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

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-vert-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold" style={{ fontFamily: 'Syne' }}>P</span>
                </div>
                <span className="text-lg font-bold text-white" style={{ fontFamily: 'Syne' }}>ParaPharma</span>
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
                <li>📞 +212 5XX-XXXXXX</li>
                <li>✉️ contact@parapharmacie.ma</li>
                <li>📍 Casablanca, Maroc</li>
                <li>🕐 Lun–Sam : 9h–18h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ParaPharmacie. Tous droits réservés.
          </div>
        </div>
      </footer>

      <PanierDrawer />
    </div>
  )
}
