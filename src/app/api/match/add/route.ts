import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const json = await request.json();
  const user = await getRequiredUser();
  const match = json.match;
  const side = json.side;
  console.log("🟢");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (!match) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const matchHistory = await prisma.matchHistory.findUnique({
    where: {
      userId: user?.id,
    },
  });
  console.log("🟢");

  if (!matchHistory) {
    await prisma.matchHistory.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  if (side === "killer") {
    await prisma.killerMatch.create({
      data: {
        killer: {
          connect: {
            id: match.killerId,
          },
        },
        map: {
          connect: {
            id: match.mapId,
          },
        },
        survivors: {
          connect: match.survivorsIds.map((id) => ({
            id,
          })),
        },
        perks: {
          connect: match.perks.map((id) => ({
            id,
          })),
        },
        numberOfKills: match.numberOfKills,
        numberOfHooks: match.numberOfHooks,
        numberOfGeneratorsRemaining: match.numberOfGeneratorsRemaining,
        score: match.score,
        matchHistory: {
          connect: {
            id: matchHistory.id,
          },
        },
        killerWin: match.numberOfKills >= 3,
      },
    });
  } else {
    console.log("survivor", match);
  }

  return NextResponse.json({ success: true });
}
