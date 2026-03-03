# Assistant d’Orientation Académique (AI Nexus Competition)

Projet développé dans le cadre de la compétition **Nexus AI – EMSI Rabat** .

L’objectif est de créer un assistant académique intelligent qui aide les étudiants à identifier leurs difficultés et à obtenir des recommandations personnalisées (plan de travail, ressources, conseils).

---

# Technologies utilisées

Frontend

- React (Vite)
- TailwindCSS
- shadcn/ui

Backend

- Node.js
- Express.js

Base de données

- MongoDB

IA

- Google Gemini API

---

# Structure du projet

```
repo/

frontend/
  src/
    components/
    pages/
      admin/
      student/
      shared/
    api/
    routes/

backend/
  src/
    config/
    models/
    controllers/
    routes/
    services/
  server.js

.gitignore
README.md
```

---

# Installation

Cloner le projet :

```
git clone https://github.com/ElhaddajAya/projet-nexus-ai-assistant-academique.git
cd project
```

Installer les dépendances.

Frontend :

```
cd frontend
npm install
npm run dev
```

Backend :

```
cd backend
npm install
npm run dev
```

---

# Fonctionnalités MVP

Étudiant

- Remplir un questionnaire académique
- Recevoir des recommandations personnalisées
- Consulter les ressources suggérées

Administration EMSI

- Gestion des filières
- Gestion des modules
- Gestion des ressources académiques

---

# Équipe

Projet réalisé par une équipe de 4 étudiantes en 4ème année
Ingénierie Informatique et Réseaux – EMSI Rabat.
