import {
  getCategories,
  getProduitsVedettes,
  getProduitsPromotions,
  getProduitsNouveautes,
  getProduitsLesMieuxNotes,
  getProduitsListe,
  getProduitDetail,
  getMarques,
  getAvisRecents,
  creerCommande,
  getMesCommandes,
  getDetailCommande,
  annulerCommande,
  connexion,
  inscription,
  deconnexion,
  getMoi,
  getAdminTableau,
  getAdminProduits,
  creerProduit,
  modifierProduit,
  supprimerProduit,
  getAdminCommandes,
  updateStatutCommande,
  getAdminCategories,
  creerCategorie,
  getAdminUtilisateurs,
  exporterDonnees,
} from './mockData.js'

export const authApi = {
  inscription: (d) => inscription(d),
  connexion:   (d) => connexion(d),
  deconnexion: ()  => deconnexion(),
  moi:         ()  => getMoi(),
}

export const produitsApi = {
  liste:       (params) => getProduitsListe(params),
  detail:      (slug)   => getProduitDetail(slug),
  vedettes:    ()       => getProduitsVedettes(),
  promotions:  ()       => getProduitsPromotions(),
  nouveautes:  ()       => getProduitsNouveautes(),
  mieuxNotes:  ()       => getProduitsLesMieuxNotes(),
  categories:  ()       => getCategories(),
  marques:     ()       => getMarques(),
  avisRecents: ()       => getAvisRecents(),
}

export const commandesApi = {
  liste:   ()    => getMesCommandes(),
  detail:  (id)  => getDetailCommande(id),
  creer:   (d)   => creerCommande(d),
  annuler: (id)  => annulerCommande(id),
}

export const adminApi = {
  tableau:          ()         => getAdminTableau(),
  produits:         (p)        => getAdminProduits(p),
  creerProduit:     (fd)       => creerProduit(fd),
  modifierProduit:  (id, fd)   => modifierProduit(id, fd),
  supprimerProduit: (id)       => supprimerProduit(id),
  commandes:        (p)        => getAdminCommandes(p),
  statutCommande:   (id, s)    => updateStatutCommande(id, s),
  utilisateurs:     (p)        => getAdminUtilisateurs(p),
  categories:       ()         => getAdminCategories(),
  creerCategorie:   (d)        => creerCategorie(d),
  exporterDonnees:  ()         => exporterDonnees(),
}
