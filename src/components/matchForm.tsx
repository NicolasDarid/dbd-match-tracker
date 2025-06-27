"use client";
import {
  Killer,
  KillerPerk,
  Map,
  Survivor,
  SurvivorPerk,
} from "@/generated/prisma";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import { Book, CircleUserRound } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";

export const MatchForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  killerPerks: KillerPerk[];
  survivorPerks: SurvivorPerk[];
  maps: Map[];
}) => {
  "use client";
  const { killers, survivors, killerPerks, survivorPerks, maps } = props;
  const [killerSide, setKillerSide] = useState(false);

  const perks = killerSide ? killerPerks : survivorPerks;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Switch
          id="switchForm"
          name="switchForm"
          checked={killerSide}
          onCheckedChange={setKillerSide}
        />
        <Label htmlFor="switchForm">
          {killerSide ? "Killer Form" : "Survivor Form"}
        </Label>
      </div>
      {killerSide ? (
        <KillerForm
          killers={killers}
          survivors={survivors}
          perks={perks}
          maps={maps}
        />
      ) : (
        <SurvivorForm
          killers={killers}
          survivors={survivors}
          perks={perks}
          maps={maps}
        />
      )}
    </div>
  );
};

const KillerForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  perks: KillerPerk[];
  maps: Map[];
}) => {
  const { killers, survivors, perks, maps } = props;

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          <Label>Killer</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a killer" />
            </SelectTrigger>
            <SelectContent>
              {killers.map((killer) => (
                <SelectItem key={killer.id} value={killer.id}>
                  <Image
                    src={killer.image}
                    alt={killer.name}
                    width={50}
                    height={50}
                  />
                  {killer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4">
          <Label>Map</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select the map" />
            </SelectTrigger>
            <SelectContent>
              {maps.map((map) => (
                <SelectItem key={map.id} value={map.id}>
                  <Image
                    src={map.image}
                    alt={map.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  {map.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <Label>Survivors</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-4">
        <Label>Perks</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

const SurvivorForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  perks: SurvivorPerk[];
  maps: Map[];
}) => {
  const { killers, survivors, perks, maps } = props;

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          <Label>Your Survivor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your survivor" />
            </SelectTrigger>
            <SelectContent>
              {survivors.map((survivor) => (
                <SelectItem key={survivor.id} value={survivor.id}>
                  {survivor.image ? (
                    <Image
                      src={survivor.image}
                      alt={survivor.name}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <CircleUserRound />
                  )}

                  {survivor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4">
          <Label>Killer</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a killer" />
            </SelectTrigger>
            <SelectContent>
              {killers.map((killer) => (
                <SelectItem key={killer.id} value={killer.id}>
                  <Image
                    src={killer.image}
                    alt={killer.name}
                    width={50}
                    height={50}
                  />
                  {killer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4">
          <Label>Map</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select the map" />
            </SelectTrigger>
            <SelectContent>
              {maps.map((map) => (
                <SelectItem key={map.id} value={map.id}>
                  <Image
                    src={map.image}
                    alt={map.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  {map.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <Label>Survivors</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the survivors" />
          </SelectTrigger>
          <SelectContent>
            {survivors.map((survivor) => (
              <SelectItem key={survivor.id} value={survivor.id}>
                {survivor.image ? (
                  <Image
                    src={survivor.image}
                    alt={survivor.name}
                    width={50}
                    height={50}
                  />
                ) : (
                  <CircleUserRound />
                )}

                {survivor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-4">
        <Label>Perks</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select the perks" />
          </SelectTrigger>
          <SelectContent>
            {perks.map((perk) => (
              <SelectItem key={perk.id} value={perk.id}>
                {perk.image ? (
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={50}
                    height={50}
                    className="rounded-md bg-purple-900 border-2 border-black"
                  />
                ) : (
                  <Book />
                )}

                {perk.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
