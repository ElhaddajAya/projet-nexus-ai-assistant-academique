# OrientAI — Assistant d'Orientation Académique

Projet développé dans le cadre de la compétition **AI Nexus – EMSI Rabat 2026**.

OrientAI est un assistant académique intelligent qui aide les étudiants de l'EMSI à identifier leurs difficultés, obtenir un plan de travail personnalisé généré par IA, accéder aux ressources pédagogiques adaptées, et poser des questions de suivi via un chat.

---

## Technologies utilisées

**Frontend**
- React 19 + Vite
- TailwindCSS v3
- React Router DOM

**Backend**
- Node.js + Express.js
- MongoDB Atlas (Mongoose)
- JWT (authentification)

**IA**
- Groq API — modèle Llama 3.3 70B

---

## Structure du projet

```
projet-nexus-ai/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   └── student/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   └── student/
│       └── api/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── services/
├── seed.js
├── seed_4a.js
└── README.md
```

---

## Prérequis

- Node.js v18+
- Un compte MongoDB Atlas (cluster gratuit suffisant)
- Une clé API Groq (gratuite sur [console.groq.com](https://console.groq.com))

---

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/ElhaddajAya/projet-nexus-ai-assistant-academique.git
cd projet-nexus-ai-assistant-academique
```

### 2. Configurer le backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine du dossier `backend/` :

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=votre_secret_jwt
GROQ_API_KEY=votre_cle_groq
```

Lancer le backend :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`.

### 3. Configurer le frontend

```bash
cd ../frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

---

## Population de la base de données

Avant la première utilisation, il faut insérer les données de démonstration (filières, modules, matières, ressources).

Depuis la racine du backend :

```bash
# Données 1ère et 2ème année IIR
node seed.js

# Données 4ème année IIR — Semestre 1
node seed_4a.js
```

Ces scripts créent automatiquement :
- 1 filière : **IIR** (Ingénierie Informatique et Réseaux)
- 17 modules répartis sur 1A S1, 1A S2, 2A S1, 2A S2, 4A S1
- 27 matières avec leurs difficultés configurées
- 188 ressources pédagogiques (cours, TDs, TPs, examens) avec liens Google Drive

---

## Créer un compte administrateur

L'application ne fournit pas d'interface de création admin. Pour créer un compte admin, envoyer une requête POST :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Admin","prenom":"EMSI","email":"admin@emsi.ma","password":"motdepasse","role":"admin"}'
```

Les étudiants peuvent s'inscrire directement depuis l'interface via `/register`.

---

## Fonctionnalités

**Espace étudiant**
- Inscription et connexion
- Questionnaire académique (filière, niveau, semestre, module, matière, difficultés, objectifs)
- Génération d'une analyse personnalisée par Groq AI (plan de travail 4 étapes, conseils, ressources recommandées, score de progression)
- Chat de suivi avec l'IA basé sur le profil et le plan généré
- Historique de toutes les analyses
- Bibliothèque de ressources avec filtres (type, matière)
- Page profil avec changement de mot de passe

**Espace administrateur**
- Dashboard avec statistiques (filières, modules, matières, ressources, soumissions récentes)
- Gestion complète des filières, modules, matières (avec difficultés configurables)
- Gestion des ressources (avec filtres type, niveau, matière)
- Historique de toutes les soumissions étudiants

---

## Équipe

Projet réalisé par une équipe de 4 étudiantes en 4ème année Ingénierie Informatique et Réseaux – EMSI Rabat.

| Nom | Module développé |
|-----|-----------------|
| Fatima | Authentification |
| Malak | Interface Administration |
| Imane | Ressources étudiants & Soumissions admin |
| Ayaa | Questionnaire, Résultats IA, Chat, Profil |
