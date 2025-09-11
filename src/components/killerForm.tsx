"use client";
import {
  killer as Killer,
  killerPerk as KillerPerk,
  killerOffering as KillerOffering,
  map as Map,
  survivorPerk as SurvivorPerk,
  survivorOffering as SurvivorOffering,
} from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import { Loader, Skull } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PerkMultiSelect } from "./perkMultiSelect";

import { Input } from "./ui/input";
import { toast } from "sonner";
import { AddOnMultiSelect } from "./addOnMultiSelect";
import { MapSelect } from "./mapSelect";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

export const KillerFormWithQuery = (props: {
  killers: Killer[];
  perks: KillerPerk[];
  maps: Map[];
  offering: KillerOffering[];
}) => {
  const { killers, perks, maps, offering } = props;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const killerFormSchema = z.object({
    killerId: z.string(),
    mapId: z.string(),
    perks: z.array(z.string()),
    addOns: z.array(z.string()),
    offering: z.array(z.string()),
    numberOfKills: z.number().min(0).max(4),
    numberOfHooks: z.number().min(0).max(12),
    numberOfGeneratorsRemaining: z.number().min(0).max(5),
    score: z.number().min(0),
  });

  const form = useForm<z.infer<typeof killerFormSchema>>({
    resolver: zodResolver(killerFormSchema),
    defaultValues: {
      killerId: "",
      mapId: "",
      perks: [],
      addOns: [],
      offering: [],
      numberOfKills: 0,
      numberOfHooks: 0,
      numberOfGeneratorsRemaining: 0,
      score: 0,
    },
  });

  const killerId = useWatch({
    control: form.control,
    name: "killerId",
  });

  const {
    data: addOns,
    isLoading: isAddOnsLoading,
    isError,
  } = useQuery({
    queryKey: ["killerAddOns", killerId],
    queryFn: async () => {
      if (!killerId) return [];
      const res = await fetch(`/api/addons/killerAddons?killerId=${killerId}`);
      if (!res.ok) throw new Error("Error during fetch add-ons");
      return res.json();
    },
    enabled: !!killerId, // évite d'appeler si killerId vide
    placeholderData: (previousData) => previousData,
  });

  const onSubmit = async (data: z.infer<typeof killerFormSchema>) => {
    setIsLoading(true);
    const response = await fetch("/api/match/add", {
      method: "POST",
      body: JSON.stringify({
        match: data,
        side: "killer",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    if (response.ok) {
      toast.success("Match added successfully");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Failed to add match");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Character and Map Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Killer Selection */}
            <FormField
              control={form.control}
              name="killerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
                    Killer
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700/80 border-border/50 !text-white hover:bg-gray-600/50 focus:ring-red-500/50">
                        <SelectValue placeholder="Select a killer" />
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {killers.map((killer) => (
                            <SelectItem
                              key={killer.id}
                              value={killer.id}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                {killer.image ? (
                                  <Image
                                    src={killer.image}
                                    alt={killer.name}
                                    width={40}
                                    height={40}
                                    className="rounded border border-red-500/50"
                                  />
                                ) : (
                                  <Image
                                    src="/Loading_killer.webp"
                                    alt={killer.name}
                                    width={40}
                                    height={40}
                                    className="rounded border border-red-500/50"
                                  />
                                )}
                                <span className="font-medium">
                                  {killer.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Map Selection */}
            <MapSelector maps={maps} />
          </div>
          {/* Perks Section */}
          <div className="bg-gradient-to-r from-red-800/20 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <PerkSelector perks={perks} />
          </div>

          {/* AddOns Section */}
          {isAddOnsLoading && (
            <div className="bg-gradient-to-r from-gray-800/20 to-gray-700/10 border border-gray-500/30 rounded-xl p-6">
              <p className="text-xl font-bold text-white mb-4">Add-ons</p>
              <Skeleton className="h-12 w-full rounded-md bg-gray-700/50" />
            </div>
          )}
          {isError && (
            <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl p-6">
              <p className="text-red-400 text-sm">Failed to load add-ons.</p>
            </div>
          )}
          {addOns?.length > 0 && (
            <div className="bg-gradient-to-r from-red-800/20 to-gray-700/10 border border-border/30 rounded-xl p-6">
              <FormField
                control={form.control}
                name="addOns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-white">
                      Add-ons
                    </FormLabel>
                    <FormControl>
                      <AddOnMultiSelect
                        addOns={addOns || []}
                        value={addOns.filter((addOn: { id: string }) =>
                          field.value?.includes(addOn.id)
                        )}
                        onChange={(selected) =>
                          field.onChange(selected.map((addOn) => addOn.id))
                        }
                        text="Add-on(s)"
                        maxSelections={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Offering Section */}
          <div className="bg-gradient-to-r from-red-800/20 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <OfferingSelector offering={offering} />
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-red-800/20 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-400" />
              Match Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Number of Hooks */}
              <FormField
                control={form.control}
                name="numberOfHooks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Number of Hooks
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50"
                        placeholder="0-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Number of Kills */}
              <FormField
                control={form.control}
                name="numberOfKills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Number of Kills
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={4}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50"
                        placeholder="0-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Number of Generators Remaining */}
              <FormField
                control={form.control}
                name="numberOfGeneratorsRemaining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Generators Left
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50"
                        placeholder="0-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Score */}
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Score
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50"
                        placeholder="0+"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-900/50 border border-red-500/30 min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin w-5 h-5" />
                  <span>Adding Match...</span>
                </div>
              ) : (
                "Add Match"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

const MapSelector = (props: { maps: Map[] }) => {
  const { maps } = props;
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="mapId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
            Map
          </FormLabel>
          <FormControl>
            <MapSelect
              maps={maps}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PerkSelector = (props: { perks: KillerPerk[] | SurvivorPerk[] }) => {
  const { perks } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="perks"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
            Perks
          </FormLabel>
          <FormControl>
            <PerkMultiSelect
              perks={perks}
              value={perks.filter((perk) => field.value?.includes(perk.id))}
              onChange={(selected) =>
                field.onChange(selected.map((perk) => perk.id))
              }
              maxSelections={4}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const OfferingSelector = (props: {
  offering: KillerOffering[] | SurvivorOffering[];
}) => {
  const { offering } = props;
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="offering"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
            Offering
          </FormLabel>
          <FormControl>
            <AddOnMultiSelect
              addOns={offering}
              value={offering.filter((offering) =>
                field.value?.includes(offering.id)
              )}
              onChange={(selected) =>
                field.onChange(selected.map((offering) => offering.id))
              }
              text="Offering"
              maxSelections={1}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
