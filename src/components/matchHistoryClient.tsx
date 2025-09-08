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

export const MatchHistoryClient = ({
  matchHistory,
}: {
  matchHistory: MatchHistoryWithRelations;
}) => {
  const [side, setSide] = useState(true); //true for killer and false for survivor I KNOW IT'S BAD

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex min-lg:flex-row max-md:flex-col gap-4 w-full justify-center">
        <Button
          onClick={() => setSide(true)}
          variant="outline"
          className={clsx(
            {
              "bg-red-300": side,
            },
            "font-roboto text-xl"
          )}
        >
          Killer Match History
        </Button>
        <Button
          onClick={() => setSide(false)}
          variant="outline"
          className={clsx(
            {
              "bg-blue-300": !side,
            },
            "font-roboto text-xl "
          )}
        >
          Survivor Match History
        </Button>
      </div>
      {side ? (
        <KillerMatchHistory matches={matchHistory.killerMatches} />
      ) : (
        <SurvivorMatchHistory matches={matchHistory.survivorMatches} />
      )}
    </div>
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
      <motion.h1
        className="font-roboto text-3xl font-bold text-center text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Killer Match History
      </motion.h1>

      <motion.div
        className="max-w-md mx-auto w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          placeholder="Search a killer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gradient-to-r from-black/80 to-red-950/40 border-2 text-white"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {noMatch ? (
          <motion.p
            key="no-match"
            className="font-roboto text-center text-2xl"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            No matches found
          </motion.p>
        ) : (
          displayMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              layout
            >
              <KillerMatchCard match={match} />
            </motion.div>
          ))
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
      <motion.h1
        className="font-roboto text-3xl font-bold text-center text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Survivor Match History
      </motion.h1>

      <motion.div
        className="max-w-md mx-auto w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          placeholder="Search a survivor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gradient-to-r from-black/80 to-blue-950/40 border-2 text-white"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {noMatch ? (
          <motion.p
            key="no-match"
            className="font-roboto text-center text-2xl"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            No matches found
          </motion.p>
        ) : (
          displayMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              layout
            >
              <SurvivorMatchCard match={match} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
