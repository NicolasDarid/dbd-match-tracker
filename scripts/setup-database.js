#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

console.log("🗄️ Setting up database for DBD Match Tracker...\n");

try {
  // Step 1: Generate Prisma client
  console.log("📦 Step 1: Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma client generated successfully!\n");

  // Step 2: Push schema to database
  console.log("🚀 Step 2: Pushing schema to database...");
  execSync("npx prisma db push", { stdio: "inherit" });
  console.log("✅ Schema pushed successfully!\n");

  // Step 3: Seed the database
  console.log("🌱 Step 3: Seeding database...");
  execSync("npx prisma db seed", { stdio: "inherit" });
  console.log("✅ Database seeded successfully!\n");

  console.log("🎉 Database setup completed successfully!");
  console.log("📊 Your database is now ready with all the DBD data.");
} catch (error) {
  console.error("❌ Error during database setup:", error.message);
  console.log("\n🔧 Troubleshooting:");
  console.log("1. Make sure your DATABASE_URL is correctly set in .env.local");
  console.log("2. Ensure your database is accessible");
  console.log("3. Check that all dependencies are installed (pnpm install)");
  process.exit(1);
}
