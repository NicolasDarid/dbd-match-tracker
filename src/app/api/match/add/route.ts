import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const json = await request.json();
  const user = await getRequiredUser();
  const match = json.match;
  const side = json.side;

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
        addOns: {
          connect: match.addOns.map((id) => ({
            id,
          })),
        },
        offerings: {
          connect: match.offering.map((id) => ({
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
  }

  if (side === "survivor") {
    await prisma.survivorMatch.create({
      data: {
        survivor: {
          connect: {
            id: match.survivorId,
          },
        },
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
        teammates: {
          connect: match.survivorsIds.map((id) => ({
            id,
          })),
        },
        perks: {
          connect: match.perks.map((id) => ({
            id,
          })),
        },
        addOns: {
          connect: match.addOns.map((id) => ({
            id,
          })),
        },
        offerings: {
          connect: match.offering.map((id) => ({
            id,
          })),
        },
        numberOfRescues: match.numberOfRescues,
        numberOfGeneratorsDone: match.numberOfGeneratorsDone,
        score: match.score,
        matchHistory: {
          connect: {
            id: matchHistory.id,
          },
        },
        survivorWin: match.escaped,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const json = await request.json();
  const id = json.id;
  const side = json.side;

  if (!id || !side) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const user = await getRequiredUser();

  if (side === "killer") {
    const match = await prisma.killerMatch.findUnique({
      where: { id: id },
      include: {
        matchHistory: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "No match found" }, { status: 400 });
    }

    const isOwner = match.matchHistory.some((mh) => mh.userId === user.id);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden action" }, { status: 403 });
    }

    const data = await prisma.killerMatch.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(data);
  }

  if (side === "survivor") {
    const match = await prisma.survivorMatch.findUnique({
      where: { id: id },
      include: {
        matchHistory: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "No match found" }, { status: 400 });
    }

    const isOwner = match.matchHistory.some((mh) => mh.userId === user.id);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden action" }, { status: 403 });
    }

    const data = await prisma.survivorMatch.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(data);
  }
}
