import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getRequiredUser } from "@/lib/auth-session";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await getRequiredUser();
  const killerId = req.nextUrl.searchParams.get("killerId");

  if (!killerId) {
    return NextResponse.json({ error: "Missing killerId" }, { status: 400 });
  }

  const addons = await prisma.killerAddOn.findMany({
    where: { killerId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return NextResponse.json(addons);
}
