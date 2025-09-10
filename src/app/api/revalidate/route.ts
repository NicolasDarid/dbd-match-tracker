import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Revalider la page spécifiée
    revalidatePath(path);

    return NextResponse.json({
      message: `Path ${path} revalidated successfully`,
      revalidated: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate path" },
      { status: 500 }
    );
  }
}
