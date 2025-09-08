import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
// import { env } from "./env";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "development-secret-key-minimum-32-characters",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true", // Contrôlé par variable d'environnement
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  email: {
    sendVerificationEmail: async ({
      user,
      token,
      url,
    }: {
      user: { email: string };
      token: string;
      url: string;
    }) => {
      // Configuration SMTP pour l'envoi d'emails
      if (process.env.NODE_ENV === "production") {
        // TODO: Implémenter l'envoi d'email avec un service SMTP
        console.log(`Email de vérification pour ${user.email}: ${url}`);
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 tentatives par minute
  },
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [process.env.BETTER_AUTH_URL || "https://yourdomain.com"]
      : ["http://localhost:3000", "http://localhost:3001"],
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
});
