import { PrismaClient } from "../../src/generated/prisma";

const survivors = [
  "Dwight Fairfield",
  "Claudette Morel",
  "Jake Park",
  "Nea Karlsson",
  "Laurie Strode",
  "William 'Bill' Overbeck",
  "David King",
  "Quentin Smith",
  "Detective David Tapp",
  "Kate Denson",
  "Adam Francis",
  "Jane Romero",
  "Ashley J. Williams",
  "Steve Harrington",
  "Nancy Wheeler",
  "Yui Kimura",
  "Zarina Kassir",
  "Cheryl Mason",
  "Felix Richter",
  "Élodie Rakoto",
  "Yun-Jin Lee",
  "Jill Valentine",
  "Leon S. Kennedy",
  "Mikaela Reid",
  "Jonah Vasquez",
  "Yoichi Asakawa",
  "Haddie Kaur",
  "Ada Wong",
  "Rebecca Chambers",
  "Vittorio Toscano",
  "Thalita Lyra",
  "Renato Lyra",
  "Gabriel Soma",
  "Nicolas Cage",
  "Alan Wake",
  "Ellen Ripley",
  "Sable Ward",
];

export async function seedSurvivors(prisma: PrismaClient) {
  console.log("🏃 Ajout des survivors...");

  for (const name of survivors) {
    try {
      await prisma.survivor.upsert({
        where: { name },
        update: {},
        create: {
          name,
          image: null,
        },
      });
    } catch (error) {
      console.log(`⚠️  Survivor ${name} déjà existant ou erreur:`, error);
    }
  }

  console.log(`✅ ${survivors.length} survivors traités`);
}
