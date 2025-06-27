import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";
import MatchCard from "./match-card";

const prisma = new PrismaClient();

export default async function MatchHistory() {
  const user = await getRequiredUser();

  const matchHistory = await prisma.matchHistory.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      matchs: {
        include: {
          killer: true,
          map: true,
          killerPerks: true,
          survivors: true,
          addOns: true,
        },
      },
    },
  });

  if (!matchHistory) {
    return (
      <div>No match history found start by adding a match to your history</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold text-center">Match History</h1>
      <div className="flex flex-col gap-4">
        {matchHistory[0]?.matchs.map(async (match) => {
          return <MatchCard match={match} key={match.id} />;
        })}
      </div>
    </div>
  );
}
