# Backend Interventions — Node.js / Express / MySQL

## Installation

```bash
cd backend
npm install
```

## Configuration

Copiez `.env.example` vers `.env` et renseignez vos paramètres :

```bash
cp .env.example .env
```

## Base de données

Exécutez le script SQL pour créer les tables :

```bash
mysql -u root -p < schema.sql
```

## Démarrage

```bash
npm run dev    # développement (avec nodemon)
npm start      # production
```

Le serveur démarre sur `http://localhost:5000`.

## Endpoints API

| Méthode | URL | Rôle requis | Description |
|---------|-----|-------------|-------------|
| POST | `/api/auth/login` | — | Connexion |
| GET | `/api/users` | admin | Liste des utilisateurs |
| POST | `/api/users` | admin | Créer un utilisateur |
| DELETE | `/api/users/:id` | admin | Supprimer un utilisateur |
| GET | `/api/interventions` | tous | Liste des interventions |
| POST | `/api/interventions` | user, admin | Créer une intervention |
| PUT | `/api/interventions/:id` | admin | Modifier une intervention |
| DELETE | `/api/interventions/:id` | admin | Supprimer une intervention |

## Compte admin par défaut

- **Utilisateur** : admin
- **Mot de passe** : admin123
