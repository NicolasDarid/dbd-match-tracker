import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredUser } from "@/lib/auth-session";
import { PrismaClient } from "@/generated/prisma";
import { MatchForm } from "@/components/matchForm";

const prisma = new PrismaClient();

export default async function AddMatch() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = getRequiredUser();

  const killers = await prisma.killer.findMany();
  const survivors = await prisma.survivor.findMany();
  const killerPerks = await prisma.killerPerk.findMany();
  const survivorPerks = await prisma.survivorPerk.findMany();
  const maps = await prisma.map.findMany();

  console.log(killers);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Add Match</CardTitle>
      </CardHeader>
      <CardContent>
        <MatchForm
          killers={killers}
          survivors={survivors}
          killerPerks={killerPerks}
          survivorPerks={survivorPerks}
          maps={maps}
        />
      </CardContent>
    </Card>
  );
}
