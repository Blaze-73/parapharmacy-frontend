import { useState } from 'react'
import CategoryIcon from '../CategoryIcon.jsx'
const STYLES = {
  'soins-visage':     { gradient: 'from-pink-50 via-rose-100 to-pink-200',  halo: 'bg-rose-300/40',  icone: 'text-rose-500' },
  'vitamines':        { gradient: 'from-amber-50 via-yellow-100 to-amber-200', halo: 'bg-amber-300/40', icone: 'text-amber-500' },
  'bebe-maman':       { gradient: 'from-sky-50 via-blue-100 to-sky-200',  halo: 'bg-sky-300/40',   icone: 'text-sky-500' },
  'cheveux':          { gradient: 'from-violet-50 via-purple-100 to-violet-200', halo: 'bg-violet-300/40', icone: 'text-violet-500' },
  'solaires':         { gradient: 'from-orange-50 via-amber-100 to-orange-200', halo: 'bg-orange-300/40', icone: 'text-orange-500' },
  'hygiene':          { gradient: 'from-teal-50 via-cyan-100 to-teal-200',  halo: 'bg-teal-300/40',  icone: 'text-teal-500' },
  'nutrition':        { gradient: 'from-lime-50 via-green-100 to-lime-200', halo: 'bg-lime-300/40',  icone: 'text-lime-600' },
  'premiers-secours': { gradient: 'from-red-50 via-rose-100 to-red-200',    halo: 'bg-red-300/40',   icone: 'text-red-500' },
  'default':          { gradient: 'from-slate-50 via-gray-100 to-slate-200', halo: 'bg-slate-300/40', icone: 'text-slate-400' },
}

export default function ImageProduit({ produit, className = '', iconeClass = 'w-12 h-12' }) {
  const [err, setErr] = useState(false)
  const [load, setLoad] = useState(true)
  const catSlug = produit?.categorie?.slug || ''
  const style   = STYLES[catSlug] || STYLES.default
  const icone   = produit?.categorie?.icone || '💊'

  if (produit?.image && !err) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {load && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
        <img
          src={produit.image}
          alt={produit.nom}
          loading="lazy"
          onLoad={() => setLoad(false)}
          onError={() => { setErr(true); setLoad(false) }}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden ${className}`}>
      <div className={`absolute w-2/3 h-2/3 rounded-full blur-2xl opacity-60 ${style.halo} -top-6 -left-6`} />
      <div className={`absolute w-1/2 h-1/2 rounded-full blur-xl opacity-50 ${style.halo} -bottom-8 -right-4`} />
      <div className="relative flex flex-col items-center gap-1.5">
        <CategoryIcon slug={catSlug} className={`${iconeClass} ${style.icone}`} />
        <span className="text-2xl leading-none opacity-80">{icone}</span>
      </div>
    </div>
  )
}
