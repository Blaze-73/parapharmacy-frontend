export function formatPrix(n) {
  const v = Number(n || 0)
  return v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatPrixUnite(n) {
  const v = Number(n || 0)
  return v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

export function dateLivraison(jours = [1, 2], depart = new Date()) {
  const resultats = []
  let d = new Date(depart.getTime())
  while (resultats.length < jours.length) {
    d = new Date(d.getTime() + 86400000)
    const jour = d.getDay()
    if (jour !== 0 && jour !== 6) resultats.push(new Date(d.getTime()))
  }
  return resultats
}

export function formatDateLivraison(jours = [1, 2]) {
  const dates = dateLivraison(jours)
  const opts = { weekday: 'short', day: 'numeric', month: 'long' }
  const premier = dates[0].toLocaleDateString('fr-FR', opts)
  if (dates.length < 2) return premier
  const dernier = dates[dates.length - 1].toLocaleDateString('fr-FR', opts)
  return `${premier} – ${dernier}`
}

export function numWhatsApp(num) {
  let n = String(num || '').replace(/[^\d]/g, '')
  if (n.startsWith('0')) n = '212' + n.slice(1)
  return n
}

export function lienWhatsApp(numero, message) {
  const url = `https://wa.me/${numWhatsApp(numero)}`
  if (!message) return url
  return `${url}?text=${encodeURIComponent(message)}`
}
