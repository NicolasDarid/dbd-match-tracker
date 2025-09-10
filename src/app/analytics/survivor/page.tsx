import GlobalStatsSection from "@/components/globalStatsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getSurvivorStats,
  getTopSurvivorsByMatchCount,
  getTopPerkCombosBySurvivor,
} from "@/lib/survivor-stats";
import Image from "next/image";

// Force la revalidation de la page à chaque requête
export const revalidate = 0;

export default async function Stats() {
  const mostPlayedSurvivors = await getTopSurvivorsByMatchCount();

  return (
    <div className="flex flex-row max-h-full gap-4">
      <GlobalStatsSection />
      <div className="min-lg:w-3/4 max-md:w-full h-full bg-gray-400/20 rounded-2xl">
        <div>
          {mostPlayedSurvivors.map((survivor) => (
            <SurvivorStatsCard
              survivorId={survivor.id || ""}
              survivorName={survivor.name || ""}
              survivorImage={survivor.image || null}
              key={survivor.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const SurvivorStatsCard = async ({
  survivorId,
  survivorName,
  survivorImage,
}: {
  survivorId: string;
  survivorName: string;
  survivorImage: string | null;
}) => {
  const survivorStats = await getSurvivorStats(survivorId);
  const avg = survivorStats._avg;
  const combos = await getTopPerkCombosBySurvivor(survivorId);

  return (
    <Card className="m-4 backdrop-blur-md  inset-shadow-sm inset-shadow-gray-400/40 bg-white/10 border border-white/10 shadow-lg rounded-xl transition-all duration-300 hover:bg-white/15 hover:border-white/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={survivorImage || "/Loading_survivor.webp"}
            alt={survivorName}
            width={80}
            height={80}
          />
          <CardTitle className="text-2xl font-semibold text-white underline decoration-white/50">
            {survivorName}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-white/90">
          <div>
            <p className="text-2xl font-bold">{survivorStats._count.id}</p>
            <p className="text-white/60">Matches played</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{Math.round(avg.score || 0)}</p>
            <p className="text-white/60">Average score</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Math.round(avg.numberOfRescues || 0)}
            </p>
            <p className="text-white/60">Rescues / match</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Math.round(avg.numberOfGeneratorsDone || 0)}
            </p>
            <p className="text-white/60">Generators / match</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-md font-medium text-white/80 border-b border-white/10 pb-1">
            Top 3 perk combos
          </h2>
          <div className="flex flex-row gap-4">
            {combos.map((combo, index) => (
              <div
                key={index}
                className="w-1/3 p-4 rounded-md border-r-2 border-white/10 bg-white/5"
              >
                <p className="text-md text-white text-center mb-3">
                  {combo.matchCount} match(es) –{" "}
                  <strong>{(combo.avgRescues || 0).toFixed(1)}</strong> rescues
                  – <strong>{(combo.avgGenerators || 0).toFixed(1)}</strong>{" "}
                  generators
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 justify-items-center">
                  {combo.perks.map((perk) => (
                    <div
                      key={perk.id}
                      className="text-center justify-items-center"
                    >
                      <Image
                        src={perk.image || "/Placeholder_perks.webp"}
                        alt={perk.name}
                        width={50}
                        height={50}
                        className="rounded border border-white/20"
                      />
                      <p className="text-xs text-white/80 mt-1">{perk.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
