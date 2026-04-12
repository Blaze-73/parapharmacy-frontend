import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Clock } from 'lucide-react'
import { produitsApi } from '../api/index.js'
import CarteProduit from '../components/product/CarteProduit.jsx'

const SLIDES = [
  {
    titre:     'Votre santé,\nnotre priorité',
    sousTitre: 'Produits de parapharmacie de qualité livrés chez vous en 24–48h',
    badge:     '✨ Nouveautés',
    lien:      '/produits',
    cta:       'Découvrir nos produits',
    // Woman applying skincare
    image:     'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=75&auto=format',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
  {
    titre:     'Promotions\nJusqu\'à -40%',
    sousTitre: 'Des offres exceptionnelles sur la cosmétique, les vitamines et le bien-être',
    badge:     '🔥 Offres limitées',
    lien:      '/produits?en_promo=true',
    cta:       'Voir les promos',
    // Beauty products flatlay
    image:     'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=75&auto=format',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
  {
    titre:     'Soins bébé\n& Maternité',
    sousTitre: 'Tout ce dont vous avez besoin pour bébé et la future maman',
    badge:     '👶 Bébé & Maman',
    lien:      '/produits?categorie=bebe-maman',
    cta:       'Explorer la gamme',
    // Mother and baby
    image:     'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=75&auto=format',
    overlay:   'from-black/70 via-black/40 to-transparent',
  },
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

export default function Accueil() {
  const [slide, setSlide]       = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [autoplay])

  const { data: vedettesData }   = useQuery({ queryKey: ['vedettes'],   queryFn: produitsApi.vedettes,   staleTime: 5*60*1000 })
  const { data: promotionsData } = useQuery({ queryKey: ['promotions'], queryFn: produitsApi.promotions, staleTime: 5*60*1000 })
  const { data: nouveautesData } = useQuery({ queryKey: ['nouveautes'], queryFn: produitsApi.nouveautes, staleTime: 5*60*1000 })
  const { data: catData }        = useQuery({ queryKey: ['categories'], queryFn: produitsApi.categories, staleTime: 60*60*1000 })

  const vedettes   = vedettesData?.data?.data   || []
  const promotions = promotionsData?.data?.data  || []
  const nouveautes = nouveautesData?.data?.data  || []
  const categories = catData?.data?.data         || []

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

        {/* Background images — crossfade using absolute positioning, NO flash */}
        {SLIDES.map((sl, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ zIndex: i === slide ? 1 : 0 }}
          >
            <img
              src={sl.image}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* Dark overlay — same for all slides, no color flash */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          </motion.div>
        ))}

        {/* Text content — also crossfades smoothly */}
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

                <h1
                  className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line drop-shadow-lg"
                  style={{ fontFamily: 'Syne' }}
                >
                  {s.titre}
                </h1>

                <p className="text-white/85 text-base md:text-lg mb-8 max-w-lg drop-shadow">
                  {s.sousTitre}
                </p>

                <Link
                  to={s.lien}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl transition-all text-base shadow-lg"
                >
                  {s.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <button
          onClick={() => changeSlide((slide - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
          style={{ zIndex: 3 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeSlide((slide + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
          style={{ zIndex: 3 }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ── Garanties ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icone: <Truck className="w-5 h-5" />,     titre: 'Livraison rapide',  desc: 'Gratuite dès 300 MAD' },
              { icone: <Shield className="w-5 h-5" />,    titre: 'Paiement sécurisé', desc: 'Données protégées' },
              { icone: <RefreshCw className="w-5 h-5" />, titre: 'Retour facile',     desc: '30 jours pour changer' },
              { icone: <Clock className="w-5 h-5" />,     titre: 'Service client',    desc: 'Lun–Sam 9h–18h' },
            ].map(g => (
              <div key={g.titre} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
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
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/produits?categorie=${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 hover:border-vert-300 hover:shadow-md hover:-translate-y-1 transition-all group text-center"
                  >
                    <div className="w-12 h-12 bg-vert-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-vert-100 transition-colors">
                      {cat.icone}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-vert-700 leading-tight">
                      {cat.nom}
                    </span>
                  </Link>
                </motion.div>
              ))}
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
            {/* Promo banner with real image */}
            <div className="relative rounded-3xl overflow-hidden mb-7 h-44 md:h-52">
              <img
                src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=75&auto=format"
                alt="Promotions"
                className="w-full h-full object-cover"
              />
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

        {/* ── Nouveautés ────────────────────────────────────────────── */}
        {nouveautes.length > 0 && (
          <section className="mt-16 mb-16">
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
      </div>
    </>
  )
}
