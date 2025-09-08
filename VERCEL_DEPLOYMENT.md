# 🚀 Guide de Déploiement Vercel - DBD Match Tracker

## 📋 **Prérequis**

- ✅ Compte Vercel (gratuit)
- ✅ Compte GitHub (pour le repository)
- ✅ Base de données PostgreSQL (Neon, Supabase, ou autre)
- ✅ Projet Firebase configuré

## 🔧 **Étape 1 : Préparation du Repository**

### 1.1. Pousser le code sur GitHub

```bash
# Si pas encore fait
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 1.2. Vérifier les fichiers importants

- ✅ `package.json` avec les scripts de build
- ✅ `next.config.ts` configuré
- ✅ `.env.example` ou documentation des variables

## 🌐 **Étape 2 : Configuration Vercel**

### 2.1. Connexion à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur "New Project"
4. Sélectionner votre repository `dbd-match-tracker`

### 2.2. Configuration du projet

- **Framework Preset** : Next.js (détecté automatiquement)
- **Root Directory** : `./` (par défaut)
- **Build Command** : `pnpm run build:no-lint`
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `pnpm install`

## 🔐 **Étape 3 : Variables d'Environnement**

### 3.1. Variables obligatoires

```env
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your_secret_key_here_minimum_32_characters"
BETTER_AUTH_URL="https://your-app.vercel.app"

# Vérification d'email (désactivée pour commencer)
REQUIRE_EMAIL_VERIFICATION="false"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_measurement_id"
```

### 3.2. Configuration dans Vercel

1. Dans le dashboard Vercel → Settings → Environment Variables
2. Ajouter chaque variable une par une
3. **Important** : Cocher "Production", "Preview", et "Development"

## 🗄️ **Étape 4 : Base de Données**

### 4.1. Options recommandées

- **Neon** (gratuit, PostgreSQL)
- **Supabase** (gratuit, PostgreSQL)
- **PlanetScale** (gratuit, MySQL)

### 4.2. Configuration de la base

```bash
# Après avoir créé la base de données
npx prisma migrate deploy
npx prisma db seed
```

## 🔥 **Étape 5 : Firebase**

### 5.1. Configuration Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Créer un projet ou utiliser un existant
3. Activer Storage
4. Configurer les règles de sécurité (voir `firebase-security-rules.md`)

### 5.2. Récupérer les clés

1. Project Settings → General → Your apps
2. Copier les valeurs de configuration

## 🚀 **Étape 6 : Déploiement**

### 6.1. Premier déploiement

1. Cliquer sur "Deploy" dans Vercel
2. Attendre la fin du build (2-3 minutes)
3. Vérifier que l'URL fonctionne

### 6.2. Configuration de la base de données

```bash
# Se connecter à votre base de données
npx prisma migrate deploy
npx prisma db seed
```

## ✅ **Étape 7 : Vérification**

### 7.1. Tests de base

- [ ] Page d'accueil se charge
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Ajout de match fonctionne
- [ ] Statistiques s'affichent

### 7.2. Tests de sécurité

- [ ] HTTPS activé
- [ ] Headers de sécurité présents
- [ ] Rate limiting fonctionne

## 🔧 **Étape 8 : Configuration Post-Déploiement**

### 8.1. Domaine personnalisé (optionnel)

1. Vercel Dashboard → Settings → Domains
2. Ajouter votre domaine
3. Configurer les DNS

### 8.2. Monitoring

- Vercel Analytics (gratuit)
- Vercel Speed Insights (gratuit)

## 🚨 **Dépannage Courant**

### Erreur de build

```bash
# Vérifier les logs dans Vercel Dashboard
# Vérifier que toutes les variables d'environnement sont définies
```

### Erreur de base de données

```bash
# Vérifier DATABASE_URL
# Vérifier que la base est accessible depuis Vercel
```

### Erreur Firebase

```bash
# Vérifier toutes les variables NEXT_PUBLIC_FIREBASE_*
# Vérifier les règles de sécurité Firebase
```

## 📊 **Étape 9 : Activation Progressive**

### 9.1. Phase 1 : Test sans vérification d'email

```env
REQUIRE_EMAIL_VERIFICATION="false"
```

### 9.2. Phase 2 : Activation de la vérification d'email

```env
REQUIRE_EMAIL_VERIFICATION="true"
# + Configuration SMTP complète
```

## 🎯 **Résumé des Étapes**

1. ✅ **Code sur GitHub**
2. ✅ **Projet Vercel créé**
3. ✅ **Variables d'environnement configurées**
4. ✅ **Base de données configurée**
5. ✅ **Firebase configuré**
6. ✅ **Premier déploiement**
7. ✅ **Tests de fonctionnement**
8. ✅ **Configuration post-déploiement**

## 🆘 **Support**

- **Vercel Docs** : [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs** : [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs** : [prisma.io/docs](https://prisma.io/docs)
