# koovea-taskManager

## 1. Présentation du projet

Application web de gestion de tâches fullstack développée dans le cadre d'un test technique pour **Koovea**.

Le backend est construit avec NestJS et MongoDB, le frontend avec React + Vite. Les utilisateurs peuvent s'authentifier, créer des tâches, les assigner à d'autres utilisateurs et les gérer selon leurs droits (propriétaire ou assigné).

---

## 2. Stack technique

**Backend**

- NestJS (Node.js)
- MongoDB Atlas + Mongoose
- JWT (authentification)
- bcrypt (hash des mots de passe)
- class-validator (validation des DTOs)

**Frontend**

- React 19 + TypeScript
- Vite
- MUI (Material UI)
- react-hook-form
- Jotai (state global)
- Axios

---

## 3. Prérequis

- Node.js 18+
- Un compte MongoDB Atlas (gratuit)
- npm

---

## 4. Installation et lancement

**Backend**

```bash
cd server
npm install
# Copier .env.example en .env et remplir les variables
cp .env.example .env
npm run start:dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

**Variables d'environnement backend (`.env`)**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=votre_secret_jwt
PORT=3000
```

---

## 5. Lancer avec Docker

Prérequis : Docker Desktop installé et lancé.

```bash
# À la racine du projet
docker-compose up --build
```

Le serveur sera accessible sur http://localhost:3000.

Pour arrêter :

```bash
docker-compose down
```

### Ce qui est dockerisé

Seul le serveur NestJS est dockerisé, conformément aux spécifications du sujet. Le frontend se lance toujours avec `npm run dev`.

En production, le frontend pourrait être dockerisé via un build multi-stage : Node pour compiler avec Vite, puis Nginx pour servir les fichiers statiques générés. Les variables d'environnement Vite devant être intégrées au moment du build (pas au runtime), cela nécessiterait des build args Docker.

---

## 6. Architecture backend

Le projet suit l'architecture modulaire de NestJS, organisée en 3 modules : **Auth**, **Users** et **Tasks**. Chaque module encapsule son Controller, son Service, ses DTOs et ses Schemas Mongoose.

Les règles d'autorisation sont gérées par des Guards personnalisés :

- **JwtAuthGuard** : vérifie qu'un token JWT valide est présent sur toutes les routes protégées.
- **TaskAccessGuard** : vérifie que l'utilisateur est owner ou assignee de la tâche (`GET /:id`, `PATCH`).
- **TaskOwnerGuard** : vérifie que l'utilisateur est owner de la tâche (`DELETE`).

---

## 7. Endpoints API

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Inscription |
| POST | `/auth/login` | ❌ | Connexion, retourne un JWT |
| GET | `/auth/me` | ✅ JWT | Retourne le user connecté |
| GET | `/users` | ✅ JWT | Liste tous les utilisateurs |
| GET | `/tasks` | ✅ JWT | Liste les tâches de l'utilisateur |
| GET | `/tasks/:id` | ✅ JWT + TaskAccessGuard | Détail d'une tâche |
| POST | `/tasks` | ✅ JWT | Créer une tâche |
| PATCH | `/tasks/:id` | ✅ JWT + TaskAccessGuard | Modifier une tâche |
| DELETE | `/tasks/:id` | ✅ JWT + TaskOwnerGuard | Supprimer une tâche (owner only) |

---

## 8. Choix techniques

- **MongoDB Atlas** : base de données cloud, pas d'installation locale requise. Le free tier est suffisant pour ce projet.
- **JWT en localStorage** : choix pragmatique pour ce test technique. En production, un cookie `httpOnly` serait préférable pour se protéger contre les attaques XSS.
- **Guards séparés** : les règles d'autorisation sont isolées dans des Guards dédiés plutôt que dans les Services, pour respecter le principe de responsabilité unique (SRP). Un Guard répond à « as-tu le droit ? », un Service répond à « comment je le fais ? ».
- **Jotai** : state management minimaliste pour l'état d'authentification global. Pas de boilerplate contrairement à Redux, plus simple que Context pour ce cas d'usage.
- **react-hook-form** : gestion des formulaires sans re-render à chaque frappe, avec validation intégrée.
- **PATCH plutôt que PUT** : les modifications de tâches sont partielles — l'utilisateur ne modifie pas forcément tous les champs en même temps.

---

## 9. Ce qui pourrait être amélioré

- Tests unitaires sur les Services et Guards (logique métier et règles d'autorisation)
- Validation des variables d'environnement au démarrage avec un schema class-validator
- Refresh token pour renouveler le JWT sans re-authentification
- Pagination sur `GET /tasks` pour les grandes listes
- Déploiement AWS (bonus non implémenté)

---

## 10. Auteur

Timothée Baudequin — 25/05/2026
