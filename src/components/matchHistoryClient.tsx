"use client";
import {
  KillerMatchWithRelations,
  SurvivorMatchWithRelations,
  MatchHistoryWithRelations,
} from "@/types/match";
import { KillerMatchCard } from "./killerMatchCard";
import { SurvivorMatchCard } from "./survivorMatchCard";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import clsx from "clsx";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounceValue } from "@/lib/utils-client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Search, Skull, Shield, Filter } from "lucide-react";

type MatchSide = "killer" | "survivor";

export const MatchHistoryClient = ({
  matchHistory,
}: {
  matchHistory: MatchHistoryWithRelations;
}) => {
  const [activeSide, setActiveSide] = useState<MatchSide>("killer");

  const killerCount = matchHistory.killerMatches.length;
  const survivorCount = matchHistory.survivorMatches.length;

  return (
    <Card className="bg-slate-400/30 backdrop-blur-md border border-border/50 shadow-2xl">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3 font-roboto">
              <TrendingUp className="w-6 h-6 text-red-500" />
              Match History
            </CardTitle>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={() => setActiveSide("killer")}
              variant={activeSide === "killer" ? "default" : "outline"}
              className={clsx(
                "flex-1 font-roboto text-lg transition-all duration-300",
                activeSide === "killer"
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/30 border-red-500/50"
                  : "hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
              )}
            >
              <Skull className="w-5 h-5 mr-2" />
              Killer Matches
              <Badge
                variant="secondary"
                className="ml-2 bg-red-500/60 text-white"
              >
                {killerCount}
              </Badge>
            </Button>
            <Button
              onClick={() => setActiveSide("survivor")}
              variant={activeSide === "survivor" ? "default" : "outline"}
              className={clsx(
                "flex-1 font-roboto text-lg transition-all duration-300",
                activeSide === "survivor"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-900/30 border-blue-500/50"
                  : "hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400"
              )}
            >
              <Shield className="w-5 h-5 mr-2" />
              Survivor Matches
              <Badge
                variant="secondary"
                className="ml-2 bg-blue-500/80 text-white"
              >
                {survivorCount}
              </Badge>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 w-full">
          {/* Content */}
          <AnimatePresence mode="wait">
            {activeSide === "killer" ? (
              <motion.div
                key="killer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <KillerMatchHistory matches={matchHistory.killerMatches} />
              </motion.div>
            ) : (
              <motion.div
                key="survivor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SurvivorMatchHistory matches={matchHistory.survivorMatches} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

const KillerMatchHistory = ({
  matches,
}: {
  matches: KillerMatchWithRelations[];
}) => {
  const [query, setQuery] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<
    KillerMatchWithRelations[]
  >([]);
  const debounceQuery = useDebounceValue(query, 500);

  useEffect(() => {
    setFilteredMatches(
      matches.filter((match) =>
        match.killer.name.toLowerCase().includes(debounceQuery.toLowerCase())
      )
    );
  }, [debounceQuery, matches]);

  const displayMatches = debounceQuery.length > 0 ? filteredMatches : matches;
  const noMatch =
    matches.length === 0 || (debounceQuery && filteredMatches.length === 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Section */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <Skull className="w-6 h-6 text-red-500" />
          <h2 className="font-roboto text-2xl font-bold text-red-500">
            Killer History
          </h2>
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-400 border-red-500/30"
          >
            {displayMatches.length} match
            {displayMatches.length !== 1 ? "es" : ""}
          </Badge>
        </div>

        <div className="relative max-w-sm w-full ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
          <Input
            placeholder="Search a killer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-gray-300/50 !font-bold !text-black placeholder:!text-black border-border/50 focus:border-red-500/50 focus:ring-red-500/20"
          />
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {noMatch ? (
          <motion.div
            key="no-match"
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Filter className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="font-roboto text-xl text-muted-foreground">
              {matches.length === 0
                ? "No killer matches found"
                : "No killer matches your search"}
            </p>
            {query && (
              <Button
                variant="outline"
                onClick={() => setQuery("")}
                className="mt-4 hover:bg-red-500/10 hover:border-red-500/50"
              >
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {displayMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <KillerMatchCard match={match} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SurvivorMatchHistory = ({
  matches,
}: {
  matches: SurvivorMatchWithRelations[];
}) => {
  const [query, setQuery] = useState("");
  const [filteredMatches, setFilteredMatches] = useState<
    SurvivorMatchWithRelations[]
  >([]);
  const debounceQuery = useDebounceValue(query, 500);

  useEffect(() => {
    setFilteredMatches(
      matches.filter((match) =>
        match.survivor.name.toLowerCase().includes(debounceQuery.toLowerCase())
      )
    );
  }, [debounceQuery, matches]);

  const displayMatches = debounceQuery.length > 0 ? filteredMatches : matches;
  const noMatch =
    matches.length === 0 || (debounceQuery && filteredMatches.length === 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Section */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="font-roboto text-2xl font-bold text-blue-500">
            Survivor History
          </h2>
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
          >
            {displayMatches.length} match
            {displayMatches.length !== 1 ? "es" : ""}
          </Badge>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
          <Input
            placeholder="Search a survivor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-gray-300/50 !font-bold !text-black placeholder:!text-black border-border/50 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {noMatch ? (
          <motion.div
            key="no-match"
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Filter className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="font-roboto text-xl text-muted-foreground">
              {matches.length === 0
                ? "No survivor matches found"
                : "No survivor matches your search"}
            </p>
            {query && (
              <Button
                variant="outline"
                onClick={() => setQuery("")}
                className="mt-4 hover:bg-blue-500/10 hover:border-blue-500/50"
              >
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {displayMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <SurvivorMatchCard match={match} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
