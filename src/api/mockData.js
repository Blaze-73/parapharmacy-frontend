import dataFichier from '../data/produits.json'
import { SITE } from '../config.js'

const ADMIN_EMAIL = SITE.contact.email

const CATEGORIES = []
const PRODUITS = []
const AVIS = []
const BRANDS = []
const COMMANDES = []
const UTILISATEURS = []

function paginate(arr, page = 1, perPage = 20) {
  const total = arr.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const items = arr.slice(start, start + perPage)
  return { data: items, meta: { total, page_actuelle: page, derniere_page: lastPage, par_page: perPage } }
}

function filterProducts(params = {}) {
  let result = [...PRODUITS]
  if (params.recherche) {
    const q = params.recherche.toLowerCase()
    result = result.filter(p =>
      p.nom.toLowerCase().includes(q) ||
      p.marque.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }
  if (params.categorie) result = result.filter(p => p.categorie.slug === params.categorie)
  if (params.en_promo) result = result.filter(p => p.en_solde)
  if (params.en_stock) result = result.filter(p => p.en_stock)
  if (params.marque) result = result.filter(p => p.marque.toLowerCase() === params.marque.toLowerCase())
  if (params.tri === 'prix_asc') result.sort((a, b) => a.prix_effectif - b.prix_effectif)
  else if (params.tri === 'prix_desc') result.sort((a, b) => b.prix_effectif - a.prix_effectif)
  else if (params.tri === 'nom') result.sort((a, b) => a.nom.localeCompare(b.nom))
  else if (params.tri === 'note') result.sort((a, b) => (b.note || 0) - (a.note || 0))
  else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const page = parseInt(params.page || '1', 10)
  const perPage = parseInt(params.par_page || '20', 10)
  return paginate(result, page, perPage)
}

const STORAGE_KEY = 'parapharmacy_data_v3'

function sauvegarder() {
  try {
    const raw = JSON.stringify({ produits: PRODUITS, commandes: COMMANDES, categories: CATEGORIES, avis: AVIS, brands: BRANDS, utilisateurs: UTILISATEURS })
    const sizeKB = new Blob([raw]).size / 1024
    if (sizeKB > 4000) { console.warn('sauvegarder: données trop volumineuses (' + Math.round(sizeKB) + ' KB) — tentative…') }
    localStorage.setItem(STORAGE_KEY, raw)
  } catch (e) {
    console.error('sauvegarder: échec — ' + e.message)
    throw new Error('Impossible de sauvegarder : ' + (e.name === 'QuotaExceededError' ? 'limite de stockage dépassée' : e.message))
  }
}

function charger() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (data.produits?.length) { PRODUITS.length = 0; PRODUITS.push(...data.produits) }
    if (data.commandes?.length) { COMMANDES.length = 0; COMMANDES.push(...data.commandes) }
    if (data.categories?.length) { CATEGORIES.length = 0; CATEGORIES.push(...data.categories) }
    if (data.utilisateurs?.length) {
      const avecMdp = data.utilisateurs.filter(u => u.password)
      if (avecMdp.length) { UTILISATEURS.length = 0; UTILISATEURS.push(...avecMdp) }
    }
  } catch (e) { /* ignore */ }
}

function initialiserDepuisFichier() {
  const data = dataFichier
  if (data.categories?.length) { CATEGORIES.length = 0; CATEGORIES.push(...data.categories) }
  if (data.produits?.length) { PRODUITS.length = 0; PRODUITS.push(...data.produits) }
  if (data.commandes?.length) { COMMANDES.length = 0; COMMANDES.push(...data.commandes) }
  if (data.avis?.length) { AVIS.length = 0; AVIS.push(...data.avis) }
  if (data.brands?.length) { BRANDS.length = 0; BRANDS.push(...data.brands) }
  if (data.utilisateurs?.length) { UTILISATEURS.length = 0; UTILISATEURS.push(...data.utilisateurs) }
}
initialiserDepuisFichier()
charger()

const STATUT_LABELS = { en_attente: 'En attente', confirmee: 'Confirmée', expediee: 'Expédiée', livree: 'Livrée', annulee: 'Annulée' }

const STATUT_TRANSITIONS = {
  en_attente: ['confirmee', 'annulee'],
  confirmee:  ['expediee', 'annulee'],
  expediee:   ['livree', 'annulee'],
  livree:     [],
  annulee:    [],
}
const PAIEMENT_LABELS = { livraison: 'Paiement à la livraison', carte: 'Carte bancaire' }

function htmlEscape(v) {
  const s = v === null || v === undefined ? '' : String(v)
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tableHTML(colonnes, lignes) {
  const head = colonnes.map(c => `<th>${htmlEscape(c.titre)}</th>`).join('')
  const body = lignes
    .map(l => '<tr>' + colonnes.map(c => `<td>${c.valeur(l)}</td>`).join('') + '</tr>')
    .join('')
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

function badgeStatut(statut) {
  const label = STATUT_LABELS[statut] || statut
  return `<span class="st st-${statut}">${htmlEscape(label)}</span>`
}

function telechargerFichier(fichier, contenu, type) {
  const blob = new Blob([contenu], { type: type || 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fichier
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function exporterDonnees() {
  const maintenant = new Date()
  const date = maintenant.toISOString().slice(0, 10)
  const dateLisible = maintenant.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const caTotal = COMMANDES.reduce((t, c) => t + Number(c.total || 0), 0)
  const noteMoyenne = PRODUITS.length
    ? (PRODUITS.reduce((t, p) => t + Number(p.note || 0), 0) / PRODUITS.length).toFixed(1)
    : '0'

  const sections = [
    {
      titre: 'Produits',
      compteur: PRODUITS.length + ' produits',
      table: tableHTML([
        { titre: 'Nom', valeur: p => htmlEscape(p.nom) },
        { titre: 'Marque', valeur: p => htmlEscape(p.marque) },
        { titre: 'Catégorie', valeur: p => htmlEscape(p.categorie?.nom || '') },
        { titre: 'Prix (MAD)', valeur: p => Number(p.prix || 0).toFixed(2) },
        { titre: 'Prix promo (MAD)', valeur: p => (p.prix_promo ? Number(p.prix_promo).toFixed(2) : '—') },
        { titre: 'Stock', valeur: p => p.stock },
        { titre: 'Note', valeur: p => `${p.note || 0}/5` },
      ], PRODUITS),
    },
    {
      titre: 'Commandes',
      compteur: COMMANDES.length + ' commandes',
      table: tableHTML([
        { titre: 'N°', valeur: c => htmlEscape(c.numero) },
        { titre: 'Client', valeur: c => htmlEscape(c.user?.nom || '') },
        { titre: 'Statut', valeur: c => badgeStatut(c.statut) },
        { titre: 'Total (MAD)', valeur: c => Number(c.total || 0).toFixed(2) },
        { titre: 'Paiement', valeur: c => htmlEscape(PAIEMENT_LABELS[c.paiement] || c.paiement || '') },
        { titre: 'Ville', valeur: c => htmlEscape(c.ville || '') },
        { titre: 'Date', valeur: c => new Date(c.created_at).toLocaleDateString('fr-FR') },
      ], COMMANDES),
    },
    {
      titre: 'Clients',
      compteur: UTILISATEURS.length + ' clients',
      table: tableHTML([
        { titre: 'Nom', valeur: u => htmlEscape(u.nom) },
        { titre: 'Email', valeur: u => htmlEscape(u.email) },
        { titre: 'Téléphone', valeur: u => htmlEscape(u.telephone || '') },
        { titre: 'Rôle', valeur: u => (u.role === 'admin' ? 'Administrateur' : 'Client') },
        { titre: 'Commandes', valeur: u => u.commandes_count || 0 },
      ], UTILISATEURS),
    },
    {
      titre: 'Avis clients',
      compteur: AVIS.length + ' avis',
      table: tableHTML([
        { titre: 'Produit', valeur: a => htmlEscape(PRODUITS.find(p => p.id === a.produit_id)?.nom || `Produit #${a.produit_id}`) },
        { titre: 'Client', valeur: a => htmlEscape(a.user) },
        { titre: 'Note', valeur: a => `${a.note}/5` },
        { titre: 'Commentaire', valeur: a => htmlEscape(a.commentaire) },
        { titre: 'Date', valeur: a => new Date(a.date).toLocaleDateString('fr-FR') },
      ], AVIS),
    },
  ]

  const contenu = `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Rapport Parapharmacie — ${dateLisible}</title>
<style>
  :root { --vert:#16a34a; --vert-fonce:#15803d; --texte:#111827; --muted:#6b7280; --fond:#f3f4f6; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; background:var(--fond); color:var(--texte); }
  header { background:linear-gradient(135deg,var(--vert),var(--vert-fonce)); color:#fff; padding:24px 16px; }
  header h1 { margin:0 0 4px; font-size:22px; }
  header p { margin:0; opacity:.9; font-size:13px; }
  .stats { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
  .stat { background:rgba(255,255,255,.15); border-radius:10px; padding:8px 12px; font-size:13px; }
  .stat b { display:block; font-size:18px; }
  main { max-width:960px; margin:0 auto; padding:16px; }
  section { background:#fff; border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,.08); margin-bottom:18px; overflow:hidden; }
  section h2 { margin:0; padding:14px 16px; font-size:16px; background:#f9fafb; border-bottom:1px solid #e5e7eb; }
  section h2 span { font-weight:400; color:var(--muted); font-size:12px; margin-left:8px; }
  .wrap { overflow-x:auto; }
  table { border-collapse:collapse; width:100%; min-width:640px; font-size:13px; }
  th, td { text-align:left; padding:9px 12px; border-bottom:1px solid #f0f0f0; white-space:nowrap; }
  th { background:#f9fafb; color:#374151; font-weight:600; position:sticky; top:0; }
  tr:last-child td { border-bottom:none; }
  .st { display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; }
  .st-en_attente { background:#fef3c7; color:#92400e; }
  .st-confirmee { background:#d1fae5; color:#065f46; }
  .st-expediee { background:#dbeafe; color:#1e40af; }
  .st-livree { background:#c7e9c0; color:#14532d; }
  .st-annulee { background:#fee2e2; color:#991b1b; }
  footer { text-align:center; color:var(--muted); font-size:12px; padding:12px; }
  @media (max-width:600px){ header h1 { font-size:19px; } main { padding:10px; } th,td { padding:8px; font-size:12px; } }
</style>
</head>
<body>
<header>
  <h1>Rapport — Parapharmacie Elmakhfi</h1>
  <p>Rapport exporté le ${dateLisible}</p>
  <div class="stats">
    <div class="stat"><b>${PRODUITS.length}</b>Produits</div>
    <div class="stat"><b>${COMMANDES.length}</b>Commandes</div>
    <div class="stat"><b>${UTILISATEURS.length}</b>Clients</div>
    <div class="stat"><b>${AVIS.length}</b>Avis</div>
    <div class="stat"><b>${caTotal.toLocaleString('fr-FR')} MAD</b>Chiffre d'affaires</div>
    <div class="stat"><b>${noteMoyenne}/5</b>Note moyenne</div>
  </div>
</header>
<main>
${sections.map(s => `<section><h2>${htmlEscape(s.titre)} <span>${htmlEscape(s.compteur)}</span></h2><div class="wrap">${s.table}</div></section>`).join('\n')}
</main>
<footer>Généré depuis l'espace d'administration — Parapharmacie Elmakhfi</footer>
</body>
</html>`

  telechargerFichier(`rapport-parapharmacie-${date}.html`, contenu, 'text/html;charset=utf-8;')
}

let orderIdCounter = 8
const orderNumDate = new Date().toISOString().slice(0, 7).replace('-', '')

export function getCategories() {
  return Promise.resolve({ data: { data: CATEGORIES } })
}

export function getProduitsVedettes() {
  const vedettes = PRODUITS.filter(p => p.en_vedette).slice(0, 8)
  return Promise.resolve({ data: { data: vedettes } })
}

export function getProduitsPromotions() {
  const promos = PRODUITS.filter(p => p.en_solde)
  return Promise.resolve({ data: { data: promos } })
}

export function getProduitsNouveautes() {
  const sorted = [...PRODUITS].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return Promise.resolve({ data: { data: sorted.slice(0, 12) } })
}

export function getProduitsLesMieuxNotes() {
  const sorted = [...PRODUITS].sort((a, b) => (b.note || 0) - (a.note || 0))
  return Promise.resolve({ data: { data: sorted.slice(0, 8) } })
}

export function getProduitsListe(params = {}) {
  const result = filterProducts(params)
  return Promise.resolve({ data: result })
}

export function getProduitDetail(slug) {
  const produit = PRODUITS.find(p => p.slug === slug) || null
  const similaires = produit
    ? PRODUITS.filter(p => p.categorie_id === produit.categorie_id && p.id !== produit.id).slice(0, 6)
    : []
  const avis = produit ? AVIS.filter(a => a.produit_id === produit.id) : []
  return Promise.resolve({ data: { data: { produit, similaires, avis } } })
}

export function getMarques() {
  const compteur = PRODUITS.reduce((acc, p) => {
    acc[p.marque] = (acc[p.marque] || 0) + 1
    return acc
  }, {})
  const marques = BRANDS.map(m => ({ ...m, produits: compteur[m.nom] || 0 }))
  return Promise.resolve({ data: { data: marques } })
}

export function getAvisRecents() {
  return Promise.resolve({ data: { data: AVIS.slice(-6).reverse() } })
}

let avisIdCounter = 16
export function soumettreAvis(produitId, note, commentaire) {
  const avis = { id: avisIdCounter++, produit_id: produitId, user: 'Vous', note, commentaire, date: new Date().toISOString().slice(0, 10) }
  AVIS.push(avis)
  const p = PRODUITS.find(x => x.id === produitId)
  if (p) {
    p.nb_avis = (p.nb_avis || 0) + 1
    p.note = ((p.note || 0) * (p.nb_avis - 1) + note) / p.nb_avis
  }
  sauvegarder()
  return Promise.resolve({ data: { data: avis } })
}

export function creerCommande(payload) {
  const id = orderIdCounter++
  const numero = `CMD-${orderNumDate}-${String(id).padStart(4, '0')}`
  const now = new Date().toISOString()
  const items = (payload.items || [])
  const total = items.reduce((sum, item) => {
    const p = PRODUITS.find(prod => prod.id === item.produit_id)
    return sum + (p ? Number(p.prix_effectif) * item.quantite : 0)
  }, 0)
  const frais = total > 0 && total < 300 ? 30 : 0
  const telephone = payload.telephone || ''
  const user = payload.user || { id: 1, nom: "Admin Elmakhfi", email: ADMIN_EMAIL, telephone }
  const commande = {
    id, numero,
    user_id: payload.user_id ?? 1,
    user,
    items: items.map(item => {
      const p = PRODUITS.find(prod => prod.id === item.produit_id)
      return {
        produit_id: item.produit_id,
        nom: p?.nom || `Produit #${item.produit_id}`,
        prix_effectif: p ? Number(p.prix_effectif) : 0,
        quantite: item.quantite,
      }
    }),
    statut: 'en_attente',
    statut_updated_at: now,
    total: total + frais,
    sous_total: total,
    frais_livraison: frais,
    adresse_livraison: payload.adresse_livraison || 'Casablanca',
    ville: payload.ville || 'Casablanca',
    code_postal: payload.code_postal || '',
    telephone,
    paiement: payload.paiement || 'livraison',
    notes: payload.notes || '',
    created_at: now,
  }
  items.forEach(item => {
    const p = PRODUITS.find(prod => prod.id === item.produit_id)
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantite)
      p.en_stock = p.stock > 0
    }
  })
  COMMANDES.unshift(commande)
  sauvegarder()
  return Promise.resolve({ data: { data: { commande, numero } } })
}

export function getMesCommandes(userId) {
  const list = userId ? COMMANDES.filter(c => c.user_id === userId) : COMMANDES
  return Promise.resolve({ data: { data: list } })
}

export function getDetailCommande(id) {
  const cmd = COMMANDES.find(c => c.id === id) || null
  return Promise.resolve({ data: { data: cmd } })
}

export function annulerCommande(id) {
  const cmd = COMMANDES.find(c => c.id === id)
  if (cmd) {
    cmd.statut = 'annulee'
    cmd.statut_updated_at = new Date().toISOString()
    sauvegarder()
  }
  return Promise.resolve({ data: { data: cmd } })
}

const TOKENS = {}
let currentUser = null

export function connexion(credentials) {
  const user = UTILISATEURS.find(u => u.email?.toLowerCase() === (credentials.email || '').toLowerCase())
  if (!user || !credentials.password) {
    return Promise.reject({ response: { data: { message: 'Identifiants incorrects.' }, status: 401 } })
  }
  if (user.password !== credentials.password) {
    return Promise.reject({ response: { data: { message: 'Identifiants incorrects.' }, status: 401 } })
  }
  const token = 'mock-token-' + Date.now()
  TOKENS[token] = user
  currentUser = user
  const { password, ...sansMdp } = user
  return Promise.resolve({ data: { data: { user: sansMdp, token } } })
}

export function inscription(data) {
  const newUser = { id: UTILISATEURS.length + 10, nom: data.nom, email: data.email, telephone: data.telephone || '', role: 'client', password: data.password || '', commandes_count: 0, created_at: new Date().toISOString() }
  UTILISATEURS.push(newUser)
  const token = 'mock-token-' + Date.now()
  TOKENS[token] = newUser
  currentUser = newUser
  const { password, ...sansMdp } = newUser
  return Promise.resolve({ data: { data: { user: sansMdp, token } } })
}

export function deconnexion() {
  currentUser = null
  return Promise.resolve({ data: { data: null } })
}

export function getMoi() {
  return Promise.resolve({ data: { data: currentUser || UTILISATEURS[0] } })
}

export function getAdminTableau() {
  const chiffreAffaires = COMMANDES
    .filter(c => c.statut !== 'annulee')
    .reduce((t, c) => t + Number(c.total || 0), 0)
  const noteMoyenne = PRODUITS.length
    ? (PRODUITS.reduce((t, p) => t + Number(p.note || 0), 0) / PRODUITS.length).toFixed(1)
    : '0'
  return Promise.resolve({
    data: {
      data: {
        chiffre_affaires: chiffreAffaires,
        total_commandes: COMMANDES.length,
        total_produits: PRODUITS.length,
        total_clients: UTILISATEURS.length,
        note_moyenne: Number(noteMoyenne),
        commandes_recentes: COMMANDES.slice(0, 8),
        produits_stock_bas: PRODUITS.filter(p => p.stock <= 20).slice(0, 5),
      }
    }
  })
}

export function getAdminProduits(params) {
  const p = { ...(params || {}), par_page: Number(params?.par_page) || 20 }
  const result = filterProducts(p)
  return Promise.resolve({ data: result })
}

function getImagesFromData(data, existing) {
  const urls = []
  for (const key of ['image_1', 'image_2', 'image_3']) {
    const val = data.get?.(key)
    if (val && typeof val === 'string' && val.startsWith('data:')) urls.push(val)
  }
  if (urls.length === 0 && existing?.images?.length) return { images: [...existing.images], image: existing.image }
  if (urls.length === 0) {
    return { images: [], image: null }
  }
  return { images: urls, image: urls[0] }
}

export function creerProduit(data) {
  try {
    const maxId = Math.max(...PRODUITS.map(p => p.id))
    const cat = CATEGORIES.find(c => c.id === Number(data.get?.('categorie_id'))) || CATEGORIES[0]
    const imgs = getImagesFromData(data)
    const nouveau = {
      id: maxId + 1,
      nom: data.get?.('nom') || 'Nouveau produit',
      slug: (data.get?.('nom') || 'nouveau-produit').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      marque: data.get?.('marque') || '',
      categorie_id: cat.id,
      categorie: cat,
      prix: Number(data.get?.('prix') || 0),
      prix_effectif: Number(data.get?.('prix_promo') || data.get?.('prix') || 0),
      prix_promo: Number(data.get?.('prix_promo') || 0),
      en_solde: !!data.get?.('prix_promo'),
      remise: 0,
      en_vedette: data.get?.('en_vedette') === '1',
      en_stock: Number(data.get?.('stock') || 0) > 0,
      stock: Number(data.get?.('stock') || 0),
      actif: data.get?.('actif') === '1',
      description: data.get?.('description') || '',
      images: imgs.images, image: imgs.image,
      note: 0,
      nb_avis: 0,
      created_at: new Date().toISOString(),
    }
    PRODUITS.push(nouveau)
    sauvegarder()
    return Promise.resolve({ data: { data: nouveau } })
  } catch (e) {
    return Promise.reject({ response: { data: { message: e.message } } })
  }
}

export function modifierProduit(id, data) {
  try {
    const idx = PRODUITS.findIndex(p => p.id === id)
    if (idx === -1) return Promise.reject({ response: { data: { message: 'Produit introuvable' }, status: 404 } })
    const exists = PRODUITS[idx]
    const cat = CATEGORIES.find(c => c.id === Number(data.get?.('categorie_id'))) || exists.categorie
    const imgs = getImagesFromData(data, exists)
    const updated = {
      ...exists,
      nom: data.get?.('nom') || exists.nom,
      marque: data.get?.('marque') || exists.marque,
      categorie_id: cat.id,
      categorie: cat,
      prix: Number(data.get?.('prix') || exists.prix),
      prix_effectif: Number(data.get?.('prix_promo') || data.get?.('prix') || exists.prix_effectif),
      prix_promo: Number(data.get?.('prix_promo') || exists.prix_promo || 0),
      en_solde: !!data.get?.('prix_promo') || exists.en_solde,
      en_vedette: data.get?.('en_vedette') === '1',
      en_stock: Number(data.get?.('stock') || exists.stock) > 0,
      stock: Number(data.get?.('stock') || exists.stock),
      actif: data.get?.('actif') === '1',
      description: data.get?.('description') || exists.description,
      images: imgs.images,
      image: imgs.image,
    }
    PRODUITS[idx] = updated
    sauvegarder()
    return Promise.resolve({ data: { data: updated } })
  } catch (e) {
    return Promise.reject({ response: { data: { message: e.message } } })
  }
}

export function supprimerProduit(id) {
  const idx = PRODUITS.findIndex(p => p.id === id)
  if (idx > -1) PRODUITS.splice(idx, 1)
  sauvegarder()
  return Promise.resolve({ data: { data: null } })
}

export function getAdminCommandes(params) {
  let result = [...COMMANDES]
  if (params?.statut) result = result.filter(c => c.statut === params.statut)
  if (params?.recherche) {
    const q = params.recherche.toLowerCase()
    result = result.filter(c =>
      (c.numero || '').toLowerCase().includes(q) ||
      (c.user?.nom || '').toLowerCase().includes(q) ||
      (c.user?.email || '').toLowerCase().includes(q) ||
      (c.ville || '').toLowerCase().includes(q)
    )
  }
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return Promise.resolve({ data: paginate(result, Number(params?.page) || 1, Number(params?.par_page) || 20) })
}

export function updateStatutCommande(id, statut) {
  const cmd = COMMANDES.find(c => c.id === id)
  if (!cmd) return Promise.resolve({ data: { data: null } })
  if (!STATUT_TRANSITIONS[cmd.statut]?.includes(statut)) {
    return Promise.reject(new Error(`Transition invalide : ${cmd.statut} → ${statut}`))
  }
  cmd.statut = statut
  cmd.statut_updated_at = new Date().toISOString()
  sauvegarder()
  return Promise.resolve({ data: { data: cmd } })
}

export function getAdminCategories() {
  return Promise.resolve({ data: { data: CATEGORIES } })
}

export function creerCategorie(data) {
  const maxId = Math.max(...CATEGORIES.map(c => c.id))
  CATEGORIES.push({ id: maxId + 1, nom: data.nom, slug: data.nom.toLowerCase().replace(/\s+/g, '-'), icone: data.icone || '📦' })
  return Promise.resolve({ data: { data: CATEGORIES[CATEGORIES.length - 1] } })
}

export function getAdminUtilisateurs(params) {
  let result = [...UTILISATEURS]
  if (params?.recherche) {
    const q = params.recherche.toLowerCase()
    result = result.filter(u =>
      (u.nom || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.telephone || '').toLowerCase().includes(q)
    )
  }
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return Promise.resolve({ data: paginate(result, Number(params?.page) || 1, Number(params?.par_page) || 20) })
}
