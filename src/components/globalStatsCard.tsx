import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalStats } from "@/lib/global-stats";
import { Trophy, Skull, Users } from "lucide-react";

interface GlobalStatsCardProps {
  stats: GlobalStats;
}

export default function GlobalStatsCard({ stats }: GlobalStatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-white/10 shadow-xl">
      <CardHeader className="text-center pb-1">
        <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Global Statistics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total matches */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {stats.totalMatches}
          </div>
          <div className="text-sm text-gray-300">Total matches played</div>
        </div>

        {/* Role distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white text-center">
            Role Distribution
          </h3>

          <div className="flex flex-col gap-4">
            {/* Killer */}
            <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Skull className="h-5 w-5 text-red-400" />
                <span className="font-semibold text-white">Killer</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {stats.killerMatches}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stats.killerPercentage}% of matches
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {stats.avgKillsPerMatch}
                  </div>
                  <div className="text-sm text-gray-300">Avg kills/match</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                  <div className="font-semibold text-white">Total Kills</div>
                  <div>{stats.totalKills}</div>
                </div>
                <div>
                  <div className="font-semibold text-white">Total Hooks</div>
                  <div>{stats.totalHooks}</div>
                </div>
              </div>
            </div>

            {/* Survivor */}
            <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="font-semibold text-white">Survivor</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.survivorMatches}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stats.survivorPercentage}% of matches
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.avgRescuesPerMatch}
                  </div>
                  <div className="text-sm text-gray-300">Avg rescues/match</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                  <div className="font-semibold text-white">Total Rescues</div>
                  <div>{stats.totalRescues}</div>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Total Generators
                  </div>
                  <div>{stats.totalGeneratorsDone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Killer</span>
            <span>Survivor</span>
          </div>
          <div className="w-full bg-gradient-to-l from-blue-500 to-blue-600 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
              style={{ width: `${stats.killerPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
