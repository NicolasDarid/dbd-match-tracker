"use client";
import {
  killer as Killer,
  killerPerk as KillerPerk,
  killerOffering as KillerOffering,
  map as Map,
  survivor as Survivor,
  survivorPerk as SurvivorPerk,
  survivorOffering as SurvivorOffering,
  survivorObject as SurvivorObject,
} from "@/generated/prisma";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { KillerFormWithQuery } from "./killerForm";
import { SurvivorFormWithQuery } from "./survivorForm";

export const MatchForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  killerPerks: KillerPerk[];
  survivorPerks: SurvivorPerk[];
  maps: Map[];
  killerOffering: KillerOffering[];
  survivorOffering: SurvivorOffering[];
  survivorObjects: SurvivorObject[];
}) => {
  const {
    killers,
    survivors,
    killerPerks,
    survivorPerks,
    killerOffering,
    survivorOffering,
    survivorObjects,
    maps,
  } = props;
  const [killerSide, setKillerSide] = useState(true);

  const perks = killerSide ? killerPerks : survivorPerks;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4 items-center justify-center bg-gradient-to-r from-blue-900/20 to-red-900/20 border border-border/50 rounded-xl p-4 shadow-lg w-full">
          <h1 className="text-xl font-bold text-white">You were :</h1>
          <div className="flex flex-row items-center gap-2">
            <span
              className={
                "px-3 py-1 rounded-lg font-semibold transition-all duration-200 " +
                (!killerSide
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-700 text-gray-400")
              }
            >
              Survivor
            </span>
            <Switch
              id="switchForm"
              name="switchForm"
              checked={killerSide}
              onCheckedChange={setKillerSide}
              className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-blue-500 shadow"
            />
            <span
              className={
                "px-3 py-1 rounded-lg font-semibold transition-all duration-200 " +
                (killerSide
                  ? "bg-red-600 text-white shadow"
                  : "bg-gray-700 text-gray-400")
              }
            >
              Killer
            </span>
          </div>
        </div>
      </div>
      {killerSide ? (
        <KillerFormWithQuery
          killers={killers}
          perks={perks}
          maps={maps}
          offering={killerOffering}
        />
      ) : (
        <SurvivorFormWithQuery
          killers={killers}
          survivors={survivors}
          perks={perks}
          maps={maps}
          offerings={survivorOffering}
          objects={survivorObjects}
        />
      )}
    </div>
  );
};
