// Script pour s'assurer que Prisma fonctionne sur Vercel
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 Configuration Prisma pour Vercel...");

try {
  // Générer le client Prisma
  console.log("📦 Génération du client Prisma...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Vérifier que les moteurs sont présents
  const prismaPath = path.join(__dirname, "../src/generated/prisma");
  console.log("📁 Vérification du dossier Prisma:", prismaPath);

  if (fs.existsSync(prismaPath)) {
    const files = fs.readdirSync(prismaPath);
    console.log("📄 Fichiers générés:", files);
  }

  console.log("✅ Configuration Prisma terminée!");
} catch (error) {
  console.error("❌ Erreur lors de la configuration Prisma:", error);
  process.exit(1);
}
