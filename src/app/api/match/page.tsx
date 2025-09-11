import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredUser } from "@/lib/auth-session";
import { PrismaClient } from "@/generated/prisma";
import { MatchForm } from "@/components/matchForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function AddMatch() {
  await getRequiredUser();

  const killers = await prisma.killer.findMany();
  const survivors = await prisma.survivor.findMany();
  const killerPerks = await prisma.killerPerk.findMany();
  const survivorPerks = await prisma.survivorPerk.findMany();
  const maps = await prisma.map.findMany();
  const killerOffering = await prisma.killerOffering.findMany();
  const survivorOffering = await prisma.survivorOffering.findMany();
  const survivorObjects = await prisma.survivorObject.findMany();

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-center text-2xl flex-1">
            Add Match
          </CardTitle>
          <Link href="/">
            <Button className="bg-gray-300 text-black font-bold hover:bg-gray-400">
              Back to history
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <MatchForm
          killers={killers}
          survivors={survivors}
          killerPerks={killerPerks}
          survivorPerks={survivorPerks}
          survivorObjects={survivorObjects}
          maps={maps}
          killerOffering={killerOffering}
          survivorOffering={survivorOffering}
        />
      </CardContent>
    </Card>
  );
}
