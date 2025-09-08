#!/usr/bin/env node

/**
 * Script de configuration automatique pour Prisma et la base de données
 * DBD Match Tracker
 */

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function execCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'cyan');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} terminé avec succès!`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur lors de ${description}:`, 'red');
    log(error.message, 'red');
    return false;
  }
}

async function checkPrerequisites() {
  log('\n🔍 Vérification des prérequis...', 'blue');
  
  // Vérifier Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`✅ Node.js: ${nodeVersion}`, 'green');
  } catch {
    log('❌ Node.js n\'est pas installé', 'red');
    return false;
  }

  // Vérifier pnpm
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    log(`✅ pnpm: ${pnpmVersion}`, 'green');
  } catch {
    log('❌ pnpm n\'est pas installé. Installation...', 'yellow');
    execSync('npm install -g pnpm', { stdio: 'inherit' });
  }

  // Vérifier si .env existe
  if (!fs.existsSync('.env')) {
    log('⚠️  Fichier .env non trouvé', 'yellow');
    return false;
  }

  return true;
}

async function setupEnvironment() {
  log('\n🔧 Configuration de l\'environnement...', 'blue');
  
  if (!fs.existsSync('.env')) {
    log('📝 Création du fichier .env...', 'cyan');
    
    const envTemplate = `# Configuration de la base de données
# Remplacez cette URL par votre vraie URL de base de données
DATABASE_URL="postgresql://username:password@localhost:5432/dbd_match_tracker"

# Configuration Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Configuration Firebase (optionnel)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
`;

    fs.writeFileSync('.env', envTemplate);
    log('✅ Fichier .env créé!', 'green');
    
    log('\n⚠️  IMPORTANT: Vous devez configurer votre DATABASE_URL dans le fichier .env', 'yellow');
    log('📖 Consultez DATABASE_SETUP.md pour les options de base de données', 'cyan');
    
    const continueSetup = await question('\nVoulez-vous continuer avec la configuration Prisma? (y/N): ');
    if (continueSetup.toLowerCase() !== 'y') {
      log('Configuration interrompue. Configurez votre DATABASE_URL et relancez le script.', 'yellow');
      process.exit(0);
    }
  }
}

async function installDependencies() {
  log('\n📦 Installation des dépendances...', 'blue');
  return execCommand('pnpm install', 'Installation des dépendances');
}

async function generatePrismaClient() {
  log('\n🔧 Génération du client Prisma...', 'blue');
  return execCommand('npx prisma generate', 'Génération du client Prisma');
}

async function runMigrations() {
  log('\n🗄️  Application des migrations...', 'blue');
  
  const choice = await question('\nChoisissez une option:\n1. Migrations en développement (migrate dev)\n2. Migrations en production (migrate deploy)\n3. Passer cette étape\n\nVotre choix (1-3): ');
  
  switch (choice) {
    case '1':
      return execCommand('npx prisma migrate dev --name init', 'Migrations en développement');
    case '2':
      return execCommand('npx prisma migrate deploy', 'Migrations en production');
    case '3':
      log('⏭️  Étape des migrations ignorée', 'yellow');
      return true;
    default:
      log('❌ Choix invalide', 'red');
      return false;
  }
}

async function seedDatabase() {
  log('\n🌱 Peuplement de la base de données...', 'blue');
  
  const seedChoice = await question('\nVoulez-vous peupler la base de données avec les données de base? (y/N): ');
  
  if (seedChoice.toLowerCase() === 'y') {
    return execCommand('npx prisma db seed', 'Peuplement de la base de données');
  } else {
    log('⏭️  Peuplement de la base de données ignoré', 'yellow');
    return true;
  }
}

async function openPrismaStudio() {
  log('\n🎨 Ouverture de Prisma Studio...', 'blue');
  
  const studioChoice = await question('\nVoulez-vous ouvrir Prisma Studio pour visualiser votre base de données? (y/N): ');
  
  if (studioChoice.toLowerCase() === 'y') {
    log('🚀 Ouverture de Prisma Studio dans votre navigateur...', 'cyan');
    execCommand('npx prisma studio', 'Ouverture de Prisma Studio');
  } else {
    log('⏭️  Prisma Studio ignoré', 'yellow');
  }
}

async function main() {
  log('🚀 Configuration de Prisma et de la base de données pour DBD Match Tracker', 'bright');
  log('=' .repeat(70), 'cyan');
  
  try {
    // Vérifier les prérequis
    const prerequisitesOk = await checkPrerequisites();
    if (!prerequisitesOk) {
      log('\n❌ Prérequis non satisfaits. Veuillez les installer et relancer le script.', 'red');
      process.exit(1);
    }

    // Configuration de l'environnement
    await setupEnvironment();

    // Installation des dépendances
    const depsOk = await installDependencies();
    if (!depsOk) {
      log('\n❌ Échec de l\'installation des dépendances', 'red');
      process.exit(1);
    }

    // Génération du client Prisma
    const clientOk = await generatePrismaClient();
    if (!clientOk) {
      log('\n❌ Échec de la génération du client Prisma', 'red');
      process.exit(1);
    }

    // Application des migrations
    const migrationsOk = await runMigrations();
    if (!migrationsOk) {
      log('\n❌ Échec des migrations', 'red');
      process.exit(1);
    }

    // Peuplement de la base de données
    const seedOk = await seedDatabase();
    if (!seedOk) {
      log('\n❌ Échec du peuplement de la base de données', 'red');
      process.exit(1);
    }

    // Ouverture de Prisma Studio
    await openPrismaStudio();

    log('\n🎉 Configuration terminée avec succès!', 'green');
    log('=' .repeat(70), 'green');
    log('📖 Consultez DATABASE_SETUP.md pour plus d\'informations', 'cyan');
    log('🚀 Vous pouvez maintenant lancer votre application avec: pnpm dev', 'cyan');

  } catch (error) {
    log(`\n❌ Erreur inattendue: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Gestion des signaux pour une fermeture propre
process.on('SIGINT', () => {
  log('\n\n👋 Configuration interrompue par l\'utilisateur', 'yellow');
  rl.close();
  process.exit(0);
});

// Lancer le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
