import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

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

  const perkIds: string[] = match.perks || [];
  const perkComboKey =
    perkIds.length === 4 ? perkIds.slice().sort().join("_") : null;

  let matchHistory = await prisma.matchHistory.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!matchHistory) {
    matchHistory = await prisma.matchHistory.create({
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

        perkComboKey: perkComboKey ?? "none",
        perks: {
          connect: match.perks.map((id: string) => ({
            id,
          })),
        },
        addOns: {
          connect: match.addOns.map((id: string) => ({
            id,
          })),
        },
        offerings: {
          connect: match.offering.map((id: string) => ({
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
    const survivorMatchData: {
      survivor: { connect: { id: string } };
      killer: { connect: { id: string } };
      map: { connect: { id: string } };
      perks: { connect: { id: string }[] };
      offerings: { connect: { id: string }[] };
      numberOfRescues: number;
      numberOfGeneratorsDone: number;
      score: number;
      matchHistory: { connect: { id: string } };
      survivorWin: boolean;
      survivorObject?: { connect: { id: string } };
      addOns?: { connect: { id: string }[] };
      perkComboKey: string;
    } = {
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

      perks: {
        connect: match.perks.map((id: string) => ({
          id,
        })),
      },
      offerings: {
        connect: match.offerings.map((id: string) => ({
          id,
        })),
      },
      perkComboKey: perkComboKey ?? "none",
      numberOfRescues: match.numberOfRescues,
      numberOfGeneratorsDone: match.numberOfGeneratorsDone,
      score: match.score,
      matchHistory: {
        connect: {
          id: matchHistory.id,
        },
      },
      survivorWin: match.escaped,
    };

    // Ajouter survivorObject seulement s'il est fourni
    if (match.objectId) {
      survivorMatchData.survivorObject = {
        connect: {
          id: match.objectId,
        },
      };
    }

    // Ajouter addOns seulement s'ils sont fournis
    if (match.addOns && match.addOns.length > 0) {
      survivorMatchData.addOns = {
        connect: match.addOns.map((id: string) => ({
          id,
        })),
      };
    }

    await prisma.survivorMatch.create({
      data: survivorMatchData,
    });
  }

  // Revalider la page analytics après l'ajout d'un match
  revalidatePath("/analytics");

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

    // Revalider la page analytics après la suppression d'un match
    revalidatePath("/analytics");

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

    // Revalider la page analytics après la suppression d'un match
    revalidatePath("/analytics");

    return NextResponse.json(data);
  }
}
