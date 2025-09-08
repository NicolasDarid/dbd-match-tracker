# Règles de Sécurité Firebase

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images des personnages, perks, etc. - lecture publique
    match /game-assets/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Images de profil utilisateur - accès restreint
    match /user-profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Images uploadées par les utilisateurs - accès restreint
    match /user-uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Autres utilisateurs peuvent lire
    }
  }
}
```

## Firestore Rules (si utilisé)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Données utilisateur - accès restreint
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Données publiques (si nécessaire)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Configuration des Domaines Autorisés

Dans la console Firebase :

1. Aller à Authentication > Settings > Authorized domains
2. Ajouter votre domaine de production
3. Supprimer les domaines de test si nécessaire

## Configuration CORS

```javascript
// Pour les requêtes depuis votre domaine
const cors = require("cors")({ origin: true });

// Dans vos fonctions Firebase
exports.uploadImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    // Votre logique ici
  });
});
```

## Tokens d'Authentification

```javascript
// Vérification des tokens côté serveur
const admin = require("firebase-admin");

async function verifyToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
```

## Limitation des Taux

```javascript
// Dans vos fonctions Firebase
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite à 100 requêtes par IP par fenêtre
});

exports.api = functions.https.onRequest(limiter);
```
