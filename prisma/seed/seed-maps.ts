import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const maps = [
  "Fractured Cowshed",
  "Rancid Abattoir",
  "Rotten Fields",
  "The Thompson House",
  "Torment Creek",
  "Disturbed Ward",
  "Father Campbell's Chapel",
  "Lampkin Lane",
  "The Pale Rose",
  "Grim Pantry",
  "Treatment Theatre",
  "Mother's Dwelling",
  "The Temple of Purgation",
  "Badham Preschool",
  "The Game",
  "Family Residence",
  "Sanctum of Wrath",
  "Mount Ormond Resort",
  "Ormond Lake Mine",
  "The Underground Complex",
  "Dead Dawg Saloon",
  "Midwich Elementary School",
  "Raccoon City Police Station East Wing",
  "Raccoon City Police Station West Wing",
  "Eyrie of Crows",
  "Dead Sands",
  "Garden of Joy",
  "Greenville Square",
  "Freddy Fazbear's Pizza",
  "Fallen Refuge",
  "The Shattered Square",
  "Forgotten Ruins",
  "Toba Landing",
  "Nostromo Wreckage",
];

async function main() {
  for (const name of maps) {
    await prisma.map.create({
      data: {
        name,
        image: null, // ou une URL si tu veux les remplir plus tard
      },
    });
    console.log(`✅ Added: ${name}`);
  }
}

main()
  .then(() => {
    console.log("🎉 All maps inserted.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error inserting map:", e);
    prisma.$disconnect();
    process.exit(1);
  });
