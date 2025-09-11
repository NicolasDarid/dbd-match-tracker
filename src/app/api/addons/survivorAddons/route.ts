import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Vérifier l'authentification (nécessaire pour la sécurité)
  await getRequiredUser();
  const objectId = req.nextUrl.searchParams.get("objectId");

  if (!objectId) {
    return NextResponse.json({ error: "Missing objectId" }, { status: 400 });
  }

  const addons = await prisma.survivorAddOn.findMany({
    where: { objectId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return NextResponse.json(addons);
}
