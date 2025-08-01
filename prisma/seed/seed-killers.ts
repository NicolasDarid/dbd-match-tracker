import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

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
];

async function main() {
  for (const name of killers) {
    await prisma.killer.create({
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
    console.log("🎉 All killers inserted.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error inserting killers:", e);
    prisma.$disconnect();
    process.exit(1);
  });
