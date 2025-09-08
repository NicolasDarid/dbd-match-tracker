import { PrismaClient } from "../../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Import and run all seed functions
    const { seedKillers } = await import("./seed-killers");
    const { seedSurvivors } = await import("./seed-survivors");
    const { seedMaps } = await import("./seed-maps");
    const { seedKillerPerks } = await import("./seed-killerPerks");
    const { seedSurvivorPerks } = await import("./seed-survivorPerks");
    const { seedKillerAddOns } = await import("./seed-addons");
    const { seedSurvivorAddOns } = await import("./seed-objectsAddons");
    const { seedSurvivorObjects } = await import("./seed-survivorObjects");
    const { seedKillerOfferings } = await import("./seed-killerOfferings");
    const { seedSurvivorOfferings } = await import("./seed-survivorOfferings");

    console.log("📊 Seeding killers...");
    await seedKillers(prisma);

    console.log("🏃 Seeding survivors...");
    await seedSurvivors(prisma);

    console.log("🗺️ Seeding maps...");
    await seedMaps(prisma);

    console.log("⚡ Seeding killer perks...");
    await seedKillerPerks(prisma);

    console.log("💪 Seeding survivor perks...");
    await seedSurvivorPerks(prisma);

    console.log("🔧 Seeding killer add-ons...");
    await seedKillerAddOns(prisma);

    console.log("📦 Seeding survivor objects...");
    await seedSurvivorObjects(prisma);

    console.log("🔗 Seeding survivor add-ons...");
    await seedSurvivorAddOns(prisma);

    console.log("🎁 Seeding killer offerings...");
    await seedKillerOfferings(prisma);

    console.log("🎁 Seeding survivor offerings...");
    await seedSurvivorOfferings(prisma);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
