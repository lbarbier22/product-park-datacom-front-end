# Product Park Datacom - Front-End

Bienvenue dans le dépôt du front-end de l'application **Product Park Datacom**.

Cette application est une **SPA (Single Page Application)** développée avec **Vue 3**, permettant aux utilisateurs de gérer un catalogue de produits avec un workflow complet de création, modification par étapes, validation et rejet.

Le front-end communique avec une API REST Spring Boot via Axios et utilise une authentification JWT avec gestion des rôles **ADMIN** et **VALIDATOR**.

---

# Stack Technique & Technologies

| Composant | Choix |
|---|---|
| Framework | Vue.js 3 |
| Build Tool | Vite |
| Langage | JavaScript |
| Gestion d'état | Pinia |
| Routing | Vue Router |
| Client HTTP | Axios |
| Authentification | JWT (Bearer Token) |
| Décodage JWT côté client | jwt-decode |
| CSS | CSS scoped + fichiers dédiés |
| Backend consommé | Spring Boot REST API |
| Base de données | PostgreSQL (via API uniquement) |

---

# Fonctionnalités principales

## 1. Authentification & sécurité

L'application utilise une authentification JWT fournie par le backend.

Fonctionnement :

- L'utilisateur se connecte via `/login`.
- Le front appelle :

```

POST /api/auth/login

```

- Le token JWT retourné est :
  - stocké dans le store Pinia
  - sauvegardé dans `localStorage`
  - envoyé automatiquement dans les appels API suivants.

Header ajouté automatiquement :

```

Authorization: Bearer <token>

```

---

## Gestion des rôles

Deux rôles sont gérés :

### ADMIN

Permissions :

- Création de produits
- Modification des produits DRAFT ou REJECTED
- Reprise d'un produit refusé
- Soumission pour validation


### VALIDATOR

Permissions :

- Consultation des produits
- Validation d'un produit PENDING
- Refus d'un produit avec motif obligatoire

---

# Architecture du projet

Organisation principale :

```

src/
│
├── assets/
│
├── components/
│   ├── AppHeader.vue
│   ├── StepIndicator.vue
│   ├── RejectionBanner.vue
│   ├── ProductStep1.vue
│   ├── ProductStep2.vue
│   ├── ProductStep3.vue
│   ├── ProductStep4.vue
│   └── composants réutilisables
│
├── views/
│   ├── LoginView.vue
│   ├── ProductListView.vue
│   ├── ProductFormView.vue
│   ├── ProductReviewView.vue
│   └── NotFoundView.vue
│
├── stores/
│   ├── auth.store.js
│   └── product.store.js
│
├── services/
│   └── api.js
│
├── router/
│   └── index.js
│
├── utils/
│   └── productFormValidation.js
│
├── styles/
│   ├── global.css
│   └── fichiers CSS par vue
│
├── App.vue
└── main.js

```

---

# Installation

## Prérequis

Nécessaire :

- Node.js 18+
- npm 9+
- Backend Product Park Datacom démarré

Le backend doit être disponible par défaut sur :

```

[http://localhost:8080](http://localhost:8080)

````

---

# Installation du projet

Cloner le dépôt :

```bash
git clone https://github.com/lbarbier22/product-park-datacom-front-end.git

cd product-park-datacom-front-end
````

Installer les dépendances :

```bash
npm install
```

---

# Configuration de l'API

Créer un fichier `.env` à la racine :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Cette variable est utilisée par Axios pour configurer l'URL de l'API.

---

# Démarrage du projet

Lancer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible par défaut :

```
http://localhost:5173
```

---

# Build production

Créer le bundle de production :

```bash
npm run build
```

Prévisualiser le build :

```bash
npm run preview
```

---

# Gestion des routes

Routes principales :

| Route                  | Description             | Accès             |
| ---------------------- | ----------------------- | ----------------- |
| `/login`               | Connexion utilisateur   | Public            |
| `/products`            | Liste des produits      | Connecté          |
| `/products/new`        | Création produit        | ADMIN             |
| `/products/:id/edit`   | Edition multi-step      | ADMIN             |
| `/products/:id/review` | Consultation / décision | ADMIN + VALIDATOR |

---

# Protection des routes

Le router possède un guard global :

* Vérification de présence d'un token JWT.
* Vérification du rôle utilisateur.

Exemple :

```javascript
meta: {
  requiresAuth: true,
  role: 'ADMIN'
}
```

Important :

> Le contrôle côté frontend est uniquement une protection UX.
> La vraie sécurité est assurée par Spring Security côté backend.

---

# Workflow produit

## Création d'un produit

Un ADMIN clique sur :

```
Nouveau produit
```

Le front appelle :

```
POST /api/products
```

Le backend crée un produit :

```
status = DRAFT
currentStep = 1
```

Puis redirection vers :

```
/products/{id}/edit
```

---

# Formulaire multi-steps

Le formulaire contient 4 étapes.

## Step 1 - Informations générales

Champs :

* Nom
* Référence
* Description

API :

```
PUT /api/products/{id}/step/1?next=true
```

---

## Step 2 - Classification

Champs :

* Catégorie
* Sous-catégorie
* Fabricant
* Pays

API :

```
PUT /api/products/{id}/step/2?next=true
```

---

## Step 3 - Conformité

Champs :

* Numéro de lot
* Certification
* Commentaire

API :

```
PUT /api/products/{id}/step/3?next=true
```

---

## Step 4 - Récapitulatif

Affichage en lecture seule.

Soumission :

```
PUT /api/products/{id}/step/4?next=true
```

Le produit passe alors :

```
DRAFT → PENDING
```

---

# Gestion des produits rejetés

Lorsqu'un VALIDATOR refuse un produit :

API :

```
POST /api/products/{id}/reject
```

avec :

```json
{
  "rejectionReason": "Motif du refus"
}
```

Le produit devient :

```
REJECTED
```

Lorsqu'un ADMIN reprend le produit :

* Le formulaire repart au step 1.
* Le motif du refus est affiché via `RejectionBanner`.
* Le workflow reprend jusqu'à la nouvelle soumission.

---

# Consultation et validation

Les VALIDATOR disposent d'une vue dédiée :

```
/products/{id}/review
```

Cette vue affiche :

* Informations produit
* Statut
* Actions possibles

Si le produit est :

```
PENDING
```

Deux actions sont disponibles :

### Validation

```
POST /api/products/{id}/validate
```

### Refus

```
POST /api/products/{id}/reject
```

avec un motif obligatoire de minimum 10 caractères.

---

# Gestion Axios

Une instance Axios globale est configurée dans :

```
src/services/api.js
```

Elle gère :

## Injection automatique du JWT

Chaque requête ajoute :

```
Authorization: Bearer token
```

## Gestion automatique des sessions expirées

Si l'API retourne :

```
401 Unauthorized
```

Alors :

* suppression du token
* logout utilisateur
* redirection vers `/login`

---

# Gestion des erreurs

L'application gère :

## Produit inexistant

Réponse :

```
404
```

Affichage :

```
Produit introuvable
```

## Erreurs serveur

Les messages retournés par l'API sont affichés directement à l'utilisateur.

---

# Comptes de démonstration

Selon la configuration backend :

## Administrateur

```
login :
admin

password :
admin123
```

## Validateur

```
login :
validator

password :
validator123
```

---

# Communication Front / Back

Architecture globale :

```
             HTTP / JSON

Vue 3 + Vite
      |
      |
   Axios
      |
      |
Spring Boot API
      |
      |
 PostgreSQL
```

Les deux applications sont séparées :

Frontend :

```
product-park-datacom-front-end
```

Backend :

```
product-park-datacom-back-end
```

---

# Tests

Tests recommandés :

* Login succès / erreur
* Validation des étapes du formulaire
* Affichage du bandeau de rejet
* Gestion des erreurs API
* Protection des routes

Outils possibles :

```
Vitest
Vue Test Utils
```

---

# Licence

Projet privé réservé à l'usage de **Product Park Datacom**.