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
import { VisualHelper } from "./visualHelper";
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
    console.log(data);
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
      <VisualHelper variant="survivor" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-between items-center">
            {/* Survivor */}
            <FormField
              control={form.control}
              name="survivorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Survivor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a survivor" />
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
                                <Image
                                  src="/Loading_survivor.webp"
                                  alt={survivor.name}
                                  width={50}
                                  height={50}
                                />
                              )}
                              {survivor.name}
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
          </div>
          <div className="flex flex-row gap-4">
            {/* Perks */}
            <PerkSelector perks={perks} />
          </div>

          {/* Object */}
          <FormField
            control={form.control}
            name="objectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">
                  Object (Optional)
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "none" ? "" : value);
                  }}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an object" />
                      <SelectContent>
                        <SelectItem value="none">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/Placeholder_addons.webp"
                              alt="No object"
                              width={50}
                              height={50}
                            />
                            None
                          </div>
                        </SelectItem>
                        {objects.map((object) => (
                          <SelectItem key={object.id} value={object.id}>
                            {object.image ? (
                              <Image
                                src={object.image}
                                alt={object.name}
                                width={50}
                                height={50}
                              />
                            ) : (
                              <Image
                                src="/Placeholder_addons.webp"
                                alt={object.name}
                                width={50}
                                height={50}
                              />
                            )}
                            {object.name}
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

          <div className="flex flex-row gap-4">
            {/* Offerings */}
            <OfferingSelector offerings={offerings} />
          </div>

          <div className="flex flex-row gap-4 justify-between">
            {/* Escaped */}
            <FormField
              control={form.control}
              name="escaped"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Escaped</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 justify-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label>{field.value ? "Yes" : "No"}</Label>
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
                  <FormLabel className="text-lg font-bold">
                    Number of Rescues
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
            {/* Number of Generators Done */}
            <FormField
              control={form.control}
              name="numberOfGeneratorsDone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">
                    Number of Generators Done
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

          <Button type="submit" onClick={() => console.log("click")}>
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

const PerkSelector = (props: { perks: SurvivorPerk[] }) => {
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

const OfferingSelector = (props: { offerings: SurvivorOffering[] }) => {
  const { offerings } = props;
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="offerings"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-lg font-bold">Offerings</FormLabel>
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
