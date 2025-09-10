"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CacheStats {
  size: number;
  keys: string[];
}

export default function CacheMonitor() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCacheStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cache/stats");
      if (response.ok) {
        const stats = await response.json();
        setCacheStats(stats);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des stats du cache:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (type: "stats" | "all") => {
    setLoading(true);
    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        await fetchCacheStats();
      }
    } catch (error) {
      console.error("Erreur lors de l'invalidation du cache:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheStats();
  }, []);

  // Ne pas afficher en production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-800/95 backdrop-blur-md border border-white/10 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center justify-between">
          Cache Monitor
          <Badge variant="outline" className="text-xs">
            DEV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Taille du cache:</span>
          <span className="text-white font-mono">
            {cacheStats?.size || 0} entrées
          </span>
        </div>

        {cacheStats?.keys && cacheStats.keys.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-gray-400">Clés en cache:</span>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {cacheStats.keys.map((key, index) => (
                <div
                  key={index}
                  className="text-xs font-mono text-gray-300 bg-gray-700/50 px-2 py-1 rounded"
                >
                  {key}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => clearCache("stats")}
            disabled={loading}
            className="flex-1 text-xs"
          >
            Clear Stats
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => clearCache("all")}
            disabled={loading}
            className="flex-1 text-xs"
          >
            Clear All
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={fetchCacheStats}
          disabled={loading}
          className="w-full text-xs"
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </CardContent>
    </Card>
  );
}
