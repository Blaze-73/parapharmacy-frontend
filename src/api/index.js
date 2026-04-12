import api from './client.js'

export const authApi = {
  inscription: (d) => api.post('/inscription', d),
  connexion:   (d) => api.post('/connexion', d),
  deconnexion: ()  => api.post('/deconnexion'),
  moi:         ()  => api.get('/moi'),
}

export const produitsApi = {
  liste:      (params) => api.get('/produits', { params }),
  detail:     (slug)   => api.get(`/produits/${slug}`),
  vedettes:   ()       => api.get('/produits/vedettes'),
  promotions: ()       => api.get('/produits/promotions'),
  nouveautes: ()       => api.get('/produits/nouveautes'),
  categories: ()       => api.get('/categories'),
}

export const commandesApi = {
  liste:   ()    => api.get('/commandes'),
  detail:  (id)  => api.get(`/commandes/${id}`),
  creer:   (d)   => api.post('/commandes', d),
  annuler: (id)  => api.post(`/commandes/${id}/annuler`),
}

export const adminApi = {
  tableau:          ()         => api.get('/admin/tableau-de-bord'),
  produits:         (p)        => api.get('/admin/produits', { params: p }),
  creerProduit:     (fd)       => api.post('/admin/produits', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  modifierProduit:  (id, fd)   => api.post(`/admin/produits/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  supprimerProduit: (id)       => api.delete(`/admin/produits/${id}`),
  commandes:        (p)        => api.get('/admin/commandes', { params: p }),
  statutCommande:   (id, s)    => api.put(`/admin/commandes/${id}/statut`, { statut: s }),
  utilisateurs:     (p)        => api.get('/admin/utilisateurs', { params: p }),
  categories:       ()         => api.get('/admin/categories'),
  creerCategorie:   (d)        => api.post('/admin/categories', d),
}
