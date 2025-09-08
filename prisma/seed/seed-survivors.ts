import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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

async function main() {
  for (const name of survivors) {
    await prisma.survivor.create({
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
    console.log("🎉 All survivors inserted.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error inserting survivor:", e);
    prisma.$disconnect();
    process.exit(1);
  });
