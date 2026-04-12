import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const useAuth = create(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      connecte: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        // Clear the cart when a NEW user logs in
        localStorage.removeItem('panier')
        // Reset cart state in memory too
        usePanier.setState({ articles: [], ouvert: false })
        set({ user, token, connecte: true })
      },

      setUser: (user) => set({ user }),

      deconnexion: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('panier')
        localStorage.removeItem('auth')
        // Reset cart immediately
        usePanier.setState({ articles: [], ouvert: false })
        set({ user: null, token: null, connecte: false })
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, token: s.token, connecte: s.connecte }),
    }
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
