import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";
import { MatchHistoryClient } from "./matchHistoryClient";

const prisma = new PrismaClient();

export const MatchHistory = async () => {
  const user = await getRequiredUser();

  const matchHistory = await prisma.matchHistory.findUnique({
    where: {
      userId: user?.id,
    },
    include: {
      killerMatches: {
        include: {
          killer: true,
          map: true,
          perks: true,
          addOns: true,
          offerings: true,
        },
        orderBy: {
          playedAt: "desc",
        },
      },
      survivorMatches: {
        include: {
          survivor: true,
          killer: true,
          map: true,
          perks: true,
          addOns: true,
          offerings: true,
        },
        orderBy: {
          playedAt: "desc",
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
      <MatchHistoryClient matchHistory={matchHistory} />
    </div>
  );
};
