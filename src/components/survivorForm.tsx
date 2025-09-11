"use client";
import {
  killer as Killer,
  survivor as Survivor,
  survivorPerk as SurvivorPerk,
  map as Map,
  survivorObject as SurvivorObject,
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
import { MapSelect } from "./mapSelect";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export const SurvivorFormWithQuery = (props: {
  survivors: Survivor[];
  killers: Killer[];
  perks: SurvivorPerk[];
  maps: Map[];
  offerings: SurvivorOffering[];
  objects: SurvivorObject[];
}) => {
  const { survivors, killers, perks, maps, offerings, objects } = props;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const survivorFormSchema = z.object({
    survivorId: z.string(),
    mapId: z.string(),
    killerId: z.string(),
    objectId: z.string().optional(),
    perks: z.array(z.string()),
    addOns: z.array(z.string()),
    offerings: z.array(z.string()),
    numberOfRescues: z.number().min(0).max(6),
    numberOfGeneratorsDone: z.number().min(0).max(5),
    score: z.number().min(0),
    escaped: z.boolean(),
  });

  const form = useForm<z.infer<typeof survivorFormSchema>>({
    resolver: zodResolver(survivorFormSchema),
    defaultValues: {
      survivorId: "",
      mapId: "",
      killerId: "",
      objectId: "",
      perks: [],
      addOns: [],
      offerings: [],
      numberOfRescues: 0,
      numberOfGeneratorsDone: 0,
      score: 0,
      escaped: false,
    },
  });

  const objectId = useWatch({
    control: form.control,
    name: "objectId",
  });

  const {
    data: addOns,
    isLoading: isAddOnsLoading,
    isError,
  } = useQuery({
    queryKey: ["survivorAddOns", objectId],
    queryFn: async () => {
      if (!objectId) return [];
      const res = await fetch(
        `/api/addons/survivorAddons?objectId=${objectId}`
      );
      if (!res.ok) throw new Error("Error during fetch add-ons");
      return res.json();
    },
    enabled: !!objectId,
    placeholderData: (previousData) => previousData,
  });

  const onSubmit = async (data: z.infer<typeof survivorFormSchema>) => {
    setIsLoading(true);
    const response = await fetch("/api/match/add", {
      method: "POST",
      body: JSON.stringify({
        match: data,
        side: "survivor",
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Survivor Selection */}
            <FormField
              control={form.control}
              name="survivorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
                    Survivor
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-700/80 border-border/50 !text-white hover:bg-gray-600/50 focus:ring-blue-500/50">
                        <SelectValue placeholder="Select a survivor" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {survivors.map((survivor) => (
                          <SelectItem
                            key={survivor.id}
                            value={survivor.id}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={survivor.image || "/Loading_survivor.webp"}
                                alt={survivor.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <span className="font-medium">
                                {survivor.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Map Selection */}
            <MapSelector maps={maps} />
            {/* Killer Selection */}
            <div className="flex min-lg:justify-end">
              <FormField
                control={form.control}
                name="killerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
                      Killer
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-gray-700/80 border-border/50 !text-white hover:bg-gray-600/50 focus:ring-red-500/50">
                          <SelectValue placeholder="Select a killer" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {killers.map((killer) => (
                            <SelectItem
                              key={killer.id}
                              value={killer.id}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={killer.image || "/Loading_killer.webp"}
                                  alt={killer.name}
                                  width={40}
                                  height={40}
                                  className="rounded"
                                />
                                <span className="font-medium">
                                  {killer.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Perks Section */}
          <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <PerkSelector perks={perks} />
          </div>

          {/* Object Section */}
          <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <FormField
              control={form.control}
              name="objectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
                    Item (Optional)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === "none" ? "" : value);
                      }}
                      value={field.value || "none"}
                    >
                      <SelectTrigger className="bg-gray-700/80 border-border/50 !text-white hover:bg-gray-600/50 focus:ring-blue-500/50">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem
                          value="none"
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src="/Placeholder_addons.webp"
                              alt="No item"
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <span className="font-medium">None</span>
                          </div>
                        </SelectItem>
                        {objects.map((object) => (
                          <SelectItem
                            key={object.id}
                            value={object.id}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={object.image || "/Placeholder_addons.webp"}
                                alt={object.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <span className="font-medium">{object.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* AddOns Section */}
          {isAddOnsLoading && (
            <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
              <p className="text-xl font-bold text-white mb-4">Add-ons</p>
              <Skeleton className="h-12 w-full rounded-md bg-gray-700/50" />
            </div>
          )}
          {isError && (
            <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
              <p className="text-red-400 text-sm">Failed to load add-ons.</p>
            </div>
          )}
          {addOns?.length > 0 && (
            <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
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
          <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <OfferingSelector offerings={offerings} />
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-blue-800/30 to-gray-700/10 border border-border/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Match Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Escaped */}
              <FormField
                control={form.control}
                name="escaped"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Escaped
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3 justify-center p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                        <Label className="text-white font-medium">
                          {field.value ? "Yes" : "No"}
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Number of Rescues */}
              <FormField
                control={form.control}
                name="numberOfRescues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Number of Rescues
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={4}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
                        placeholder="0-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Number of Generators Done */}
              <FormField
                control={form.control}
                name="numberOfGeneratorsDone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-white">
                      Generators Done
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
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
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-900/50 border border-blue-500/30 min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin w-5 h-5" />
                  <span>Adding match...</span>
                </div>
              ) : (
                "Add match"
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

const PerkSelector = (props: { perks: SurvivorPerk[] }) => {
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

const OfferingSelector = (props: { offerings: SurvivorOffering[] }) => {
  const { offerings } = props;
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="offerings"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl font-bold text-white flex items-center gap-2">
            Offerings
          </FormLabel>
          <FormControl>
            <AddOnMultiSelect
              addOns={offerings}
              value={offerings.filter((offering) =>
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
