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
import { Label } from "./ui/label";
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
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-xl font-bold">You were on :</h1>
          <Switch
            id="switchForm"
            name="switchForm"
            checked={killerSide}
            onCheckedChange={setKillerSide}
            className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-blue-500"
          />
          <Label htmlFor="switchForm">
            {killerSide ? "Killer Side" : "Survivor Side"}
          </Label>
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
