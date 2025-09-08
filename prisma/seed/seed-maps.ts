import { PrismaClient } from "@/generated/prisma";

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

export async function seedMaps(prisma: PrismaClient) {
  for (const name of maps) {
    await prisma.map.upsert({
      where: { name },
      update: { name, image: null },
      create: { name, image: null },
    });
    console.log(`✅ Added: ${name}`);
  }
}
