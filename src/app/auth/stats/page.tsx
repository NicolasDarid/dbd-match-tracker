import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getKillerStats,
  getRecentKillers,
  getTopKillersByMatchCount,
  getTopPerkCombosByKiller,
} from "@/lib/killer-stats";
import {
  getRecentSurvivors,
  getSurvivorStats,
  getTopSurvivorsByMatchCount,
  getTopPerkCombosBySurvivor,
} from "@/lib/survivor-stats";
import { getGlobalStats } from "@/lib/global-stats";
import GlobalStatsCard from "@/components/globalStatsCard";
import Image from "next/image";

export default async function Stats() {
  const mostPlayedKillers = await getTopKillersByMatchCount();
  const mostPlayedSurvivors = await getTopSurvivorsByMatchCount();
  const globalStats = await getGlobalStats();

  return (
    <div className="flex flex-row max-h-full gap-4">
      <div className="w-1/4 h-full bg-gray-700/20 rounded-2xl max-md:hidden">
        <div className="m-4 space-y-4">
          <GlobalStatsCard stats={globalStats} />

          <MostRecentKillersCard />

          <MostRecentSurvivorsCard />
        </div>
      </div>
      <div className="min-lg:w-3/4 max-md:w-full h-full bg-gray-400/20 rounded-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 ml-4">Killers</h2>
          {mostPlayedKillers.map((killer) => (
            <KillerStatsCard
              killerId={killer.id || ""}
              killerName={killer.name || ""}
              killerImage={killer.image || null}
              key={killer.id}
            />
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4 ml-4">Survivors</h2>
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

const MostRecentKillersCard = async () => {
  const mostRecentKillers = await getRecentKillers(4);
  return (
    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-white/10 shadow-xl text-white">
      <CardHeader className="text-center text-2xl font-bold">
        Most recent Killers played
      </CardHeader>
      <CardContent className="flex flex-col gap-4 ">
        <div className="grid min-xl:grid-cols-3 min-lg:grid-cols-2 max-md:grid-cols-1 gap-4 justify-items-center">
          {mostRecentKillers.map((killer) => (
            <div className="justify-items-center text-center" key={killer.id}>
              {killer.image ? (
                <Image
                  src={killer.image}
                  alt={killer.name}
                  height={100}
                  width={100}
                />
              ) : (
                <Image
                  src="/Loading_killer.webp"
                  alt={killer.name}
                  height={100}
                  width={100}
                />
              )}
              <span className="font-bold">{killer.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MostRecentSurvivorsCard = async () => {
  const mostRecentSurvivors = await getRecentSurvivors(4);
  return (
    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-white/10 shadow-xl text-white">
      <CardHeader className="text-center text-2xl font-bold">
        Most recent Survivors played
      </CardHeader>
      <CardContent className="flex flex-col gap-4 ">
        <div className="grid min-xl:grid-cols-3 min-lg:grid-cols-2 max-md:grid-cols-1 gap-4 justify-items-center">
          {mostRecentSurvivors.map((survivor) => (
            <div className="text-center justify-items-center" key={survivor.id}>
              {survivor.image ? (
                <Image
                  src={survivor.image}
                  alt={survivor.name}
                  height={100}
                  width={100}
                />
              ) : (
                <Image
                  src="/Loading_survivor.webp"
                  alt={survivor.name}
                  height={100}
                  width={100}
                />
              )}
              <span className="font-bold">{survivor.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const KillerStatsCard = async ({
  killerId,
  killerName,
  killerImage,
}: {
  killerId: string;
  killerName: string;
  killerImage: string | null;
}) => {
  const killerStats = await getKillerStats(killerId);
  const avg = killerStats._avg;
  const combos = await getTopPerkCombosByKiller(killerId);

  return (
    <Card className="m-4 backdrop-blur-md  inset-shadow-sm inset-shadow-gray-400/40 bg-white/10 border border-white/10 shadow-lg rounded-xl transition-all duration-300 hover:bg-white/15 hover:border-white/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={killerImage || "/Loading_killer.webp"}
            alt={killerName}
            width={80}
            height={80}
          />
          <CardTitle className="text-2xl font-semibold text-white underline decoration-white/50">
            {killerName}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-white/90">
          <div>
            <p className="text-2xl font-bold">{killerStats._count.id}</p>
            <p className="text-white/60">Matches played</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{Math.round(avg.score || 0)}</p>
            <p className="text-white/60">Average score</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Math.round(avg.numberOfKills || 0)}
            </p>
            <p className="text-white/60">Kills / match</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {Math.round(avg.numberOfHooks || 0)}
            </p>
            <p className="text-white/60">Hooks / match</p>
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
                  <strong>{(combo.avgKills || 0).toFixed(1)}</strong> kills –{" "}
                  <strong>{(combo.avgHooks || 0).toFixed(1)}</strong> hooks
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
