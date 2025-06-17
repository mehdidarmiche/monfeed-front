# MonFeed – Plateforme de gestion des réseaux sociaux avec intelligence artificielle

MonFeed est une application web développée dans le cadre d’un stage de fin d’études. Elle permet de centraliser la gestion de publications sur plusieurs réseaux sociaux, tout en intégrant des fonctionnalités d’intelligence artificielle pour assister les utilisateurs dans la création et la planification de contenu.

## Fonctionnalités principales

- Authentification (inscription, connexion, réinitialisation du mot de passe)
- Connexion aux pages Facebook, Threads, LinkedIn
- Création de publications avec génération automatique de texte (légendes, hashtags, etc.)
- Ajout d’images dans les publications Facebook
- Aperçu des posts Facebook et Threads avec nom d’utilisateur et photo de profil
- Tableau de bord avec aperçu des publications et historique
- Planification de publications (fonctionnalité en cours)
- Intégration OpenAI pour :
  - Génération de contenu textuel
  - Réponses automatiques (à venir)
  - Analyse de performance et de sentiment (à venir)

## Stack technique

### Frontend

- Vue.js 3
- Tailwind CSS
- Axios
- JWT pour l’authentification
- API OpenAI pour les fonctionnalités IA

### Backend

- Strapi v5 avec TypeScript


## Limitations connues

- Instagram : non intégré (rôles et permissions restreints)
- LinkedIn : accès à un compte possible, mais la publication nécessite une validation "entreprise"
- Threads : publication uniquement via token généré manuellement (pas de génération dynamique possible en mode dev)
- Connexion Google/Facebook : non intégrée

## Installation locale

### 1. Cloner le dépôt

### 2. Lancer le backend

cd backend
npm install
npm develop


### 3. Lancer le frontend

cd front
npm install
npm run dev

## Auteurs
Mehdi Dermiche
Supervision technique et accompagnement
Contact : contact@monfeed.com

Hudayfa Koujdal
Stage de mars à juin 2025 chez MonFeed
Contact : hudayfa.k.pro@gmail.com