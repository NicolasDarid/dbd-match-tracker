"use client";
import { KillerMatch, MatchHistory, SurvivorMatch } from "@/generated/prisma";
import { KillerMatchCard } from "./killerMatchCard";
import { SurvivorMatchCard } from "./survivorMatchCard";
import { Suspense, useState } from "react";
import { Button } from "./ui/button";
import clsx from "clsx";

export const MatchHistoryClient = ({
  matchHistory,
}: {
  matchHistory: MatchHistory;
}) => {
  const [side, setSide] = useState(true);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row gap-4 w-full justify-center">
        <Button
          onClick={() => setSide(true)}
          variant="outline"
          className={clsx({
            "bg-red-300": side,
          })}
        >
          Killer Match History
        </Button>
        <Button
          onClick={() => setSide(false)}
          variant="outline"
          className={clsx({
            "bg-blue-300": !side,
          })}
        >
          Survivor Match History
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {side ? (
          <KillerMatchHistory matches={matchHistory.killerMatches} />
        ) : (
          <SurvivorMatchHistory matches={matchHistory.survivorMatches} />
        )}
      </Suspense>
    </div>
  );
};

const KillerMatchHistory = ({ matches }: { matches: KillerMatch[] }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-bold text-center">Killer Match History</h1>
        <p className="text-center">No matches found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold text-center">Killer Match History</h1>
      {matches.map((match) => {
        return <KillerMatchCard match={match} key={match.id} />;
      })}
    </div>
  );
};

const SurvivorMatchHistory = ({ matches }: { matches: SurvivorMatch[] }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-bold text-center">
          Survivor Match History
        </h1>
        <p className="text-center">No matches found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold text-center">Survivor Match History</h1>
      {matches.map((match) => {
        return <SurvivorMatchCard match={match} key={match.id} />;
      })}
    </div>
  );
};
