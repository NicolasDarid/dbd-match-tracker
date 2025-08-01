import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRecentKillers } from "@/lib/killer-stats";
import { getRecentSurvivors } from "@/lib/survivor-stats";
import { getGlobalStats } from "@/lib/global-stats";
import GlobalStatsCard from "@/components/globalStatsCard";
import Image from "next/image";

export default async function GlobalStatsSection() {
  const globalStats = await getGlobalStats();

  return (
    <div className="w-1/4 h-full bg-gray-700/20 rounded-2xl max-md:hidden">
      <div className="m-4 space-y-4">
        <GlobalStatsCard stats={globalStats} />

        <MostRecentKillersCard />

        <MostRecentSurvivorsCard />
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
