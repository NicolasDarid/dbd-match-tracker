#!/usr/bin/env node

/**
 * Script de vérification de sécurité pour DBD Match Tracker
 * Vérifie les configurations de sécurité avant le déploiement
 */

const fs = require("fs");
const path = require("path");

console.log("🔒 Vérification de sécurité DBD Match Tracker\n");

// Vérifications
const checks = [];

// 1. Vérifier les variables d'environnement
function checkEnvironmentVariables() {
  console.log("📋 Vérification des variables d'environnement...");

  const requiredVars = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.log(`❌ Variables manquantes: ${missing.join(", ")}`);
    checks.push(false);
  } else {
    console.log("✅ Toutes les variables d'environnement sont présentes");
    checks.push(true);
  }

  // Vérifier la longueur du secret
  if (
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_SECRET.length < 32
  ) {
    console.log("❌ BETTER_AUTH_SECRET doit faire au moins 32 caractères");
    checks.push(false);
  } else if (process.env.BETTER_AUTH_SECRET) {
    console.log("✅ BETTER_AUTH_SECRET a une longueur suffisante");
    checks.push(true);
  }
}

// 2. Vérifier les headers de sécurité
function checkSecurityHeaders() {
  console.log("\n🛡️ Vérification des headers de sécurité...");

  const nextConfigPath = path.join(process.cwd(), "next.config.ts");

  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, "utf8");

    const requiredHeaders = [
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "X-XSS-Protection",
      "Strict-Transport-Security",
      "Content-Security-Policy",
    ];

    const missing = requiredHeaders.filter(
      (header) => !content.includes(header)
    );

    if (missing.length > 0) {
      console.log(`❌ Headers manquants: ${missing.join(", ")}`);
      checks.push(false);
    } else {
      console.log("✅ Tous les headers de sécurité sont configurés");
      checks.push(true);
    }
  } else {
    console.log("❌ Fichier next.config.ts non trouvé");
    checks.push(false);
  }
}

// 3. Vérifier le middleware de sécurité
function checkSecurityMiddleware() {
  console.log("\n🔐 Vérification du middleware de sécurité...");

  const middlewarePath = path.join(process.cwd(), "src", "middleware.ts");

  if (fs.existsSync(middlewarePath)) {
    const content = fs.readFileSync(middlewarePath, "utf8");

    const requiredFeatures = [
      "X-Frame-Options",
      "X-Content-Type-Options",
      "rateLimit",
      "trustedOrigins",
    ];

    const missing = requiredFeatures.filter(
      (feature) => !content.includes(feature)
    );

    if (missing.length > 0) {
      console.log(`❌ Fonctionnalités manquantes: ${missing.join(", ")}`);
      checks.push(false);
    } else {
      console.log("✅ Middleware de sécurité configuré");
      checks.push(true);
    }
  } else {
    console.log("❌ Fichier middleware.ts non trouvé");
    checks.push(false);
  }
}

// 4. Vérifier les dépendances
function checkDependencies() {
  console.log("\n📦 Vérification des dépendances...");

  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Vérifier les versions critiques
    const nextVersion = packageJson.dependencies?.next;
    const betterAuthVersion = packageJson.dependencies?.["better-auth"];

    if (nextVersion && nextVersion.includes("15.5")) {
      console.log("✅ Next.js version sécurisée");
      checks.push(true);
    } else {
      console.log(
        `❌ Next.js version potentiellement vulnérable: ${nextVersion}`
      );
      checks.push(false);
    }

    if (betterAuthVersion && betterAuthVersion.includes("1.3")) {
      console.log("✅ Better Auth version sécurisée");
      checks.push(true);
    } else {
      console.log(
        `❌ Better Auth version potentiellement vulnérable: ${betterAuthVersion}`
      );
      checks.push(false);
    }
  }
}

// 5. Vérifier la configuration de la base de données
function checkDatabaseConfig() {
  console.log("\n🗄️ Vérification de la configuration de la base de données...");

  const prismaSchemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

  if (fs.existsSync(prismaSchemaPath)) {
    const content = fs.readFileSync(prismaSchemaPath, "utf8");

    if (content.includes('provider = "postgresql"')) {
      console.log("✅ PostgreSQL configuré");
      checks.push(true);
    } else {
      console.log("❌ PostgreSQL non configuré");
      checks.push(false);
    }
  } else {
    console.log("❌ Fichier schema.prisma non trouvé");
    checks.push(false);
  }
}

// Exécuter toutes les vérifications
checkEnvironmentVariables();
checkSecurityHeaders();
checkSecurityMiddleware();
checkDependencies();
checkDatabaseConfig();

// Résumé
console.log("\n📊 Résumé de la vérification de sécurité:");
const passed = checks.filter((check) => check === true).length;
const total = checks.length;

console.log(`✅ ${passed}/${total} vérifications réussies`);

if (passed === total) {
  console.log("\n🎉 Toutes les vérifications de sécurité sont passées !");
  console.log("✅ Le projet est prêt pour la production");
  process.exit(0);
} else {
  console.log("\n⚠️ Certaines vérifications ont échoué");
  console.log("❌ Corrigez les problèmes avant le déploiement");
  process.exit(1);
}
