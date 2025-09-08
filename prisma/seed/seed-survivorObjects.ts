import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const survivorObjects = [
  { name: "Firecracker", image: null },
  { name: "Flashlight", image: null },
  { name: "Fog Vial", image: null },
  { name: "Keys", image: null },
  { name: "Maps", image: null },
  { name: "Med-Kits", image: null },
  { name: "Toolboxes", image: null },
];

async function main() {
  for (const object of survivorObjects) {
    await prisma.survivorObject.upsert({
      where: { name: object.name },
      update: object,
      create: object,
    });
    console.log(`✅ Added object: ${object.name}`);
  }
}

main()
  .then(() => {
    console.log("🎉 All survivor objects inserted.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error inserting survivor objects:", e);
    prisma.$disconnect();
    process.exit(1);
  });
