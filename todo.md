# Plan d'intégration des Pharmacies de Garde

## 1. Préparation de la base de données (Supabase)
- [ ] Installer `@supabase/supabase-js`
- [ ] Configurer les variables d'environnement (`.env.local`)
- [ ] Créer le client Supabase dans `app/lib/supabase.ts`
- [ ] Créer la table `pharmacies_garde` via une migration ou SQL Editor

## 2. Extraction et Insertion des Données
- [ ] Extraire les données des images (Littoral, Ouémé, Plateau)
- [ ] Créer un script d'insertion (seed) pour ajouter toutes les pharmacies
- [ ] Vérifier l'insertion correcte des données dans le dashboard Supabase

## 3. Développement de l'API / Service de récupération
- [ ] Mettre à jour `app/lib/data.ts` pour utiliser Supabase au lieu des données statiques
- [ ] Créer des fonctions `getPharmaciesByRegion`, `getPharmaciesByStatus`, etc.

## 4. Intégration Frontend
- [ ] Mettre à jour la page principale pour afficher les pharmacies réelles
- [ ] Ajouter des filtres par Région et Quartier
- [ ] Ajouter une barre de recherche fonctionnelle

## 5. Polissage et Finalisation
- [ ] Gérer les états de chargement et d'erreur
- [ ] S'assurer que le design est "Wow" comme demandé dans les instructions système
