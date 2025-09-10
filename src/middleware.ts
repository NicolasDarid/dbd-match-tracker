import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Headers de sécurité pour toutes les routes
  const response = NextResponse.next();

  // Headers de sécurité supplémentaires
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS en production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Protection des routes d'API
  if (pathname.startsWith("/api/")) {
    // Rate limiting basique pour les API
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Log des accès API pour monitoring
    console.log(`API Access: ${pathname} - IP: ${ip} - UA: ${userAgent}`);

    // Protection contre les attaques par déni de service
    if (pathname.includes("..") || pathname.includes("//")) {
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

  // Protection des routes d'authentification
  if (pathname.startsWith("/auth/")) {
    // Vérifier que la requête vient d'une origine autorisée
    const origin = request.headers.get("origin");

    if (process.env.NODE_ENV === "production") {
      const allowedOrigins = [process.env.BETTER_AUTH_URL];
      if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
};
