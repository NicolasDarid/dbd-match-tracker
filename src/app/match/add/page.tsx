import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import { MatchForm } from "@/components/matchForm";
import AuthGuard from "@/components/auth-guard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { withCache, CACHE_KEYS } from "@/lib/cache";

const prisma = new PrismaClient();

export default async function AddMatch() {
  // Utiliser le cache pour les données statiques du formulaire
  const [
    killers,
    survivors,
    killerPerks,
    survivorPerks,
    maps,
    killerOffering,
    survivorOffering,
    survivorObjects,
  ] = await Promise.all([
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_killers`,
      () => prisma.killer.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_survivors`,
      () => prisma.survivor.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_killerPerks`,
      () => prisma.killerPerk.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_survivorPerks`,
      () => prisma.survivorPerk.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_maps`,
      () => prisma.map.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_killerOffering`,
      () => prisma.killerOffering.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_survivorOffering`,
      () => prisma.survivorOffering.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
    withCache(
      `${CACHE_KEYS.MATCH_DATA}_survivorObjects`,
      () => prisma.survivorObject.findMany(),
      30 * 60 * 1000
    ), // 30 minutes
  ]);

  return (
    <AuthGuard>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-center text-2xl flex-1">
              Add Match
            </CardTitle>
            <Link href="/">
              <Button className="bg-gray-300 text-black font-bold hover:bg-gray-400">
                Back to history
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <MatchForm
            killers={killers}
            survivors={survivors}
            killerPerks={killerPerks}
            survivorPerks={survivorPerks}
            maps={maps}
            killerOffering={killerOffering}
            survivorOffering={survivorOffering}
            survivorObjects={survivorObjects}
          />
        </CardContent>
      </Card>
    </AuthGuard>
  );
}
