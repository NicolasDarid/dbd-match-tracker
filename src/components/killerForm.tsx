"use client";
import { Killer, KillerPerk, Map } from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import { Loader } from "lucide-react";
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
import { VisualHelper } from "./visualHelper";
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
    keepPreviousData: true,
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
      <VisualHelper variant="killer" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-between items-center">
            {/* Killer */}
            <FormField
              control={form.control}
              name="killerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Killer</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a killer" />
                        <SelectContent>
                          {killers.map((killer) => (
                            <SelectItem key={killer.id} value={killer.id}>
                              {killer.image ? (
                                <Image
                                  src={killer.image}
                                  alt={killer.name}
                                  width={50}
                                  height={50}
                                />
                              ) : (
                                <Image
                                  src="/Loading_killer.webp"
                                  alt={killer.name}
                                  width={50}
                                  height={50}
                                />
                              )}
                              {killer.name}
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
            {/* Map */}
            <MapSelector maps={maps} />
          </div>
          <div className="flex flex-row gap-4">
            {/* Perks */}
            <PerkSelector perks={perks} />
          </div>

          {/* AddOns */}
          {isAddOnsLoading && (
            <div>
              <p className="text-lg font-bold">Add-ons</p>
              <Skeleton className="h-6 w-full rounded-md" />
            </div>
          )}
          {isError && (
            <p className="text-red-500 text-sm">Failed to load add-ons.</p>
          )}
          {addOns?.length > 0 && (
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="addOns"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-lg font-bold">Add-ons</FormLabel>
                    <FormControl>
                      <AddOnMultiSelect
                        addOns={addOns || []}
                        value={addOns.filter((addOn) =>
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
          <div className="flex flex-row gap-4">
            {/* Offering */}
            <OfferingSelector offering={offering} />
          </div>

          <div className="flex flex-row gap-4 justify-between">
            {/* Number of Hooks */}
            <FormField
              control={form.control}
              name="numberOfHooks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">
                    Number of Hooks
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={12}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel className="text-lg font-bold">
                    Number of Kills
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={4}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel className="text-lg font-bold">
                    Number of Generators Remaining
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel className="text-lg font-bold">Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : "Add Match"}
          </Button>
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
          <FormLabel className="text-lg font-bold">Map</FormLabel>
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
        <FormItem className="w-full">
          <FormLabel className="text-lg font-bold">Perks</FormLabel>
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
        <FormItem className="w-full">
          <FormLabel className="text-lg font-bold">Offering</FormLabel>
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
