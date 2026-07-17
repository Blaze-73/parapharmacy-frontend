const CATEGORIES = [
  { id: 1, nom: 'Soins du visage', slug: 'soins-visage', icone: '🧴' },
  { id: 2, nom: 'Vitamines', slug: 'vitamines', icone: '💊' },
  { id: 3, nom: 'Bébé & Maman', slug: 'bebe-maman', icone: '👶' },
  { id: 4, nom: 'Cheveux', slug: 'cheveux', icone: '💇' },
  { id: 5, nom: 'Solaires', slug: 'solaires', icone: '☀️' },
  { id: 6, nom: 'Hygiène', slug: 'hygiene', icone: '🧼' },
  { id: 7, nom: 'Nutrition', slug: 'nutrition', icone: '🥗' },
  { id: 8, nom: 'Premiers secours', slug: 'premiers-secours', icone: '🏥' },
]

const PRODUITS = [
  { id: 1, nom: 'Sérum Hydratant Acide Hyaluronique', slug: 'serum-hydratant-acide-hyaluronique', marque: 'Vichy', categorie_id: 1, categorie: CATEGORIES[0], prix: 320, prix_effectif: 285, prix_promo: 285, en_solde: true, remise: 11, en_vedette: true, en_stock: true, stock: 45, actif: true, note: 4.7, nb_avis: 128, description: 'Sérum concentré à l\'acide hyaluronique pour une hydratation intense et durable. Texture légère et pénétration rapide. Résultats visibles dès 7 jours.', images: [], image: null, created_at: '2025-12-01T10:00:00Z' },
  { id: 2, nom: 'Crème Riche Visage Nourrissante', slug: 'creme-riche-visage-nourrissante', marque: 'La Roche-Posay', categorie_id: 1, categorie: CATEGORIES[0], prix: 245, prix_effectif: 245, en_solde: false, en_vedette: true, en_stock: true, stock: 30, actif: true, note: 4.5, nb_avis: 94, description: 'Crème visage riche en beurre de karité et niacinamide pour nourrir et protéger les peaux sèches et sensibles.', images: [], image: null, created_at: '2025-11-15T10:00:00Z' },
  { id: 3, nom: 'Nettoyant Doux Surgras', slug: 'nettoyant-doux-surgras', marque: 'Avène', categorie_id: 1, categorie: CATEGORIES[0], prix: 185, prix_effectif: 185, en_solde: false, en_vedette: false, en_stock: true, stock: 60, actif: true, note: 4.3, nb_avis: 67, description: 'Gel nettoyant surgras sans savon pour peaux sensibles. Nettoie en douceur sans agresser la barrière cutanée.', images: [], image: null, created_at: '2025-10-20T10:00:00Z' },
  { id: 4, nom: 'Contour des Yeux Anti-Âge', slug: 'contour-yeux-anti-age', marque: 'Vichy', categorie_id: 1, categorie: CATEGORIES[0], prix: 290, prix_effectif: 232, prix_promo: 232, en_solde: true, remise: 20, en_vedette: true, en_stock: true, stock: 25, actif: true, note: 4.6, nb_avis: 203, description: 'Soin contour des yeux à la caféine et à l\'acide hyaluronique. Corrige poches, cernes et rides en 4 semaines.', images: [], image: null, created_at: '2025-11-01T10:00:00Z' },
  { id: 5, nom: 'Complexe Multivitaminé Énergie', slug: 'complexe-multivitamine-energie', marque: 'Pileje', categorie_id: 2, categorie: CATEGORIES[1], prix: 215, prix_effectif: 215, en_solde: false, en_vedette: true, en_stock: true, stock: 80, actif: true, note: 4.4, nb_avis: 156, description: 'Complexe breveté de 12 vitamines et 5 minéraux pour retrouver vitalité et énergie au quotidien. Cure de 30 jours.', images: [], image: null, created_at: '2025-12-10T10:00:00Z' },
  { id: 6, nom: 'Vitamine D3 2000 UI', slug: 'vitamine-d3-2000-ui', marque: 'Arkopharma', categorie_id: 2, categorie: CATEGORIES[1], prix: 145, prix_effectif: 145, en_solde: false, en_vedette: false, en_stock: true, stock: 120, actif: true, note: 4.8, nb_avis: 312, description: 'Complément alimentaire en huile de foie de morue riche en vitamine D3 pour renforcer l\'immunité et la santé osseuse.', images: [], image: null, created_at: '2025-11-20T10:00:00Z' },
  { id: 7, nom: 'Magnésium Marin + Vitamine B6', slug: 'magnesium-marin-vitamine-b6', marque: 'Forté Pharma', categorie_id: 2, categorie: CATEGORIES[1], prix: 178, prix_effectif: 142, prix_promo: 142, en_solde: true, remise: 20, en_vedette: true, en_stock: true, stock: 95, actif: true, note: 4.6, nb_avis: 189, description: 'Magnésium marin associé à la vitamine B6 pour réduire la fatigue, le stress et les crampes musculaires. Haute absorption.', images: [], image: null, created_at: '2025-12-05T10:00:00Z' },
  { id: 8, nom: 'Omega 3 Triple Force', slug: 'omega-3-triple-force', marque: 'Même', categorie_id: 2, categorie: CATEGORIES[1], prix: 260, prix_effectif: 260, en_solde: false, en_vedette: false, en_stock: true, stock: 55, actif: true, note: 4.5, nb_avis: 87, description: 'Oméga 3 concentré EPA/DHA 3:2 pour la santé cardiovasculaire et le bon fonctionnement du cerveau. 100% pur poisson.', images: [], image: null, created_at: '2025-10-15T10:00:00Z' },
  { id: 9, nom: 'Lait Hydratant Bébé', slug: 'lait-hydratant-bebe', marque: 'Mustela', categorie_id: 3, categorie: CATEGORIES[2], prix: 165, prix_effectif: 165, en_solde: false, en_vedette: true, en_stock: true, stock: 40, actif: true, note: 4.9, nb_avis: 245, description: 'Lait hydratant pour bébé à la texture onctueuse enrichi à l\'avocat bio. Hydrate, adoucit et protège la peau délicate.', images: [], image: null, created_at: '2025-11-10T10:00:00Z' },
  { id: 10, nom: 'Crème Change Bébé', slug: 'creme-change-bebe', marque: 'Biolane', categorie_id: 3, categorie: CATEGORIES[2], prix: 98, prix_effectif: 98, en_solde: false, en_vedette: false, en_stock: true, stock: 65, actif: true, note: 4.7, nb_avis: 178, description: 'Crème de change enrichie à l\'oxyde de zinc et au calendula. Protège, soulage et répare les rougeurs dès la première application.', images: [], image: null, created_at: '2025-09-25T10:00:00Z' },
  { id: 11, nom: 'Shampooing Doux Maternité', slug: 'shampooing-doux-maternite', marque: 'Mustela', categorie_id: 3, categorie: CATEGORIES[2], prix: 135, prix_effectif: 135, en_solde: false, en_vedette: false, en_stock: true, stock: 35, actif: true, note: 4.2, nb_avis: 43, description: 'Shampooing doux pour femme enceinte et bébé. Formule hypoallergénique sans parfum ni alcool.', images: [], image: null, created_at: '2025-10-05T10:00:00Z' },
  { id: 12, nom: 'Liniment Oléo-Calcaire', slug: 'liniment-oleo-calcaire', marque: 'Biolane', categorie_id: 3, categorie: CATEGORIES[2], prix: 78, prix_effectif: 78, en_solde: false, en_vedette: false, en_stock: true, stock: 100, actif: true, note: 4.4, nb_avis: 92, description: 'Liniment bio à l\'huile d\'olive et au calcium. Nettoie et protège la peau de bébé au moment du change en douceur.', images: [], image: null, created_at: '2025-08-15T10:00:00Z' },
  { id: 13, nom: 'Masque Capillaire Réparateur', slug: 'masque-capillaire-reparateur', marque: 'Kérastase', categorie_id: 4, categorie: CATEGORIES[3], prix: 295, prix_effectif: 295, en_solde: false, en_vedette: true, en_stock: true, stock: 20, actif: true, note: 4.8, nb_avis: 167, description: 'Masque réparateur intensif pour cheveux abîmés et fragilisés. Nutrition intense grâce à l\'huile de ricin et la kératine végétale.', images: [], image: null, created_at: '2025-12-12T10:00:00Z' },
  { id: 14, nom: 'Huile Capillaire Nutrition', slug: 'huile-capillaire-nutrition', marque: 'L\'Oréal Professionnel', categorie_id: 4, categorie: CATEGORIES[3], prix: 210, prix_effectif: 210, en_solde: false, en_vedette: false, en_stock: true, stock: 38, actif: true, note: 4.3, nb_avis: 76, description: 'Huile sèche capillaire nourrissante aux extraits de fleurs luxueuses. Termine la mise en pli avec brillance et légèreté.', images: [], image: null, created_at: '2025-11-25T10:00:00Z' },
  { id: 15, nom: 'Shampooing Anti-Pelliculaire', slug: 'shampooing-anti-pelliculaire', marque: 'Vichy', categorie_id: 4, categorie: CATEGORIES[3], prix: 168, prix_effectif: 151, prix_promo: 151, en_solde: true, remise: 10, en_vedette: false, en_stock: true, stock: 50, actif: true, note: 4.1, nb_avis: 55, description: 'Shampooing traitant anti-pelliculaire à l\'acide salicylique et au sélénium. Cuir chevelu apaisé dès la première utilisation.', images: [], image: null, created_at: '2025-10-10T10:00:00Z' },
  { id: 16, nom: 'Protection Solaire SPF50+', slug: 'protection-solaire-spf50', marque: 'Avène', categorie_id: 5, categorie: CATEGORIES[4], prix: 225, prix_effectif: 225, en_solde: false, en_vedette: true, en_stock: true, stock: 42, actif: true, note: 4.6, nb_avis: 134, description: 'Crème solaire haute protection SPF50+ pour peaux sensibles et intolérantes. Résiste à l\'eau, sans parfum.', images: [], image: null, created_at: '2025-12-08T10:00:00Z' },
  { id: 17, nom: 'Spray Solaire Enfant SPF30', slug: 'spray-solaire-enfant-spf30', marque: 'Mustela', categorie_id: 5, categorie: CATEGORIES[4], prix: 198, prix_effectif: 198, en_solde: false, en_vedette: false, en_stock: true, stock: 28, actif: true, note: 4.5, nb_avis: 88, description: 'Spray solaire spécial enfants SPF30. Protection large spectre UVA/UVB, formule résistante à l\'eau et sans parfum.', images: [], image: null, created_at: '2025-11-05T10:00:00Z' },
  { id: 18, nom: 'Gel Douche Surgras Hydratant', slug: 'gel-douche-surgras-hydratant', marque: 'Avène', categorie_id: 6, categorie: CATEGORIES[5], prix: 145, prix_effectif: 130, prix_promo: 130, en_solde: true, remise: 10, en_vedette: false, en_stock: true, stock: 72, actif: true, note: 4.2, nb_avis: 63, description: 'Gel douche surgras sans savon qui nettoie tout en respectant le film hydrolipidique des peaux sèches et sensibles.', images: [], image: null, created_at: '2025-09-01T10:00:00Z' },
  { id: 19, nom: 'Déodorant Aluminium-Free', slug: 'deodorant-aluminium-free', marque: 'Vichy', categorie_id: 6, categorie: CATEGORIES[5], prix: 128, prix_effectif: 128, en_solde: false, en_vedette: false, en_stock: true, stock: 90, actif: true, note: 4.0, nb_avis: 41, description: 'Déodorant sans sels d\'aluminium ni alcool, efficace 48h. Testé dermatologiquement pour les peaux réactives.', images: [], image: null, created_at: '2025-10-25T10:00:00Z' },
  { id: 20, nom: 'Savon Surgras Naturel', slug: 'savon-surgras-naturel', marque: 'Uriage', categorie_id: 6, categorie: CATEGORIES[5], prix: 65, prix_effectif: 65, en_solde: false, en_vedette: false, en_stock: true, stock: 150, actif: true, note: 4.7, nb_avis: 210, description: 'Savon surgras enrichi en beurre de karité et huile d\'amande douce. Nettoie en respectant les peaux sèches et sensibles.', images: [], image: null, created_at: '2025-08-20T10:00:00Z' },
  { id: 21, nom: 'Barre Protéinée Amande-Chocolat', slug: 'barre-proteinee-amande-chocolat', marque: 'Pileje', categorie_id: 7, categorie: CATEGORIES[6], prix: 45, prix_effectif: 45, en_solde: false, en_vedette: false, en_stock: true, stock: 200, actif: true, note: 4.3, nb_avis: 198, description: 'Barre protéinée riche en fibres, sans sucres ajoutés. 15g de protéines par barre, parfaite en collation post-sport.', images: [], image: null, created_at: '2025-12-15T10:00:00Z' },
  { id: 22, nom: 'Collagène Marin Pur', slug: 'collagene-marin-pur', marque: 'Arkopharma', categorie_id: 7, categorie: CATEGORIES[6], prix: 350, prix_effectif: 350, en_solde: false, en_vedette: true, en_stock: true, stock: 33, actif: true, note: 4.5, nb_avis: 142, description: 'Collagène marin hydrolysé pure à 100% pour la beauté de la peau, la santé des cheveux et des ongles. Saveur neutre.', images: [], image: null, created_at: '2025-12-20T10:00:00Z' },
  { id: 23, nom: 'Kit Premiers Soins Urgence', slug: 'kit-premiers-soins-urgence', marque: "Omar & Karima's", categorie_id: 8, categorie: CATEGORIES[7], prix: 189, prix_effectif: 189, en_solde: false, en_vedette: false, en_stock: true, stock: 18, actif: true, note: 4.6, nb_avis: 73, description: 'Kit complet de premiers secours avec pansements, compresses stériles, désinfectant et ciseaux. Idéal pour la maison.', images: [], image: null, created_at: '2025-10-01T10:00:00Z' },
  { id: 24, nom: 'Pansements Hydrocolloïdes', slug: 'pansements-hydrocolloides', marque: "Omar & Karima's", categorie_id: 8, categorie: CATEGORIES[7], prix: 55, prix_effectif: 55, en_solde: false, en_vedette: false, en_stock: true, stock: 300, actif: true, note: 4.1, nb_avis: 38, description: 'Pansements hydrocolloïdes invisibles pour soigner les ampoules, cors et petites plaies. Protection étanche 48h.', images: [], image: null, created_at: '2025-09-10T10:00:00Z' },
  { id: 25, nom: 'Eau Micellaire Démaquillante', slug: 'eau-micellaire-demaquillante', marque: 'La Roche-Posay', categorie_id: 1, categorie: CATEGORIES[0], prix: 175, prix_effectif: 158, prix_promo: 158, en_solde: true, remise: 10, en_vedette: false, en_stock: true, stock: 70, actif: true, note: 4.6, nb_avis: 432, description: 'Eau micellaire ultra-apaisante pour peaux sensibles. Démaquille et nettoie en un geste, sans rincer.', images: [], image: null, created_at: '2025-12-22T10:00:00Z' },
  { id: 26, nom: 'Soin Nuit Réparateur Visage', slug: 'soin-nuit-reparateur-visage', marque: 'Vichy', categorie_id: 1, categorie: CATEGORIES[0], prix: 310, prix_effectif: 310, en_solde: false, en_vedette: true, en_stock: true, stock: 22, actif: true, note: 4.7, nb_avis: 89, description: 'Soin nuit régénérant au resvératrol et à la vitamine C. Répare les signes de l\'âge pendant le sommeil.', images: [], image: null, created_at: '2025-12-28T10:00:00Z' },
  { id: 27, nom: 'Gommage Visage Doux Enzymatique', slug: 'gommage-visage-doux-enzymatique', marque: 'Avène', categorie_id: 1, categorie: CATEGORIES[0], prix: 195, prix_effectif: 195, en_solde: false, en_vedette: false, en_stock: true, stock: 48, actif: true, note: 4.4, nb_avis: 112, description: 'Gommage enzymatique doux aux particules de jojoba. Exfolie en douceur sans agresser, pour un teint lumineux.', images: [], image: null, created_at: '2026-01-02T10:00:00Z' },
  { id: 28, nom: 'Probiotiques Flore Intestinale', slug: 'probiotiques-flore-intestinale', marque: 'Pileje', categorie_id: 2, categorie: CATEGORIES[1], prix: 285, prix_effectif: 242, prix_promo: 242, en_solde: true, remise: 15, en_vedette: true, en_stock: true, stock: 65, actif: true, note: 4.8, nb_avis: 267, description: 'Probiotiques brevetés 4 souches pour rééquilibrer la flore intestinale. 30 gélules gastro-résistantes.', images: [], image: null, created_at: '2026-01-05T10:00:00Z' },
  { id: 29, nom: 'Vitamine C Pure 1000mg', slug: 'vitamine-c-pure-1000mg', marque: 'Arkopharma', categorie_id: 2, categorie: CATEGORIES[1], prix: 165, prix_effectif: 165, en_solde: false, en_vedette: false, en_stock: true, stock: 110, actif: true, note: 4.5, nb_avis: 198, description: 'Vitamine C pure dosage 1000mg en gélules végétales. Soutient l\'immunité et réduit la fatigue. Fabrication française.', images: [], image: null, created_at: '2025-12-30T10:00:00Z' },
  { id: 30, nom: 'Gelée Royale Fraîche Bio', slug: 'gelee-royale-fraiche-bio', marque: 'Forté Pharma', categorie_id: 2, categorie: CATEGORIES[1], prix: 420, prix_effectif: 378, prix_promo: 378, en_solde: true, remise: 10, en_vedette: false, en_stock: true, stock: 15, actif: true, note: 4.6, nb_avis: 85, description: 'Gelée royale fraîche bio 1.5g par dose. Tonus et vitalité au quotidien. Conditionnée sous vide.', images: [], image: null, created_at: '2026-01-08T10:00:00Z' },
  { id: 31, nom: 'Lingettes Bébé Aqua Pure', slug: 'lingettes-bebe-aqua-pure', marque: 'Mustela', categorie_id: 3, categorie: CATEGORIES[2], prix: 45, prix_effectif: 45, en_solde: false, en_vedette: false, en_stock: true, stock: 500, actif: true, note: 4.8, nb_avis: 523, description: 'Lingettes bébé 99% eau pure, sans parfum ni conservateur. Lot de 4 paquets de 60 lingettes chacun.', images: [], image: null, created_at: '2026-01-10T10:00:00Z' },
  { id: 32, nom: 'Stérilet Pansement Bébé', slug: 'sterilet-pansement-bebe', marque: 'Biolane', categorie_id: 3, categorie: CATEGORIES[2], prix: 135, prix_effectif: 135, en_solde: false, en_vedette: false, en_stock: true, stock: 45, actif: true, note: 4.3, nb_avis: 54, description: 'Crème protectrice à l\'eau thermale pour le change. Appliquer à chaque change pour prévenir les rougeurs.', images: [], image: null, created_at: '2025-12-25T10:00:00Z' },
  { id: 33, nom: 'Huile de Massage Bébé', slug: 'huile-massage-bebe', marque: 'Mustela', categorie_id: 3, categorie: CATEGORIES[2], prix: 118, prix_effectif: 118, en_solde: false, en_vedette: false, en_stock: true, stock: 55, actif: true, note: 4.6, nb_avis: 98, description: 'Huile de massage végétale 100% d\'origine naturelle. Facilite le moment de complicité entre parent et bébé.', images: [], image: null, created_at: '2025-12-18T10:00:00Z' },
  { id: 34, nom: 'Sérum Capillaire Anti-Chute', slug: 'serum-capillaire-anti-chute', marque: 'Kérastase', categorie_id: 4, categorie: CATEGORIES[3], prix: 380, prix_effectif: 342, prix_promo: 342, en_solde: true, remise: 10, en_vedette: true, en_stock: true, stock: 12, actif: true, note: 4.4, nb_avis: 134, description: 'Sérum anti-chute concentré à l\'aminexil et au complexe vitaminé. Réduit la chute en 6 semaines.', images: [], image: null, created_at: '2026-01-12T10:00:00Z' },
  { id: 35, nom: 'Après-Shampooing Démêlant', slug: 'apres-shampooing-demelant', marque: 'L\'Oréal Professionnel', categorie_id: 4, categorie: CATEGORIES[3], prix: 185, prix_effectif: 185, en_solde: false, en_vedette: false, en_stock: true, stock: 44, actif: true, note: 4.2, nb_avis: 66, description: 'Après-shampooing démêlant à la vitamine B5 et au panthénol. Cheveux soyeux et faciles à coiffer.', images: [], image: null, created_at: '2025-12-15T10:00:00Z' },
  { id: 36, nom: 'Brushing Spray Thermo-Protecteur', slug: 'brushing-spray-thermo-protecteur', marque: 'L\'Oréal Professionnel', categorie_id: 4, categorie: CATEGORIES[3], prix: 155, prix_effectif: 155, en_solde: false, en_vedette: false, en_stock: true, stock: 62, actif: true, note: 4.5, nb_avis: 92, description: 'Spray thermo-protecteur pour brushing. Protège jusqu\'à 230°C tout en apportant volume et brillance.', images: [], image: null, created_at: '2026-01-03T10:00:00Z' },
  { id: 37, nom: 'Lait Solaire Après-Soleil', slug: 'lait-solaire-apres-soleil', marque: 'Avène', categorie_id: 5, categorie: CATEGORIES[4], prix: 195, prix_effectif: 165, prix_promo: 165, en_solde: true, remise: 15, en_vedette: false, en_stock: true, stock: 35, actif: true, note: 4.5, nb_avis: 78, description: 'Lait après-soleil apaisant à l\'eau thermale. Hydrate et prolonge le bronzage tout en calmant les picotements.', images: [], image: null, created_at: '2025-12-22T10:00:00Z' },
  { id: 38, nom: 'Stick Solaire Visage SPF50', slug: 'stick-solaire-visage-spf50', marque: 'Mustela', categorie_id: 5, categorie: CATEGORIES[4], prix: 168, prix_effectif: 168, en_solde: false, en_vedette: false, en_stock: true, stock: 30, actif: true, note: 4.3, nb_avis: 47, description: 'Stick solaire visage SPF50+ format poche. Application facile et précise pour les zones sensibles.', images: [], image: null, created_at: '2025-12-10T10:00:00Z' },
  { id: 39, nom: 'Brosse à Dents Électrique Sonic', slug: 'brosse-dents-electrique-sonic', marque: "Omar & Karima's", categorie_id: 6, categorie: CATEGORIES[5], prix: 450, prix_effectif: 380, prix_promo: 380, en_solde: true, remise: 16, en_vedette: true, en_stock: true, stock: 14, actif: true, note: 4.7, nb_avis: 92, description: 'Brosse à dents électrique sonique 5 modes. Technologie à 32 000 vibrations/min pour un nettoyage en profondeur.', images: [], image: null, created_at: '2026-01-06T10:00:00Z' },
  { id: 40, nom: 'Dentifrice Blanchissant Charbon', slug: 'dentifrice-blanchissant-charbon', marque: "Omar & Karima's", categorie_id: 6, categorie: CATEGORIES[5], prix: 85, prix_effectif: 85, en_solde: false, en_vedette: false, en_stock: true, stock: 180, actif: true, note: 4.0, nb_avis: 215, description: 'Dentifrice au charbon végétal actif et à la menthe fraîche. Blanchit les dents naturellement sans les agresser.', images: [], image: null, created_at: '2025-12-05T10:00:00Z' },
  { id: 41, nom: 'Mousse Nettoyante Visage', slug: 'mousse-nettoyante-visage', marque: 'Uriage', categorie_id: 6, categorie: CATEGORIES[5], prix: 155, prix_effectif: 140, prix_promo: 140, en_solde: true, remise: 10, en_vedette: false, en_stock: true, stock: 58, actif: true, note: 4.4, nb_avis: 77, description: 'Mousse nettoyante hydratante à l\'eau thermale. Nettoie en douceur sans dessécher la peau. Format 150ml.', images: [], image: null, created_at: '2026-01-01T10:00:00Z' },
  { id: 42, nom: 'Spiruline Bio Pure 500mg', slug: 'spiruline-bio-pure-500mg', marque: 'Arkopharma', categorie_id: 7, categorie: CATEGORIES[6], prix: 195, prix_effectif: 176, prix_promo: 176, en_solde: true, remise: 10, en_vedette: true, en_stock: true, stock: 85, actif: true, note: 4.4, nb_avis: 189, description: 'Spiruline bio pure française 500mg. Riche en fer, protéines et antioxydants naturels. 200 comprimés.', images: [], image: null, created_at: '2026-01-09T10:00:00Z' },
  { id: 43, nom: 'Mélatonine Action Rapide', slug: 'melatonine-action-rapide', marque: 'Forté Pharma', categorie_id: 7, categorie: CATEGORIES[6], prix: 135, prix_effectif: 135, en_solde: false, en_vedette: false, en_stock: true, stock: 100, actif: true, note: 4.5, nb_avis: 234, description: 'Mélatonine en comprimés orodispersibles 1mg. Aide à s\'endormir rapidement et à réguler le cycle du sommeil.', images: [], image: null, created_at: '2025-12-28T10:00:00Z' },
  { id: 44, nom: 'Charbon Végétal Actif Digestion', slug: 'charbon-vegetal-actif-digestion', marque: 'Pileje', categorie_id: 7, categorie: CATEGORIES[6], prix: 115, prix_effectif: 115, en_solde: false, en_vedette: false, en_stock: true, stock: 130, actif: true, note: 4.2, nb_avis: 156, description: 'Charbon végétal actif micronisé pour faciliter la digestion et réduire les ballonnements. 60 gélules.', images: [], image: null, created_at: '2025-12-20T10:00:00Z' },
  { id: 45, nom: 'Thermomètre Infrarouge', slug: 'thermometre-infrarouge', marque: "Omar & Karima's", categorie_id: 8, categorie: CATEGORIES[7], prix: 275, prix_effectif: 275, en_solde: false, en_vedette: false, en_stock: true, stock: 10, actif: true, note: 4.6, nb_avis: 145, description: 'Thermomètre infrarouge sans contact. Mesure précise en 1 seconde. Pour toute la famille, du nouveau-né à l\'adulte.', images: [], image: null, created_at: '2025-12-15T10:00:00Z' },
  { id: 46, nom: 'Masques Chirurgicaux Lot 50', slug: 'masques-chirurgicaux-lot-50', marque: "Omar & Karima's", categorie_id: 8, categorie: CATEGORIES[7], prix: 65, prix_effectif: 65, en_solde: false, en_vedette: false, en_stock: true, stock: 500, actif: true, note: 4.1, nb_avis: 678, description: 'Masques chirurgicaux type IIR, lot de 50. Certification CE, 3 couches de protection. Fabriqué en France.', images: [], image: null, created_at: '2025-12-10T10:00:00Z' },
  { id: 47, nom: 'Multi-Vitamines Enfants Gommes', slug: 'multi-vitamines-enfants-gommes', marque: 'Arkopharma', categorie_id: 7, categorie: CATEGORIES[6], prix: 145, prix_effectif: 145, en_solde: false, en_vedette: true, en_stock: true, stock: 75, actif: true, note: 4.7, nb_avis: 312, description: 'Gommes multivitaminées aux fruits pour enfants dès 4 ans. Vitamines A, C, D, E, B6, B12. Sans sucre ajouté.', images: [], image: null, created_at: '2026-01-15T10:00:00Z' },
  { id: 48, nom: 'Bande de Contention Élastique', slug: 'bande-contention-elastique', marque: "Omar & Karima's", categorie_id: 8, categorie: CATEGORIES[7], prix: 38, prix_effectif: 38, en_solde: false, en_vedette: false, en_stock: true, stock: 250, actif: true, note: 4.0, nb_avis: 28, description: 'Bande de contention élastique 4m x 10cm. Maintien et compression pour entorses et oedèmes. Lavable et réutilisable.', images: [], image: null, created_at: '2025-12-22T10:00:00Z' },
]

const AVIS = [
  { id: 1, produit_id: 1, user: 'Fatima B.', note: 5, commentaire: "Excellent sérum ! Ma peau est beaucoup plus hydratée et lumineuse après 2 semaines d'utilisation.", date: '2026-01-10' },
  { id: 2, produit_id: 1, user: 'Samira E.', note: 4, commentaire: "Très bon produit, texture agréable. Juste un peu cher mais ça en vaut la peine.", date: '2026-01-05' },
  { id: 3, produit_id: 2, user: 'Nadia R.', note: 5, commentaire: "La meilleure crème pour ma peau sèche ! Enfin une qui hydrate vraiment toute la journée.", date: '2026-01-08' },
  { id: 4, produit_id: 5, user: 'Youssef A.', note: 5, commentaire: "Boost d'énergie garanti ! Je prends ça tous les matins et je me sens mieux.", date: '2026-01-12' },
  { id: 5, produit_id: 7, user: 'Karim H.', note: 4, commentaire: "Bon rapport qualité-prix. Le magnésium m'aide pour mes crampes nocturnes.", date: '2025-12-28' },
  { id: 6, produit_id: 9, user: 'Amira L.', note: 5, commentaire: "Ma bébé a la peau tellement douce depuis que j'utilise ce lait. Je recommande !", date: '2026-01-06' },
  { id: 7, produit_id: 13, user: 'Leila T.', note: 5, commentaire: "Mes cheveux sont transformés ! Ce masque est incroyable, je ne peux plus m'en passer.", date: '2026-01-14' },
  { id: 8, produit_id: 16, user: 'Mounia D.', note: 4, commentaire: "Très bonne protection solaire, ne colle pas et ne laisse pas de film blanc.", date: '2025-12-20' },
  { id: 9, produit_id: 22, user: 'Sanae K.', note: 5, commentaire: "Je prends ce collagène depuis 3 mois et mes ongles sont beaucoup plus forts. Super produit !", date: '2026-01-11' },
  { id: 10, produit_id: 28, user: 'Dr. Amrani', note: 5, commentaire: "Je recommande ces probiotiques à mes patients. Excellente qualité et résultats visibles.", date: '2026-01-15' },
  { id: 11, produit_id: 31, user: 'Hajar F.', note: 5, commentaire: "Les meilleures lingettes pour bébé ! 99% d'eau, rien de mieux pour sa peau sensible.", date: '2026-01-13' },
  { id: 12, produit_id: 39, user: 'Omar H.', note: 4, commentaire: "Super brosse à dents, les dents sont vraiment plus propres qu'avec une brosse manuelle.", date: '2026-01-09' },
  { id: 13, produit_id: 46, user: 'Rachid M.', note: 5, commentaire: "Lot très pratique pour toute la famille. Bon rapport qualité-prix.", date: '2026-01-02' },
  { id: 14, produit_id: 28, user: 'Latifa A.', note: 4, commentaire: "Ma digestion s'est nettement améliorée. Je recommande les probiotiques Pileje.", date: '2025-12-30' },
  { id: 15, produit_id: 42, user: 'Imane Z.', note: 5, commentaire: "La spiruline Arkopharma est la meilleure ! Pleine d'énergie depuis que j'en prends.", date: '2026-01-14' },
]

const BRANDS = [
  { nom: 'La Roche-Posay', logo: 'https://www.google.com/s2/favicons?domain=laroche-posay.com&sz=64', couleur: 'bg-blue-100', produits: 2 },
  { nom: 'Avène', logo: 'https://www.google.com/s2/favicons?domain=avene.com&sz=64', couleur: 'bg-green-100', produits: 5 },
  { nom: 'Bioderma', logo: 'https://www.google.com/s2/favicons?domain=bioderma.com&sz=64', couleur: 'bg-pink-100', produits: 0 },
  { nom: 'Vichy', logo: 'https://www.google.com/s2/favicons?domain=vichy.com&sz=64', couleur: 'bg-purple-100', produits: 4 },
  { nom: 'Eucerin', logo: 'https://www.google.com/s2/favicons?domain=eucerin.com&sz=64', couleur: 'bg-teal-100', produits: 0 },
  { nom: 'CeraVe', logo: 'https://www.google.com/s2/favicons?domain=cerave.com&sz=64', couleur: 'bg-amber-100', produits: 0 },
  { nom: 'Mustela', logo: 'https://www.google.com/s2/favicons?domain=mustela.com&sz=64', couleur: 'bg-indigo-100', produits: 5 },
  { nom: 'Arkopharma', logo: 'https://www.google.com/s2/favicons?domain=arkopharma.com&sz=64', couleur: 'bg-orange-100', produits: 5 },
  { nom: 'Nuxe', logo: 'https://www.google.com/s2/favicons?domain=nuxe.com&sz=64', couleur: 'bg-cyan-100', produits: 0 },
  { nom: 'Ducray', logo: 'https://www.google.com/s2/favicons?domain=ducray.com&sz=64', couleur: 'bg-red-100', produits: 0 },
]

const COMMANDES = [
  { id: 1, numero: 'CMD-202512-0001', user_id: 2, user: { id: 2, nom: 'Fatima Benali', email: 'fatima@test.ma', telephone: '+212 6XX-XXXXXX' }, statut: 'livree', total: 430, sous_total: 400, frais_livraison: 30, adresse_livraison: '12 Rue Ibn Sina', ville: 'Casablanca', code_postal: '20000', paiement: 'livraison', notes: '', created_at: '2025-12-05T14:30:00Z' },
  { id: 2, numero: 'CMD-202512-0002', user_id: 2, user: { id: 2, nom: 'Fatima Benali', email: 'fatima@test.ma', telephone: '+212 6XX-XXXXXX' }, statut: 'expediee', total: 585, sous_total: 585, frais_livraison: 0, adresse_livraison: '12 Rue Ibn Sina', ville: 'Casablanca', code_postal: '20000', paiement: 'carte', notes: 'Appeler avant livraison', created_at: '2025-12-12T10:15:00Z' },
  { id: 3, numero: 'CMD-202512-0003', user_id: 2, user: { id: 2, nom: 'Fatima Benali', email: 'fatima@test.ma', telephone: '+212 6XX-XXXXXX' }, statut: 'confirmee', total: 260, sous_total: 260, frais_livraison: 0, adresse_livraison: '12 Rue Ibn Sina', ville: 'Casablanca', code_postal: '20000', paiement: 'livraison', notes: '', created_at: '2025-12-18T16:45:00Z' },
  { id: 4, numero: 'CMD-202512-0004', user_id: 1, user: { id: 1, nom: "Admin Omar & Karima's", email: 'admin@parapharmacie.ma', telephone: '+212 5XX-XXXXXX' }, statut: 'en_attente', total: 450, sous_total: 420, frais_livraison: 30, adresse_livraison: 'Av. Mohammed V', ville: 'Rabat', code_postal: '10000', paiement: 'livraison', notes: 'Livrer entre 14h et 17h', created_at: '2025-12-20T09:00:00Z' },
  { id: 5, numero: 'CMD-202512-0005', user_id: 3, user: { id: 3, nom: 'Youssef El Amrani', email: 'youssef@test.ma', telephone: '+212 7XX-XXXXXX' }, statut: 'annulee', total: 195, sous_total: 195, frais_livraison: 0, adresse_livraison: '23 Rue des Orangers', ville: 'Marrakech', code_postal: '40000', paiement: 'carte', notes: '', created_at: '2025-12-15T11:20:00Z' },
  { id: 6, numero: 'CMD-202601-0006', user_id: 2, user: { id: 2, nom: 'Fatima Benali', email: 'fatima@test.ma', telephone: '+212 6XX-XXXXXX' }, statut: 'en_attente', total: 620, sous_total: 620, frais_livraison: 0, adresse_livraison: '12 Rue Ibn Sina', ville: 'Casablanca', code_postal: '20000', paiement: 'livraison', notes: '', created_at: '2026-01-10T09:30:00Z' },
  { id: 7, numero: 'CMD-202601-0007', user_id: 4, user: { id: 4, nom: 'Salma El Idrissi', email: 'salma@test.ma', telephone: '+212 6XX-XXXXXX' }, statut: 'confirmee', total: 330, sous_total: 300, frais_livraison: 30, adresse_livraison: '7 Rue Hassan II', ville: 'Fès', code_postal: '30000', paiement: 'carte', notes: 'Code d\'accès: 1234', created_at: '2026-01-08T15:00:00Z' },
]

const UTILISATEURS = [
  { id: 1, nom: "Admin Omar & Karima's", email: 'admin@parapharmacie.ma', telephone: '+212 5XX-XXXXXX', role: 'admin', commandes_count: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 2, nom: 'Fatima Benali', email: 'fatima@test.ma', telephone: '+212 6XX-XXXXXX', role: 'client', commandes_count: 4, created_at: '2025-06-15T00:00:00Z' },
  { id: 3, nom: 'Youssef El Amrani', email: 'youssef@test.ma', telephone: '+212 7XX-XXXXXX', role: 'client', commandes_count: 1, created_at: '2025-09-20T00:00:00Z' },
  { id: 4, nom: 'Salma El Idrissi', email: 'salma@test.ma', telephone: '+212 6XX-XXXXXX', role: 'client', commandes_count: 1, created_at: '2025-11-01T00:00:00Z' },
  { id: 5, nom: 'Omar Haddad', email: 'omar@test.ma', telephone: '+212 6XX-XXXXXX', role: 'client', commandes_count: 5, created_at: '2025-03-10T00:00:00Z' },
  { id: 6, nom: 'Nadia Rafik', email: 'nadia@test.ma', telephone: '+212 7XX-XXXXXX', role: 'client', commandes_count: 2, created_at: '2025-10-10T00:00:00Z' },
]

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

const STORAGE_KEY = 'parapharmacy_data'

function sauvegarder() {
  try {
    const raw = JSON.stringify({ produits: PRODUITS, commandes: COMMANDES, categories: CATEGORIES })
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
  } catch (e) { /* ignore */ }
}
charger()

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
  return Promise.resolve({ data: { data: BRANDS } })
}

export function getAvisRecents() {
  return Promise.resolve({ data: { data: AVIS.slice(-6).reverse() } })
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
  const commande = {
    id, numero,
    user_id: 1,
    user: { id: 1, nom: "Admin Omar & Karima's", email: 'admin@parapharmacie.ma', telephone: '+212 5XX-XXXXXX' },
    statut: 'en_attente',
    total: total + frais,
    sous_total: total,
    frais_livraison: frais,
    adresse_livraison: payload.adresse_livraison || 'Casablanca',
    ville: payload.ville || 'Casablanca',
    code_postal: payload.code_postal || '',
    paiement: payload.paiement || 'livraison',
    notes: payload.notes || '',
    created_at: now,
  }
  COMMANDES.unshift(commande)
  return Promise.resolve({ data: { data: { commande, numero } } })
}

export function getMesCommandes() {
  return Promise.resolve({ data: { data: COMMANDES } })
}

export function getDetailCommande(id) {
  const cmd = COMMANDES.find(c => c.id === id) || null
  return Promise.resolve({ data: { data: cmd } })
}

export function annulerCommande(id) {
  const cmd = COMMANDES.find(c => c.id === id)
  if (cmd) cmd.statut = 'annulee'
  return Promise.resolve({ data: { data: cmd } })
}

const TOKENS = {}
let currentUser = null

export function connexion(credentials) {
  const user = UTILISATEURS.find(u => u.email === credentials.email)
  if (!user && credentials.password?.length >= 3) {
    const fakeUser = { id: 99, nom: credentials.email?.split('@')[0] || 'Utilisateur', email: credentials.email, telephone: '', role: 'client', commandes_count: 0, created_at: new Date().toISOString() }
    const token = 'mock-token-' + Date.now()
    TOKENS[token] = fakeUser
    currentUser = fakeUser
    return Promise.resolve({ data: { data: { user: fakeUser, token } } })
  }
  if (user) {
    const token = 'mock-token-' + Date.now()
    TOKENS[token] = user
    currentUser = user
    return Promise.resolve({ data: { data: { user, token } } })
  }
  return Promise.reject({ response: { data: { message: 'Identifiants incorrects.' }, status: 401 } })
}

export function inscription(data) {
  const newUser = { id: UTILISATEURS.length + 10, nom: data.nom, email: data.email, telephone: data.telephone || '', role: 'client', commandes_count: 0, created_at: new Date().toISOString() }
  UTILISATEURS.push(newUser)
  const token = 'mock-token-' + Date.now()
  TOKENS[token] = newUser
  currentUser = newUser
  return Promise.resolve({ data: { data: { user: newUser, token } } })
}

export function deconnexion() {
  currentUser = null
  return Promise.resolve({ data: { data: null } })
}

export function getMoi() {
  return Promise.resolve({ data: { data: currentUser || UTILISATEURS[0] } })
}

export function getAdminTableau() {
  return Promise.resolve({
    data: {
      data: {
        chiffre_affaires: 24750,
        total_commandes: COMMANDES.length,
        total_produits: PRODUITS.length,
        total_clients: UTILISATEURS.length,
        note_moyenne: 4.4,
        commandes_recentes: COMMANDES.slice(0, 8),
        produits_stock_bas: PRODUITS.filter(p => p.stock <= 20).slice(0, 5),
      }
    }
  })
}

export function getAdminProduits(params) {
  const result = filterProducts({ ...(params || {}), par_page: 999 })
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
    const fallback = 'https://loremflickr.com/400/400/product?lock=' + Date.now()
    return { images: [fallback], image: fallback }
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
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return Promise.resolve({ data: { data: result } })
}

export function updateStatutCommande(id, statut) {
  const cmd = COMMANDES.find(c => c.id === id)
  if (cmd) cmd.statut = statut
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

export function getAdminUtilisateurs() {
  return Promise.resolve({ data: { data: UTILISATEURS } })
}

export function getAdminStatsRecentes() {
  const ventesParJour = Array.from({ length: 7 }, (_, i) => ({
    jour: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
    ventes: Math.floor(Math.random() * 5000) + 1000,
    commandes: Math.floor(Math.random() * 20) + 5,
  }))
  return Promise.resolve({ data: { data: ventesParJour } })
}
