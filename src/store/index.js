import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Wishlist / Favoris ─────────────────────────────────────────────────────────
export const useWishlist = create(
  persist(
    (set, get) => ({
      ids: [],
      basculer: (id) => {
        const has = get().ids.includes(id)
        set({ ids: has ? get().ids.filter(x => x !== id) : [...get().ids, id] })
      },
      estFavori: (id) => get().ids.includes(id),
      nombre: () => get().ids.length,
    }),
    { name: 'wishlist', partialize: (s) => ({ ids: s.ids }) }
  )
)

// ── Récemment consultés ──────────────────────────────────────────────────────
export const useRecents = create(
  persist(
    (set, get) => ({
      produits: [],
      ajouter: (produit) => {
        if (!produit?.id) return
        const autres = get().produits.filter(p => p.id !== produit.id)
        set({ produits: [produit, ...autres].slice(0, 10) })
      },
    }),
    { name: 'recents', partialize: (s) => ({ produits: s.produits }) }
  )
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const useAuth = create(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      connecte: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, connecte: true })
      },

      setUser: (user) => set({ user }),

      deconnexion: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
        set({ user: null, token: null, connecte: false })
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, token: s.token, connecte: s.connecte }),
    }
  )
)

// ── Alertes de réapprovisionnement ─────────────────────────────────────────────
export const useAlertesStock = create(
  persist(
    (set, get) => ({
      ids: [],
      ajouter: (id) => set({ ids: get().ids.includes(id) ? get().ids : [...get().ids, id] }),
      retirer:  (id) => set({ ids: get().ids.filter(x => x !== id) }),
      basculer: (id) => set({ ids: get().ids.includes(id) ? get().ids.filter(x => x !== id) : [...get().ids, id] }),
    }),
    { name: 'alertes-stock', partialize: (s) => ({ ids: s.ids }) }
  )
)

// ── Notifications ──────────────────────────────────────────────────────────────
export const useNotifications = create(
  persist(
    (set, get) => ({
      lus: [],
      marquerLus: () => set({ lus: ['all'] }),
      estLu: (id) => get().lus.includes('all') || get().lus.includes(id),
    }),
    { name: 'notifications', partialize: (s) => ({ lus: s.lus }) }
  )
)

// ── Panier ────────────────────────────────────────────────────────────────────
export const usePanier = create(
  persist(
    (set, get) => ({
      articles: [],
      ouvert:   false,

      ajouterArticle: (produit, quantite = 1) => {
        set((s) => {
          const existe = s.articles.find((a) => a.produit.id === produit.id)
          if (existe) {
            return {
              articles: s.articles.map((a) =>
                a.produit.id === produit.id
                  ? { ...a, quantite: Math.min(a.quantite + quantite, produit.stock) }
                  : a
              ),
            }
          }
          return { articles: [...s.articles, { produit, quantite }] }
        })
      },

      retirerArticle: (id) =>
        set((s) => ({ articles: s.articles.filter((a) => a.produit.id !== id) })),

      modifierQuantite: (id, quantite) => {
        if (quantite <= 0) { get().retirerArticle(id); return }
        set((s) => ({
          articles: s.articles.map((a) =>
            a.produit.id === id ? { ...a, quantite } : a
          ),
        }))
      },

      viderPanier:  () => set({ articles: [] }),
      ouvrir:       () => set({ ouvert: true }),
      fermer:       () => set({ ouvert: false }),
      togglePanier: () => set((s) => ({ ouvert: !s.ouvert })),

      totalArticles: () => get().articles.reduce((t, a) => t + a.quantite, 0),
      sousTotal:     () => get().articles.reduce((t, a) => t + Number(a.produit.prix_effectif) * a.quantite, 0),
    }),
    {
      name: 'panier',
      partialize: (s) => ({ articles: s.articles }),
    }
  )
)
