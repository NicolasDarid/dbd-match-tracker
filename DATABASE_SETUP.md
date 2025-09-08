# 🗄️ Configuration de la Base de Données - DBD Match Tracker

## 🎯 **Option 1 : Neon (Recommandé) - PostgreSQL gratuit**

### **Étape 1 : Créer un compte Neon**

1. **Aller sur [neon.tech](https://neon.tech)**
2. **Cliquer "Sign Up"** (gratuit)
3. **Se connecter avec GitHub**

### **Étape 2 : Créer une base de données**

1. **Cliquer "Create Project"**
2. **Nom du projet** : `dbd-match-tracker`
3. **Région** : Choisir la plus proche (Europe)
4. **Cliquer "Create Project"**

### **Étape 3 : Récupérer l'URL de connexion**

1. **Dans le dashboard Neon** → **Connection Details**
2. **Copier l'URL de connexion** (format : `postgresql://username:password@host:port/database`)

---

## 🎯 **Option 2 : Supabase - PostgreSQL gratuit**

### **Étape 1 : Créer un compte Supabase**

1. **Aller sur [supabase.com](https://supabase.com)**
2. **Cliquer "Start your project"** (gratuit)
3. **Se connecter avec GitHub**

### **Étape 2 : Créer un projet**

1. **Cliquer "New Project"**
2. **Nom du projet** : `dbd-match-tracker`
3. **Mot de passe** : Générer un mot de passe sécurisé
4. **Région** : Choisir la plus proche
5. **Cliquer "Create new project"**

### **Étape 3 : Récupérer l'URL de connexion**

1. **Dans le dashboard Supabase** → **Settings** → **Database**
2. **Copier l'URL de connexion** (format : `postgresql://postgres:password@host:port/postgres`)

---

## 🎯 **Option 3 : Vercel Postgres (Intégré)**

### **Étape 1 : Dans Vercel Dashboard**

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Créer un nouveau projet** (si pas encore fait)
3. **Aller dans Storage** → **Create Database**
4. **Sélectionner "Postgres"**
5. **Choisir la région** et **cliquer "Create"**

### **Étape 2 : Connecter à votre projet**

1. **Cliquer "Connect"** sur la base créée
2. **Sélectionner votre projet** `dbd-match-tracker`
3. **Les variables d'environnement** sont ajoutées automatiquement

---

## 🔧 **Configuration Prisma (pour toutes les options)**

### **Étape 1 : Générer le client Prisma**

```bash
npx prisma generate
```

### **Étape 2 : Appliquer les migrations**

```bash
# Pour la première fois
npx prisma migrate deploy

# Ou pour créer une nouvelle migration
npx prisma migrate dev --name init
```

### **Étape 3 : Peupler la base de données (optionnel)**

```bash
npx prisma db seed
```

---

## 🌐 **Configuration pour Vercel**

### **Étape 1 : Variables d'environnement**

Dans Vercel Dashboard → Settings → Environment Variables :

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### **Étape 2 : Script de build**

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### **Étape 3 : Configuration Vercel**

Créer `vercel.json` :

```json
{
  "buildCommand": "pnpm run build:no-lint",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## ✅ **Vérification de la Configuration**

### **Test local**

```bash
# Vérifier la connexion
npx prisma db pull

# Voir les données
npx prisma studio
```

### **Test en production**

1. **Déployer sur Vercel**
2. **Vérifier les logs** dans Vercel Dashboard
3. **Tester l'inscription** d'un utilisateur
4. **Vérifier que les données** sont sauvegardées

---

## 🚨 **Dépannage Courant**

### **Erreur de connexion**

- ✅ Vérifier `DATABASE_URL`
- ✅ Vérifier que la base est accessible
- ✅ Vérifier les credentials

### **Erreur de migration**

```bash
# Réinitialiser les migrations
npx prisma migrate reset
npx prisma migrate dev --name init
```

### **Erreur de génération**

```bash
# Régénérer le client
npx prisma generate
```

---

## 📊 **Comparaison des Options**

| Service             | Gratuit  | PostgreSQL | Intégration Vercel | Interface Web |
| ------------------- | -------- | ---------- | ------------------ | ------------- |
| **Neon**            | ✅ 3GB   | ✅         | ✅                 | ✅            |
| **Supabase**        | ✅ 500MB | ✅         | ✅                 | ✅            |
| **Vercel Postgres** | ✅ 1GB   | ✅         | ✅                 | ❌            |

---

## 🎯 **Recommandation**

**Pour votre projet DBD Match Tracker, je recommande :**

1. **Neon** (si vous voulez une interface web)
2. **Vercel Postgres** (si vous voulez la simplicité)
3. **Supabase** (si vous voulez des fonctionnalités avancées)

**Toutes ces options sont gratuites et compatibles avec votre configuration Prisma !** 🚀
