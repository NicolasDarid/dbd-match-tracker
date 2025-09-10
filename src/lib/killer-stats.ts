import { PrismaClient } from "@/generated/prisma";
import { withCache, CACHE_KEYS } from "./cache";

const prisma = new PrismaClient();

export async function getKillerStats(killerId: string) {
  return withCache(
    CACHE_KEYS.KILLER_STATS(killerId),
    async () => {
      return await prisma.killerMatch.aggregate({
        where: { killerId },
        _count: { id: true },
        _sum: {
          numberOfHooks: true,
          numberOfKills: true,
          score: true,
        },
        _avg: {
          numberOfHooks: true,
          numberOfKills: true,
          score: true,
        },
      });
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}

export async function getAllKillersWithStats() {
  return await prisma.killerMatch.groupBy({
    by: ["killerId"],
    _count: { id: true },
    _sum: { score: true, numberOfHooks: true, numberOfKills: true },
    _avg: { score: true, numberOfHooks: true, numberOfKills: true },
  });
}

export async function getTopKillersByMatchCount(limit = 6) {
  return withCache(
    `${CACHE_KEYS.TOP_KILLERS}_${limit}`,
    async () => {
      const killerMatchCounts = await prisma.killerMatch.groupBy({
        by: ["killerId"],
        _count: {
          killerId: true,
        },
        orderBy: {
          _count: {
            killerId: "desc",
          },
        },
        take: limit,
      });

      // Récupère les données des tueurs associés
      const killerIds = killerMatchCounts.map((k) => k.killerId);
      const killers = await prisma.killer.findMany({
        where: {
          id: { in: killerIds },
        },
      });

      // Mappe les infos des tueurs avec leurs compteurs
      const killersWithCount = killerMatchCounts.map((entry) => {
        const killer = killers.find((k) => k.id === entry.killerId);
        return {
          ...killer,
          matchCount: entry._count.killerId,
        };
      });

      return killersWithCount;
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}

export async function getRecentKillers(limit = 6) {
  return withCache(
    `${CACHE_KEYS.RECENT_KILLERS}_${limit}`,
    async () => {
      const recentMatches = await prisma.killerMatch.findMany({
        orderBy: {
          playedAt: "desc",
        },
        take: limit,
        include: {
          killer: true,
        },
      });

      // On filtre les doublons par killerId (ex : plusieurs parties avec le même tueur)
      const uniqueKillersMap = new Map();

      for (const match of recentMatches) {
        if (!uniqueKillersMap.has(match.killer.id)) {
          uniqueKillersMap.set(match.killer.id, match.killer);
        }

        if (uniqueKillersMap.size >= limit) break;
      }

      return Array.from(uniqueKillersMap.values());
    },
    2 * 60 * 1000
  ); // Cache pendant 2 minutes (plus court car plus dynamique)
}

export async function getTopPerkCombosByKills(limit = 3, minMatches = 1) {
  const results = await prisma.killerMatch.groupBy({
    by: ["perkComboKey"],
    where: {
      perkComboKey: {
        not: null,
      },
    },
    _count: {
      perkComboKey: true, // Compte combien de fois chaque combo apparaît
    },
    _avg: {
      numberOfKills: true,
      numberOfHooks: true,
      score: true,
    },
    orderBy: {
      _avg: {
        numberOfKills: "desc",
      },
    },
    take: 50, // on prend plus large et on filtre ensuite
  });

  // Filtrer en JS pour garder uniquement les combos avec assez de matchs
  const filtered = results
    .filter((r) => r._count.perkComboKey >= minMatches)
    .slice(0, limit);

  // On récupère les perks associés
  const combos = await Promise.all(
    filtered.map(async (entry) => {
      const perkIds = entry.perkComboKey!.split("_");
      const perks = await prisma.killerPerk.findMany({
        where: {
          id: {
            in: perkIds,
          },
        },
      });

      return {
        perks,
        matchCount: entry._count.perkComboKey,
        avgKills: entry._avg.numberOfKills,
        avgHooks: entry._avg.numberOfHooks,
        avgScore: entry._avg.score,
      };
    })
  );

  return combos;
}

export async function getTopPerkCombosByKiller(
  killerId: string,
  limit = 3,
  minMatches = 1
) {
  return withCache(
    `${CACHE_KEYS.KILLER_PERK_COMBOS(killerId)}_${limit}_${minMatches}`,
    async () => {
      const results = await prisma.killerMatch.groupBy({
        by: ["perkComboKey"],
        where: {
          killerId,
          perkComboKey: {
            not: null,
          },
        },
        _count: {
          perkComboKey: true,
        },
        _avg: {
          numberOfKills: true,
          numberOfHooks: true,
          score: true,
        },
        orderBy: {
          _avg: {
            numberOfKills: "desc",
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
          const perks = await prisma.killerPerk.findMany({
            where: {
              id: {
                in: perkIds,
              },
            },
          });

          return {
            perks,
            matchCount: entry._count.perkComboKey,
            avgKills: entry._avg.numberOfKills,
            avgHooks: entry._avg.numberOfHooks,
            avgScore: entry._avg.score,
          };
        })
      );

      return combos;
    },
    5 * 60 * 1000
  ); // Cache pendant 5 minutes
}
