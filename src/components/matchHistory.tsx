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
          survivorObject: true,
        },
        orderBy: {
          playedAt: "desc",
        },
      },
    },
  });

  if (!matchHistory) {
    return (
      <div className="flex justify-center items-center w-full">
        <div className="bg-white/10 border border-white/10 shadow-lg rounded-xl p-8 w-full max-w-xl text-center">
          <span className="text-lg text-gray-100 font-semibold">
            Aucun historique de parties trouvé.
            <br />
            Commencez par ajouter une partie à votre historique !
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <MatchHistoryClient matchHistory={matchHistory} />
    </div>
  );
};
