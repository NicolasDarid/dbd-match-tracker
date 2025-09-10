import { PrismaClient } from "@/generated/prisma";
import { withCache, CACHE_KEYS } from "./cache";

const prisma = new PrismaClient();

export interface GlobalStats {
  totalMatches: number;
  killerMatches: number;
  survivorMatches: number;
  killerPercentage: number;
  survivorPercentage: number;
  totalKills: number;
  totalHooks: number;
  totalRescues: number;
  totalGeneratorsDone: number;
  avgKillsPerMatch: number;
  avgHooksPerMatch: number;
  avgRescuesPerMatch: number;
  avgGeneratorsPerMatch: number;
  averageScore: number;
}

export async function getGlobalStats(): Promise<GlobalStats> {
  return withCache(
    CACHE_KEYS.GLOBAL_STATS,
    async () => {
      // Compter les parties killer
      const killerMatchesCount = await prisma.killerMatch.count();

      // Compter les parties survivor
      const survivorMatchesCount = await prisma.survivorMatch.count();

      // Calculer le total
      const totalMatches = killerMatchesCount + survivorMatchesCount;

      // Calculer les pourcentages
      const killerPercentage =
        totalMatches > 0 ? (killerMatchesCount / totalMatches) * 100 : 0;
      const survivorPercentage =
        totalMatches > 0 ? (survivorMatchesCount / totalMatches) * 100 : 0;

      // Statistiques killer
      const killerStats = await prisma.killerMatch.aggregate({
        _sum: {
          numberOfKills: true,
          numberOfHooks: true,
          score: true,
        },
        _avg: {
          numberOfKills: true,
          numberOfHooks: true,
          score: true,
        },
      });

      // Statistiques survivor
      const survivorStats = await prisma.survivorMatch.aggregate({
        _sum: {
          numberOfRescues: true,
          numberOfGeneratorsDone: true,
          score: true,
        },
        _avg: {
          numberOfRescues: true,
          numberOfGeneratorsDone: true,
          score: true,
        },
      });

      // Calculer le score moyen global
      const totalKillerScore = killerStats._sum.score || 0;
      const totalSurvivorScore = survivorStats._sum.score || 0;
      const totalScore = totalKillerScore + totalSurvivorScore;
      const averageScore =
        totalMatches > 0 ? Math.round(totalScore / totalMatches) : 0;

      return {
        totalMatches,
        killerMatches: killerMatchesCount,
        survivorMatches: survivorMatchesCount,
        killerPercentage: Math.round(killerPercentage * 10) / 10,
        survivorPercentage: Math.round(survivorPercentage * 10) / 10,
        totalKills: killerStats._sum.numberOfKills || 0,
        totalHooks: killerStats._sum.numberOfHooks || 0,
        totalRescues: survivorStats._sum.numberOfRescues || 0,
        totalGeneratorsDone: survivorStats._sum.numberOfGeneratorsDone || 0,
        avgKillsPerMatch:
          Math.round((killerStats._avg.numberOfKills || 0) * 10) / 10,
        avgHooksPerMatch:
          Math.round((killerStats._avg.numberOfHooks || 0) * 10) / 10,
        avgRescuesPerMatch:
          Math.round((survivorStats._avg.numberOfRescues || 0) * 10) / 10,
        avgGeneratorsPerMatch:
          Math.round((survivorStats._avg.numberOfGeneratorsDone || 0) * 10) /
          10,
        averageScore,
      };
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}

export async function getRecentActivity(limit = 10) {
  // Récupérer les parties récentes (killer et survivor mélangées)
  const recentKillerMatches = await prisma.killerMatch.findMany({
    take: limit,
    orderBy: { playedAt: "desc" },
    include: {
      killer: true,
      map: true,
    },
  });

  const recentSurvivorMatches = await prisma.survivorMatch.findMany({
    take: limit,
    orderBy: { playedAt: "desc" },
    include: {
      survivor: true,
      map: true,
    },
  });

  // Combiner et trier par date
  const allMatches = [
    ...recentKillerMatches.map((match) => ({
      ...match,
      type: "killer" as const,
      character: match.killer,
    })),
    ...recentSurvivorMatches.map((match) => ({
      ...match,
      type: "survivor" as const,
      character: match.survivor,
    })),
  ].sort(
    (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
  );

  return allMatches.slice(0, limit);
}
