# 🎮 DBD Match Tracker

> **Application web pour tracker vos matchs Dead by Daylight avec statistiques détaillées**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.10.1-2D3748)](https://prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.3.8-green)](https://better-auth.com/)

## 📖 **Qu'est-ce que DBD Match Tracker ?**

DBD Match Tracker est une application web moderne qui permet aux joueurs de **Dead by Daylight** de :

- 📊 **Tracker leurs matchs** (Killer et Survivor)
- 📈 **Analyser leurs statistiques** détaillées
- 🎯 **Suivre leurs performances** par personnage
- 🏆 **Comparer leurs résultats** au fil du temps
- 📱 **Accéder à leurs données** depuis n'importe où

### ✨ **Fonctionnalités principales**

- 🔐 **Authentification sécurisée** avec Better Auth
- 🎮 **Gestion des matchs** Killer et Survivor
- 📊 **Statistiques en temps réel** avec graphiques
- 🖼️ **Upload d'images** avec Firebase Storage
- 🎨 **Interface moderne** avec Tailwind CSS et shadcn/ui
- 📱 **Responsive design** pour mobile et desktop

## 🚀 **Démarrage rapide**

### **Prérequis**

- Node.js 18+
- pnpm (recommandé)
- Base de données PostgreSQL
- Compte Firebase

### **Installation**

```bash
# 1. Cloner le repository
git clone https://github.com/NicolasDarid/dbd-match-tracker.git
cd dbd-match-tracker

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Configurer la base de données
npx prisma migrate deploy
npx prisma db seed

# 5. Lancer en développement
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ⚙️ **Configuration**

### **Variables d'environnement**

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your_secret_key_here_minimum_32_characters"
BETTER_AUTH_URL="http://localhost:3000"

# Vérification d'email (optionnel)
REQUIRE_EMAIL_VERIFICATION="false"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_measurement_id"
```

### **Base de données**

L'application utilise **PostgreSQL** avec **Prisma ORM**. Choisissez votre fournisseur :

| Service             | Gratuit  | PostgreSQL | Interface Web | Recommandation    |
| ------------------- | -------- | ---------- | ------------- | ----------------- |
| **Neon**            | ✅ 3GB   | ✅         | ✅            | ⭐ **Recommandé** |
| **Supabase**        | ✅ 500MB | ✅         | ✅            | ✅ Bon choix      |
| **Vercel Postgres** | ✅ 1GB   | ✅         | ❌            | ✅ Simple         |

**Guide détaillé** : Voir [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### **Firebase**

Configurez Firebase pour le stockage d'images :

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activer **Storage**
3. Configurer les règles de sécurité (voir [firebase-security-rules.md](./firebase-security-rules.md))
4. Récupérer les clés de configuration

## 🏗️ **Architecture**

### **Stack technique**

- **Frontend** : Next.js 15.5.2 + React 19 + TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : Better Auth
- **Storage de vos images** : Firebase Storage (recommandé)
- **Déploiement** : Vercel

### **Structure du projet**

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   └── match/             # Pages de gestion des matchs
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI (shadcn/ui)
│   └── ...               # Composants métier
├── lib/                  # Utilitaires et configuration
│   ├── auth.ts          # Configuration Better Auth
│   ├── prisma.ts        # Client Prisma
│   └── ...              # Autres utilitaires
└── types/               # Types TypeScript
```

### **Base de données**

Le schéma Prisma inclut :

- 👤 **Utilisateurs** et authentification
- 🎮 **Matchs Killer** et **Survivor**
- 🗺️ **Cartes** et **personnages**
- 🎯 **Perks**, **Add-ons** et **Offerings**
- 📊 **Historique des matchs**

## 🚀 **Déploiement**

### **Déploiement sur Vercel (Recommandé)**

1. **Pousser le code sur GitHub**
2. **Connecter à Vercel** : [vercel.com](https://vercel.com)
3. **Configurer les variables d'environnement**
4. **Déployer automatiquement**

**Guide détaillé** : Voir [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### **Scripts disponibles**

```bash
# Développement
pnpm dev                 # Serveur de développement
pnpm build              # Build de production
pnpm start              # Serveur de production

# Base de données
npx prisma studio       # Interface web Prisma
npx prisma migrate dev  # Créer une migration
npx prisma db seed      # Peupler la base

# Qualité de code
pnpm lint               # Vérification ESLint
pnpm run build:no-lint  # Build sans ESLint (production)
```

## 🔒 **Sécurité**

L'application implémente plusieurs mesures de sécurité :

- 🛡️ **Headers de sécurité** (CSP, HSTS, etc.)
- 🔐 **Authentification sécurisée** avec Better Auth
- 🚫 **Rate limiting** sur les API
- 🔒 **Validation des données** avec Zod
- 🛡️ **Middleware de sécurité** Next.js

**Guide détaillé** : Voir [scripts/security-check.js](./scripts/security-check.js)

## 📊 **Fonctionnalités détaillées**

### **Gestion des matchs**

- **Matchs Killer** : Kills, hooks, générateurs restants, score
- **Matchs Survivor** : Sauvetages, générateurs, score, objet utilisé
- **Métadonnées** : Carte, perks, add-ons, offerings, date

### **Statistiques**

- **Graphiques de performance** par personnage
- **Taux de victoire** global et par personnage
- **Évolution temporelle** des performances
- **Comparaisons** entre personnages

### **Interface utilisateur**

- **Design responsive** pour tous les écrans
- **Thème sombre/clair** (prévu)
- **Navigation intuitive** avec sidebar
- **Feedback visuel** avec animations

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 **Support**

- 📖 **Documentation** : Voir les fichiers `.md` dans le projet
- 🐛 **Bugs** : Ouvrir une issue sur GitHub
- 💡 **Suggestions** : Ouvrir une discussion

## 🙏 **Remerciements**

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://prisma.io/) - ORM moderne
- [Better Auth](https://better-auth.com/) - Authentification
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

**Développé avec ❤️ pour la communauté Dead by Daylight**
