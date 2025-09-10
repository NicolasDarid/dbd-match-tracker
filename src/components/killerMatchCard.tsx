"use client";

import { KillerMatchWithRelations } from "@/types/match";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const KillerMatchCard = ({
  match,
}: {
  match: KillerMatchWithRelations;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string, side: "killer" | "survivor") => {
    setIsLoading(true);
    const response = await fetch("/api/match/add", {
      method: "DELETE",
      body: JSON.stringify({ id, side }),
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
      className="p-4 rounded-xl shadow-lg shadow-black/50 border border-red-800/60 font-roboto text-white transition-all duration-300 bg-gradient-to-br from-black to-red-950/60 hover:shadow-red-900/40"
    >
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl tracking-widest font-bold text-red-600 uppercase">
            {match.killer.name}
          </div>
          <div className="flex justify-end w-full">
            <Button
              disabled={isLoading}
              onClick={() => handleDelete(match.id, "killer")}
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
              className="rounded-md border border-red-900 shadow-inner"
            />
          ) : (
            <div>
              <Image
                src="/Placeholder_maps.webp"
                alt={match.map.name}
                width={100}
                height={100}
                className="rounded-md border border-red-900 shadow-inner"
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

        <div className="grid grid-cols-4 gap-4 mt-6 text-center text-lg font-semibold items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/Icon_sacrifices.png"
              alt="sacrifices"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="text-red-400">{match.numberOfKills}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/Icon_hooks.png"
              alt="hook"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="text-yellow-300">{match.numberOfHooks}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/Icon_generators.png"
              alt="generator"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="text-blue-400">{match.numberOfGeneratorsRemaining}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-300">Score</span>
            <p className="text-green-500">{match.score}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
