import { Sparkles, Pill, Heart, Scissors, Sun, Droplets, Apple, HeartPulse } from 'lucide-react'

const MAP = {
  'soins-visage':     Sparkles,
  'vitamines':        Pill,
  'bebe-maman':       Heart,
  'cheveux':          Scissors,
  'solaires':         Sun,
  'hygiene':          Droplets,
  'nutrition':        Apple,
  'premiers-secours': HeartPulse,
}

export default function CategoryIcon({ slug, className = 'w-5 h-5', fallback = '💊' }) {
  const Icon = MAP[slug]
  return Icon ? <Icon className={className} /> : <span>{fallback}</span>
}
