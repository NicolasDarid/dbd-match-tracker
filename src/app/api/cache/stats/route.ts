import { NextResponse } from "next/server";
import { cache } from "@/lib/cache";

export async function GET() {
  try {
    // Ne pas exposer les stats en production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Non disponible en production" },
        { status: 403 }
      );
    }

    const stats = {
      size: cache.size(),
      keys: Array.from((cache as any).cache.keys()),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des stats du cache:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
