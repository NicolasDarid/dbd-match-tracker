import { PrismaClient } from "@/generated/prisma";

const survivorObjects = {
  Flashlight: [
    "Battery",
    "Leather Grip",
    "Power Bulb",
    "Wide Lens",
    "Focus Lens",
    "Heavy Duty Battery",
    "Low Amp Filament",
    "Rubber Grip",
    "TIR Optic",
    "Intense Halogen",
    "Long Life Battery",
    "High-End Sapphire Lens",
    "Odd Bulb",
  ],
  "Fog Vial": [
    "Volcanic Stone",
    "Reactive Compound",
    "Oily Sap",
    "Mushroom Formula",
    "Potent Extract",
  ],
  Keys: [
    "Friendship Charm",
    "Shrill Whistle",
    "Braided Bauble",
    "Unique Wedding Ring",
    "Blood Amber",
  ],
  Maps: [
    "Glowing Ink",
    "Gnarled Compass",
    "Battered Tape",
    "Sharpened Flint",
    "Crimson Stamp",
  ],
  "Med-Kits": [
    "Bandages",
    "Butterfly Tape",
    "Rubber Gloves",
    "Medical Scissors",
    "Needle & Thread",
    "Self Adherent Wrap",
    "Sponge",
    "Gauze Roll",
    "Surgical Suture",
    "Abdominal Dressing",
    "Styptic Agent",
    "Anti-Haemorrhagic Syringe",
    "Gel Dressings",
  ],
  Toolboxes: [
    "Clean Rag",
    "Instructions",
    "Scraps",
    "Cutting Wire",
    "Protective Gloves",
    "Socket Swivels",
    "Spring Clamp",
    "Wire Spool",
    "Grip Wrench",
    "Hacksaw",
    "Brand New Part",
  ],
};

export async function seedObjectsAddons(prisma: PrismaClient) {
  console.log("🌱 Starting to seed survivor objects add-ons...");

  for (const [objectName, addOns] of Object.entries(survivorObjects)) {
    // Récupérer l'objet survivant depuis la base de données
    const object = await prisma.survivorObject.findFirst({
      where: { name: objectName },
    });

    if (!object) {
      console.log(
        `⚠️  Object "${objectName}" not found in database, skipping...`
      );
      continue;
    }

    console.log(`📦 Adding add-ons for ${objectName}...`);

    for (const addOnName of addOns) {
      try {
        await prisma.survivorAddOn.create({
          data: {
            name: addOnName,
            image: null, // Vous pouvez ajouter des URLs d'images plus tard
            objectId: object.id,
          },
        });
        console.log(`  ✅ Added: ${addOnName}`);
      } catch (error) {
        console.log(`  ❌ Failed to add ${addOnName}: ${error}`);
      }
    }

    console.log(`✅ Completed add-ons for ${objectName}`);
  }

  console.log("🎉 All survivor object add-ons seeded successfully!");
}
