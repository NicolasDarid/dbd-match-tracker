import { PrismaClient } from "@/generated/prisma";
import { withCache, CACHE_KEYS } from "./cache";

const prisma = new PrismaClient();

export async function getRecentSurvivors(limit = 6) {
  return withCache(
    `${CACHE_KEYS.RECENT_SURVIVORS}_${limit}`,
    async () => {
      const recentMatches = await prisma.survivorMatch.findMany({
        orderBy: {
          playedAt: "desc",
        },
        take: limit,
        include: {
          survivor: true,
        },
      });

      // On filtre les doublons par survivorId (ex : plusieurs parties avec le même survivor)
      const uniqueSurvivorsMap = new Map();

      for (const match of recentMatches) {
        if (!uniqueSurvivorsMap.has(match.survivor.id)) {
          uniqueSurvivorsMap.set(match.survivor.id, match.survivor);
        }

        if (uniqueSurvivorsMap.size >= limit) break;
      }

      return Array.from(uniqueSurvivorsMap.values());
    },
    2 * 60 * 1000
  ); // Cache pendant 2 minutes (plus court car plus dynamique)
}

export async function getSurvivorStats(survivorId: string) {
  return withCache(
    CACHE_KEYS.SURVIVOR_STATS(survivorId),
    async () => {
      return await prisma.survivorMatch.aggregate({
        where: {
          survivorId: survivorId,
        },
        _count: {
          id: true,
        },
        _avg: {
          score: true,
          numberOfRescues: true,
          numberOfGeneratorsDone: true,
        },
      });
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}

export async function getTopSurvivorsByMatchCount(limit = 6) {
  return withCache(
    `${CACHE_KEYS.TOP_SURVIVORS}_${limit}`,
    async () => {
      const survivorMatchCounts = await prisma.survivorMatch.groupBy({
        by: ["survivorId"],
        _count: {
          survivorId: true,
        },
        orderBy: {
          _count: {
            survivorId: "desc",
          },
        },
        take: limit,
      });

      // Récupère les données des survivants associés
      const survivorIds = survivorMatchCounts.map((s) => s.survivorId);
      const survivors = await prisma.survivor.findMany({
        where: {
          id: { in: survivorIds },
        },
      });

      // Mappe les infos des survivants avec leurs compteurs
      const survivorsWithCount = survivorMatchCounts.map((entry) => {
        const survivor = survivors.find((s) => s.id === entry.survivorId);
        return {
          ...survivor,
          matchCount: entry._count.survivorId,
        };
      });

      return survivorsWithCount;
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}

export async function getTopPerkCombosBySurvivor(
  survivorId: string,
  limit = 3,
  minMatches = 1
) {
  return withCache(
    `${CACHE_KEYS.SURVIVOR_PERK_COMBOS(survivorId)}_${limit}_${minMatches}`,
    async () => {
      const results = await prisma.survivorMatch.groupBy({
        by: ["perkComboKey"],
        where: {
          survivorId,
          perkComboKey: {
            not: null,
          },
        },
        _count: {
          perkComboKey: true,
        },
        _avg: {
          numberOfGeneratorsDone: true,
          numberOfRescues: true,
          score: true,
        },
        orderBy: {
          _avg: {
            numberOfGeneratorsDone: "desc",
          },
        },
        take: 50,
      });

      const filtered = results
        .filter((r) => r._count.perkComboKey >= minMatches)
        .slice(0, limit);

      const combos = await Promise.all(
        filtered.map(async (entry) => {
          const perkIds = entry.perkComboKey!.split("_");
          const perks = await prisma.survivorPerk.findMany({
            where: {
              id: {
                in: perkIds,
              },
            },
          });

          return {
            perks,
            matchCount: entry._count.perkComboKey,
            avgRescues: entry._avg?.numberOfRescues || 0,
            avgGenerators: entry._avg?.numberOfGeneratorsDone || 0,
            avgScore: entry._avg.score,
          };
        })
      );

      return combos;
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}
