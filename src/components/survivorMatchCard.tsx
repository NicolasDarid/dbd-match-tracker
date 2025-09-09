"use client";

import { SurvivorMatchWithRelations } from "@/types/match";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import clsx from "clsx";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SurvivorMatchCard = (props: {
  match: SurvivorMatchWithRelations;
}) => {
  const { match } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string, side: "killer" | "survivor") => {
    setIsLoading(true);
    const response = await fetch("/api/match/add", {
      method: "DELETE",
      body: JSON.stringify({
        id,
        side,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    if (response.ok) {
      toast.success("Match deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete match");
    }
  };

  return (
    <Card
      key={match.id}
      className={clsx(
        "p-4 rounded-xl shadow-lg shadow-black/50 border border-blue-800/30 font-roboto text-white transition-all duration-300",
        match.survivorWin
          ? "bg-gradient-to-br from-zinc-900 via-black to-blue-950/40 hover:shadow-blue-900/40"
          : "bg-gradient-to-br from-zinc-900 via-black to-red-950/40 hover:shadow-red-900/40"
      )}
    >
      <CardContent>
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="text-2xl tracking-widest font-bold text-blue-600 uppercase">
            {match.survivor.name}
          </div>
          <div className="text-2xl tracking-widest font-bold text-red-600 uppercase">
            {match.killer.name}
          </div>
          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              onClick={() => {
                handleDelete(match.id, "survivor");
              }}
              variant={"destructive"}
              className="flex gap-2 items-center cursor-pointer"
            >
              {isLoading ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                <Trash className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          {match.survivor.image ? (
            <Image
              src={match.survivor.image}
              alt={match.survivor.name}
              width={100}
              height={100}
              className="rounded-md border border-blue-900 shadow-inner"
            />
          ) : (
            <div>
              <Image
                src="/Loading_survivor.webp"
                alt={match.survivor.name}
                width={100}
                height={100}
                className="rounded-md border border-blue-900 shadow-inner"
              />
            </div>
          )}
          {match.killer.image ? (
            <Image
              src={match.killer.image}
              alt={match.killer.name}
              width={100}
              height={100}
              className="rounded-md border border-red-900 shadow-inner"
            />
          ) : (
            <div>
              <Image
                src="/Loading_killer.webp"
                alt={match.killer.name}
                width={100}
                height={100}
                className="rounded-md border border-red-900 shadow-inner"
              />
            </div>
          )}
          {match.map.image ? (
            <Image
              src={match.map.image}
              alt={match.map.name}
              width={100}
              height={100}
              className="rounded-md border border-green-900 shadow-inner"
            />
          ) : (
            <div>
              <Image
                src="/Placeholder_maps.webp"
                alt={match.map.name}
                width={100}
                height={100}
                className="rounded-md border border-green-900 shadow-inner"
              />
              <span>{match.map.name}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mt-4 gap-6">
          <div className="grid grid-cols-2 gap-2">
            {match.perks.map((perk) =>
              perk.image ? (
                <div key={perk.id} className="flex flex-col items-center">
                  <Image
                    src={perk.image}
                    alt={perk.name}
                    width={60}
                    height={60}
                    className="rounded-sm border border-purple-900 shadow-md shadow-black/60"
                  />
                  <span>{perk.name}</span>
                </div>
              ) : (
                <div key={perk.id} className="flex flex-col items-center">
                  <Image
                    src="/Placeholder_perks.webp"
                    alt={perk.name}
                    width={60}
                    height={60}
                    className="rounded-sm border border-purple-900 shadow-md shadow-black/60"
                  />
                  <span>{perk.name}</span>
                </div>
              )
            )}
          </div>

          {match.survivorObject && (
            <div className="flex flex-col gap-2">
              {match.survivorObject.image ? (
                <div
                  key={match.survivorObject.id}
                  className="flex flex-col items-center"
                >
                  <Image
                    src={match.survivorObject.image}
                    alt={match.survivorObject.name}
                    width={60}
                    height={60}
                    className="rounded-sm border border-amber-500/30 bg-amber-100/10 shadow"
                  />
                  <span>{match.survivorObject.name}</span>
                </div>
              ) : (
                <div
                  key={match.survivorObject.id}
                  className="flex flex-col items-center"
                >
                  <Image
                    src="/Placeholder_objects.webp"
                    alt={match.survivorObject.name}
                    width={60}
                    height={60}
                    className="rounded-sm border border-amber-500/30 bg-amber-100/10 shadow"
                  />
                  <span>{match.survivorObject.name}</span>
                </div>
              )}
            </div>
          )}

          {match.addOns?.length > 0 && (
            <div className="flex flex-col gap-2">
              {match.addOns.map((addOn) =>
                addOn.image ? (
                  <div key={addOn.id} className="flex flex-col items-center">
                    <Image
                      src={addOn.image}
                      alt={addOn.name}
                      width={60}
                      height={60}
                      className="rounded-sm border border-amber-500/30 bg-amber-100/10 shadow"
                    />
                    <span>{addOn.name}</span>
                  </div>
                ) : (
                  <div key={addOn.id} className="flex flex-col items-center">
                    <Image
                      src="/Placeholder_addons.webp"
                      alt={addOn.name}
                      width={60}
                      height={60}
                      className="rounded-sm border border-amber-500/30 bg-amber-100/10 shadow"
                    />
                    <span>{addOn.name}</span>
                  </div>
                )
              )}
            </div>
          )}

          {match.offerings?.length > 0 && (
            <div className="flex flex-col gap-2">
              {match.offerings.map((offering) =>
                offering.image ? (
                  <div key={offering.id} className="flex flex-col items-center">
                    <Image
                      src={offering.image}
                      alt={offering.name}
                      width={60}
                      height={60}
                      className="rounded-sm border border-green-600/30 bg-green-300/10 shadow"
                    />
                    <span>{offering.name}</span>
                  </div>
                ) : (
                  <div key={offering.id} className="flex flex-col items-center">
                    <Image
                      src="/Placeholder_offerings.webp"
                      alt={offering.name}
                      width={60}
                      height={60}
                      className="rounded-sm border border-green-600/30 bg-green-300/10 shadow"
                    />
                    <span>{offering.name}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center text-lg font-semibold items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/Icon_saves.png"
              alt="rescues"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="text-green-400">{match.numberOfRescues}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/Icon_generators.png"
              alt="generator"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="text-blue-400">{match.numberOfGeneratorsDone}</p>
          </div>
          <div className="flex flex-col items-center text-lg">
            <span className="text-gray-300 ">Score</span>
            <p className="text-green-500">{match.score}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
