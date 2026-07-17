import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Clock, Star, Quote, Sparkles, Heart } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import CarteProduit from '../components/product/CarteProduit.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'

const SLIDES = [
  {
    titre:     'Votre santé,\nnotre priorité',
    sousTitre: 'Produits de parapharmacie de qualité livrés chez vous en 24–48h',
    badge:     '✨ Nouveautés',
    lien:      '/produits',
    cta:       'Découvrir nos produits',
    image:     'https://loremflickr.com/1200/400/pharmacy,beauty',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
  {
    titre:     'Promotions\nJusqu\'à -40%',
    sousTitre: 'Des offres exceptionnelles sur la cosmétique, les vitamines et le bien-être',
    badge:     '🔥 Offres limitées',
    lien:      '/produits?en_promo=true',
    cta:       'Voir les promos',
    image:     'https://loremflickr.com/1200/400/skincare,products',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
  {
    titre:     'Soins bébé\n& Maternité',
    sousTitre: 'Tout ce dont vous avez besoin pour bébé et la future maman',
    badge:     '👶 Bébé & Maman',
    lien:      '/produits?categorie=bebe-maman',
    cta:       'Explorer la gamme',
    image:     'https://loremflickr.com/1200/400/baby,family',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
]

const AVIS_TEMOIGNAGES = [
  { nom: 'Fatima Benali', ville: 'Casablanca', note: 5, texte: 'Site très fiable, commande reçue en 24h. Produits conformes et bien emballés. Je recommande vivement !', avatar: 'FB', date: 'Janvier 2026' },
  { nom: 'Youssef El Amrani', ville: 'Marrakech', note: 5, texte: 'Excellente parapharmacie en ligne. Prix compétitifs et service client réactif. Ma nouvelle référence.', avatar: 'YE', date: 'Décembre 2025' },
  { nom: 'Salma El Idrissi', ville: 'Fès', note: 4, texte: 'Très satisfaite de mes achats. La livraison gratuite dès 300 MAD est un vrai plus. Je reviendrai !', avatar: 'SE', date: 'Janvier 2026' },
  { nom: 'Nadia Rafik', ville: 'Rabat', note: 5, texte: 'Produits authentiques et bien conservés. Le suivi de commande est parfait. Merci à toute l\'équipe !', avatar: 'NR', date: 'Janvier 2026' },
]

const AVANTAGES = [
  { icone: <Truck className="w-6 h-6" />, titre: 'Livraison 24-48h', desc: 'Partout au Maroc, gratuite dès 300 MAD' },
  { icone: <Shield className="w-6 h-6" />, titre: '100% Authentique', desc: 'Produits originaux garantis' },
  { icone: <RefreshCw className="w-6 h-6" />, titre: 'Retour sous 30 jours', desc: 'Satisfait ou remboursé' },
  { icone: <Heart className="w-6 h-6" />, titre: 'Programme Fidélité', desc: 'Cumulez des points à chaque achat' },
  { icone: <Star className="w-6 h-6" />, titre: '4.5/5 sur 2000+ avis', desc: 'Nos clients nous recommandent' },
  { icone: <Clock className="w-6 h-6" />, titre: 'Service client', desc: 'Lun–Sam 9h–18h, réponse sous 2h' },
]

function TimerPromo() {
  const [t, setT] = useState({ h: 5, m: 42, s: 30 })
  useEffect(() => {
    const i = setInterval(() => {
      setT(p => {
        let { h, m, s } = p
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) return { h: 23, m: 59, s: 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(i)
  }, [])
  const f = n => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-2">
      {[['H', t.h], ['M', t.m], ['S', t.s]].map(([l, v]) => (
        <div key={l} className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-mono font-bold text-lg">
            {f(v)}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 font-semibold">{l}</span>
        </div>
      ))}
    </div>
  )
}

function BrandLogo({ marque: m }) {
  const [ok, setOk] = useState(true)
  if (!ok) {
    const init = m.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return <span className="font-bold text-sm">{init}</span>
  }
  return <img src={m.logo} alt={m.nom} className="h-7" onError={() => setOk(false)} />
}

export default function Accueil() {
  const [slide, setSlide]       = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [temoinIndex, setTemoinIndex] = useState(0)

  useEffect(() => {
    if (!autoplay) return
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [autoplay])

  useEffect(() => {
    const t = setInterval(() => setTemoinIndex(i => (i + 1) % AVIS_TEMOIGNAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const { data: vedettesData }   = useQuery({ queryKey: ['vedettes'],   queryFn: produitsApi.vedettes,   staleTime: 5*60*1000 })
  const { data: promotionsData } = useQuery({ queryKey: ['promotions'], queryFn: produitsApi.promotions, staleTime: 5*60*1000 })
  const { data: nouveautesData } = useQuery({ queryKey: ['nouveautes'], queryFn: produitsApi.nouveautes, staleTime: 5*60*1000 })
  const { data: catData }        = useQuery({ queryKey: ['categories'], queryFn: produitsApi.categories, staleTime: 60*60*1000 })
  const { data: mieuxNotesData } = useQuery({ queryKey: ['mieux-notes'], queryFn: produitsApi.mieuxNotes, staleTime: 5*60*1000 })
  const { data: marquesData }    = useQuery({ queryKey: ['marques'],     queryFn: produitsApi.marques,    staleTime: 60*60*1000 })
  const { data: avisData }       = useQuery({ queryKey: ['avis-recents'], queryFn: produitsApi.avisRecents, staleTime: 5*60*1000 })

  const vedettes   = vedettesData?.data?.data   || []
  const promotions = promotionsData?.data?.data  || []
  const nouveautes = nouveautesData?.data?.data  || []
  const categories = catData?.data?.data         || []
  const mieuxNotes = mieuxNotesData?.data?.data  || []
  const marques    = marquesData?.data?.data     || []
  const avisRecents = avisData?.data?.data       || []

  function changeSlide(n) {
    setSlide(n)
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 8000)
  }

  const s = SLIDES[slide]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-[480px] md:h-[560px] bg-gray-900">
        {SLIDES.map((sl, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ zIndex: i === slide ? 1 : 0 }}
          >
            <img src={sl.image} alt="" className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-4 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20">
                  {s.badge}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line drop-shadow-lg" style={{ fontFamily: 'Syne' }}>
                  {s.titre}
                </h1>
                <p className="text-white/85 text-base md:text-lg mb-8 max-w-lg drop-shadow">{s.sousTitre}</p>
                <Link to={s.lien} className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl transition-all text-base shadow-lg">
                  {s.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => changeSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'}`} />
          ))}
        </div>
        <button onClick={() => changeSlide((slide - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors" style={{ zIndex: 3 }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => changeSlide((slide + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors" style={{ zIndex: 3 }}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ── Marques ────────────────────────────────────────────── */}
      {marques.length > 0 && (
        <section className="bg-white border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Nos marques partenaires</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {marques.map(m => (
                <Link key={m.nom} to={`/produits?marque=${m.nom}`}
                  className={`${m.couleur} px-4 py-2 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                  <BrandLogo marque={m} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Avantages ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {AVANTAGES.map(g => (
              <div key={g.titre} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-vert-100 rounded-xl flex items-center justify-center text-vert-600 flex-shrink-0">
                  {g.icone}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{g.titre}</p>
                  <p className="text-xs text-gray-500">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* ── Catégories ───────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between mb-7">
              <h2 className="text-3xl font-bold text-gray-900">Nos catégories</h2>
              <Link to="/produits" className="flex items-center gap-1.5 text-sm font-semibold text-vert-600 hover:text-vert-700 group">
                Tout voir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {categories.slice(0, 8).map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/produits?categorie=${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 hover:border-vert-300 hover:shadow-md hover:-translate-y-1 transition-all group text-center">
            <div className="w-12 h-12 bg-vert-50 rounded-2xl flex items-center justify-center text-vert-600 group-hover:bg-vert-100 transition-colors">
              <CategoryIcon slug={cat.slug} className="w-6 h-6" />
            </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-vert-700 leading-tight">{cat.nom}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Meilleurs notes ──────────────────────────────────────── */}
        {mieuxNotes.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-7">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold text-gray-900">Les mieux notés</h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">⭐ 4.5+</span>
                </div>
                <p className="text-gray-500 mt-1">Ce que nos clients préfèrent</p>
              </div>
              <Link to="/produits?tri=note" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-vert-600 hover:text-vert-700 group">
                Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mieuxNotes.slice(0, 8).map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Vedettes ─────────────────────────────────────────────── */}
        {vedettes.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-7">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Nos produits vedettes</h2>
                <p className="text-gray-500 mt-1">Sélectionnés par notre équipe pour vous</p>
              </div>
              <Link to="/produits" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-vert-600 hover:text-vert-700 group">
                Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {vedettes.slice(0, 8).map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Promotions ───────────────────────────────────────────── */}
        {promotions.length > 0 && (
          <section className="mt-16">
            <div className="relative rounded-3xl overflow-hidden mb-7 h-44 md:h-52">
              <img src="https://loremflickr.com/1200/400/sale,cosmetics" alt="Promotions" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-orange-800/65 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'Syne' }}>
                      🔥 Promotions du moment
                    </h2>
                    <p className="text-white/80 text-sm sm:text-base">Des réductions exceptionnelles, durée limitée !</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Se termine dans</p>
                      <TimerPromo />
                    </div>
                    <Link to="/produits?en_promo=true"
                      className="hidden sm:flex items-center gap-2 bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap text-sm">
                      Voir tout <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {promotions.slice(0, 4).map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Avis clients ─────────────────────────────────────────── */}
        {avisRecents.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Ce que disent nos clients</h2>
              <p className="text-gray-500 mt-1">4.5/5 sur plus de 2 000 avis vérifiés</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {avisRecents.slice(0, 3).map((avis, i) => {
                const user = avis.user || 'Client'
                const initiales = user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                const couleurs = ['bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700']
                return (
                  <div key={avis.id} className="carte p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={14} className={i < avis.note ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{avis.commentaire}"</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${couleurs[i]}`}>
                        {initiales}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user}</p>
                        <p className="text-xs text-gray-400">{avis.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Nouveautés ────────────────────────────────────────────── */}
        {nouveautes.length > 0 && (
          <section className="mt-16 mb-6">
            <div className="flex items-end justify-between mb-7">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Nouveautés</h2>
                <p className="text-gray-500 mt-1">Les derniers arrivages dans notre catalogue</p>
              </div>
              <Link to="/produits?tri=recent" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-vert-600 hover:text-vert-700 group">
                Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {nouveautes.slice(0, 8).map((p, i) => <CarteProduit key={p.id} produit={p} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Newsletter ─────────────────────────────────────────── */}
        <section className="mt-16 mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-vert-600 to-emerald-700 p-8 md:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 left-5 text-6xl">🧴</div>
              <div className="absolute bottom-5 right-5 text-6xl">💊</div>
              <div className="absolute top-1/2 right-1/4 text-4xl">🌿</div>
            </div>
            <div className="relative z-10 max-w-lg mx-auto">
              <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2" style={{ fontFamily: 'Syne' }}>
                Ne manquez aucune offre
              </h2>
              <p className="text-white/80 text-sm mb-6">
                Recevez nos promotions exclusives et nos conseils santé directement dans votre boîte mail.
              </p>
              <form onSubmit={e => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="votre@email.com" className="flex-1 px-4 py-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-white/50 bg-white/95 placeholder-gray-400" />
                <button type="submit" className="bg-white text-vert-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                  S'abonner
                </button>
              </form>
              <p className="text-white/60 text-xs mt-3">Aucun spam, désinscription à tout moment.</p>
            </div>
          </div>
        </section>

        {/* ── Témoignages ────────────────────────────────────────── */}
        <section className="mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={temoinIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            >
              <Quote className="w-8 h-8 text-vert-300 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-6">
                "{AVIS_TEMOIGNAGES[temoinIndex].texte}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} className={i < AVIS_TEMOIGNAGES[temoinIndex].note ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="font-semibold text-gray-900">{AVIS_TEMOIGNAGES[temoinIndex].nom}</p>
              <p className="text-sm text-gray-400">{AVIS_TEMOIGNAGES[temoinIndex].ville} · {AVIS_TEMOIGNAGES[temoinIndex].date}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {AVIS_TEMOIGNAGES.map((_, i) => (
                  <button key={i} onClick={() => setTemoinIndex(i)}
                    className={`rounded-full transition-all ${i === temoinIndex ? 'w-6 h-2 bg-vert-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </>
  )
}
