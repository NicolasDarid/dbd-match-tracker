import { PrismaClient } from "../../src/generated/prisma";

const killers = [
  "The Hillbilly",
  "The Nurse",
  "The Shape",
  "The Hag",
  "The Doctor",
  "The Huntress",
  "The Cannibal",
  "The Nightmare",
  "The Pig",
  "The Clown",
  "The Spirit",
  "The Legion",
  "The Plague",
  "The Ghost Face",
  "The Demogorgon",
  "The Oni",
  "The Deathslinger",
  "The Blight",
  "The Twins",
  "The Trickster",
  "The Nemesis",
  "The Cenobite",
  "The Artist",
  "The Onryō",
  "The Dredge",
  "The Mastermind",
  "The Knight",
  "The Skull Merchant",
  "The Singularity",
  "The Xenomorph",
  "The Good Guy",
  "The Lich",
  "The Unknown",
  "The Dark Lord",
  "The Houndmaster",
  "The Ghoul",
  "The Animatronic",
  "The Wraith",
  "The Executioner",
  "The Trapper",
];

export async function seedKillers(prisma: PrismaClient) {
  console.log("🎯 Ajout des killers...");

  for (const name of killers) {
    try {
      await prisma.killer.upsert({
        where: { name },
        update: {},
        create: {
          name,
          image: null,
        },
      });
    } catch (error) {
      console.log(`⚠️  Killer ${name} déjà existant ou erreur:`, error);
    }
  }

  console.log(`✅ ${killers.length} killers traités`);
}
