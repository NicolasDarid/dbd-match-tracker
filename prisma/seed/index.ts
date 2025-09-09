/**
 * Script de seed principal pour DBD Match Tracker
 * Ce script orchestre tous les seeds pour peupler la base de données
 */

import { PrismaClient } from "../../src/generated/prisma";

const prisma = new PrismaClient();

// Import des scripts de seed
import { seedKillers } from "./seed-killers";
import { seedSurvivors } from "./seed-survivors";
import { seedKillerPerks } from "./seed-killerPerks";
import { seedSurvivorPerks } from "./seed-survivorPerks";
import { seedKillerAddons } from "./seed-addons";
import { seedSurvivorObjects } from "./seed-survivorObjects";
import { seedObjectsAddons } from "./seed-objectsAddons";
import { seedKillerOfferings } from "./seed-killerOfferings";
import { seedSurvivorOfferings } from "./seed-survivorOfferings";
import { seedMaps } from "./seed-maps";

async function main() {
  console.log("🌱 Début du peuplement de la base de données...");

  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log("✅ Connexion à la base de données établie");

    // Nettoyer la base de données (optionnel - décommentez si nécessaire)
    // console.log('🧹 Nettoyage de la base de données...');
    // await cleanDatabase();

    // Seeds dans l'ordre de dépendance
    console.log("\n📊 Peuplement des données de base...");

    await seedKillers(prisma);
    console.log("✅ Killers ajoutés");

    await seedSurvivors(prisma);
    console.log("✅ Survivors ajoutés");

    await seedKillerPerks(prisma);
    console.log("✅ Perks de killers ajoutés");

    await seedSurvivorPerks(prisma);
    console.log("✅ Perks de survivors ajoutés");

    await seedKillerAddons(prisma);
    console.log("✅ Add-ons de killers ajoutés");

    await seedSurvivorObjects(prisma);
    console.log("✅ Objets de survivors ajoutés");

    await seedObjectsAddons(prisma);
    console.log("✅ Add-ons d'objets ajoutés");

    await seedKillerOfferings(prisma);
    console.log("✅ Offrandes de killers ajoutées");

    await seedSurvivorOfferings(prisma);
    console.log("✅ Offrandes de survivors ajoutées");

    await seedMaps(prisma);
    console.log("✅ Cartes ajoutées");

    console.log("\n🎉 Peuplement de la base de données terminé avec succès!");

    // Afficher un résumé
    await showSummary();
  } catch (error) {
    console.error("❌ Erreur lors du peuplement de la base de données:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// async function cleanDatabase() {
//   // Supprimer les données dans l'ordre inverse des dépendances
//   const tables = [
//     "matchHistory",
//     "killerMatch",
//     "survivorMatch",
//     "map",
//     "killerOffering",
//     "survivorOffering",
//     "survivorAddOn",
//     "survivorObject",
//     "killerAddOn",
//     "survivorPerk",
//     "killerPerk",
//     "survivor",
//     "killer",
//     "verification",
//     "session",
//     "account",
//     "user",
//   ];

//   for (const table of tables) {
//     try {
//       await (prisma as any)[table].deleteMany();
//       console.log(`🧹 Table ${table} nettoyée`);
//     } catch (error) {
//       console.log(`⚠️  Impossible de nettoyer la table ${table}:`, error);
//     }
//   }
// }

async function showSummary() {
  console.log("\n📊 Résumé de la base de données:");

  const counts = await Promise.all([
    prisma.killer.count(),
    prisma.survivor.count(),
    prisma.killerPerk.count(),
    prisma.survivorPerk.count(),
    prisma.killerAddOn.count(),
    prisma.survivorObject.count(),
    prisma.survivorAddOn.count(),
    prisma.killerOffering.count(),
    prisma.survivorOffering.count(),
    prisma.map.count(),
  ]);

  console.log(`   • Killers: ${counts[0]}`);
  console.log(`   • Survivors: ${counts[1]}`);
  console.log(`   • Perks de killers: ${counts[2]}`);
  console.log(`   • Perks de survivors: ${counts[3]}`);
  console.log(`   • Add-ons de killers: ${counts[4]}`);
  console.log(`   • Objets de survivors: ${counts[5]}`);
  console.log(`   • Add-ons d'objets: ${counts[6]}`);
  console.log(`   • Offrandes de killers: ${counts[7]}`);
  console.log(`   • Offrandes de survivors: ${counts[8]}`);
  console.log(`   • Cartes: ${counts[9]}`);
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
}

export { main as seedDatabase };
