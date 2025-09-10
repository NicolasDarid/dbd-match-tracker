import { NextRequest, NextResponse } from "next/server";
import { invalidateStatsCache, invalidateAllCache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    switch (type) {
      case "stats":
        invalidateStatsCache();
        return NextResponse.json({
          success: true,
          message: "Cache des statistiques invalidé",
        });

      case "all":
        invalidateAllCache();
        return NextResponse.json({
          success: true,
          message: "Tout le cache invalidé",
        });

      default:
        return NextResponse.json(
          { success: false, message: "Type d'invalidation non reconnu" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur lors de l'invalidation du cache:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint d'invalidation du cache",
    usage: {
      POST: {
        description: "Invalide le cache",
        body: {
          type: "stats | all",
        },
      },
    },
  });
}
