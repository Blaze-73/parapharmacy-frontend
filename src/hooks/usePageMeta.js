import { useEffect } from 'react'
import { SITE } from '../config.js'

const BASE = SITE.domaine
const SITE_NAME = SITE.nom
const DEFAULT_DESC =
  `Achetez en ligne vos produits de parapharmacie au Maroc : soins visage, vitamines, bébé & maman, solaires et plus. Livraison 24–48h, gratuite dès ${SITE.fraisLivraisonGratuite} MAD.`
const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=80&auto=format'

function upsertMeta(selector, attrs, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  if (content) el.setAttribute('content', content)
}

export default function usePageMeta({
  title,
  description,
  path = '/',
  image = DEFAULT_IMG,
  noindex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const url = `${BASE}${path === '/' ? '/' : path.replace(/\/+$/, '')}`
    const desc = description || DEFAULT_DESC
    const img = image.startsWith('/') ? BASE + image : image

    document.title = fullTitle
    upsertMeta('meta[name="description"]', { name: 'description' }, desc)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, fullTitle)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, desc)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, url)
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, img)
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, fullTitle)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, desc)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, img)

    upsertMeta(
      'meta[name="robots"]',
      { name: 'robots' },
      noindex ? 'noindex, nofollow' : 'index, follow'
    )

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, path, image, noindex])
}
