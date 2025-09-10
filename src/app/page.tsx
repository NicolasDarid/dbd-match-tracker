import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import { LogIn, Plus, TrendingUp, Skull, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MatchHistory } from "@/components/matchHistory";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGlobalStats } from "@/lib/global-stats";
import { getRecentKillers } from "@/lib/killer-stats";
import { getRecentSurvivors } from "@/lib/survivor-stats";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-red-800/30 shadow-2xl shadow-red-900/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Skull className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-300">
                You must sign in to access your match history
              </p>
            </div>
            <Link href="/auth/signin">
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-900/30">
                <LogIn className="mr-2 w-5 h-5" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [globalStats, recentKillers, recentSurvivors] = await Promise.all([
    getGlobalStats(),
    getRecentKillers(3),
    getRecentSurvivors(3),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-red-500/50 shadow-lg shadow-red-900/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border-2 border-red-500/50 shadow-lg shadow-red-900/30">
                    <Skull className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-roboto">
                  {user.name}
                </h1>
                <p className="text-gray-300 text-lg">Hunt or be hunted</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-red-800/40 to-red-900/40 backdrop-blur-md border border-red-500/30 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-red-400">
                  {globalStats.totalMatches}
                </div>
                <div className="text-sm text-gray-300">Matches</div>
              </div>
              <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-purple-400">
                  {globalStats.averageScore}
                </div>
                <div className="text-sm text-gray-300">Avg Score</div>
              </div>
            </div>

            {/* Add Match Button */}
            <Link href="/api/match">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-900/50 border border-red-500/30">
                <Plus className="mr-2 w-5 h-5" />
                New Match
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Match History */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <Skeleton className="h-[600px] w-full bg-gray-700/50" />
              }
            >
              <MatchHistory />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Killers */}
            <Card className="bg-gradient-to-br from-red-800/40 to-red-900/40 backdrop-blur-md border border-red-500/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Skull className="w-5 h-5 text-red-400" />
                  Recent Killers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentKillers.map((killer) => (
                  <div
                    key={killer.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    {killer.image ? (
                      <Image
                        src={killer.image}
                        alt={killer.name}
                        width={40}
                        height={40}
                        className="rounded border border-red-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                        <Skull className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-white font-medium text-sm">
                      {killer.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Survivors */}
            <Card className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 backdrop-blur-md border border-blue-500/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Recent Survivors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSurvivors.map((survivor) => (
                  <div
                    key={survivor.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    {survivor.image ? (
                      <Image
                        src={survivor.image}
                        alt={survivor.name}
                        width={40}
                        height={40}
                        className="rounded border border-blue-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-white font-medium text-sm">
                      {survivor.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/api/match" className="block">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-red-900/30 border border-red-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Match
                  </Button>
                </Link>
                <Link href="/analytics" className="block">
                  <Button className="w-full border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-medium shadow-sm hover:shadow-white/10">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
