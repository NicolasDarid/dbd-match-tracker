import { PrismaClient } from "@/generated/prisma";

const survivorObjects = [
  { name: "Firecracker", image: null },
  { name: "Flashlight", image: null },
  { name: "Fog Vial", image: null },
  { name: "Keys", image: null },
  { name: "Maps", image: null },
  { name: "Med-Kits", image: null },
  { name: "Toolboxes", image: null },
];

export async function seedSurvivorObjects(prisma: PrismaClient) {
  for (const object of survivorObjects) {
    await prisma.survivorObject.upsert({
      where: { name: object.name },
      update: object,
      create: object,
    });
    console.log(`✅ Added object: ${object.name}`);
  }
}
