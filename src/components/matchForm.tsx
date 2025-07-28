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
import { Loader } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";
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
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PerkMultiSelect } from "./perkMultiSelect";
import { SurvivorSelectorGroup } from "./survivorSelectorGroup";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { AddOnMultiSelect } from "./addOnMultiSelect";
import { VisualHelper } from "./visualHelper";

export const MatchForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  killerPerks: KillerPerk[];
  survivorPerks: SurvivorPerk[];
  maps: Map[];
  killerOffering: KillerOffering;
  survivorOffering: SurvivorOffering;
  survivorAddOns: SurvivorAddOn[];
}) => {
  const {
    killers,
    survivors,
    killerPerks,
    survivorPerks,
    killerOffering,
    survivorOffering,
    survivorAddOns,
    maps,
  } = props;
  const [killerSide, setKillerSide] = useState(false);

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
        <KillerForm
          killers={killers}
          survivors={survivors}
          perks={perks}
          maps={maps}
          offering={killerOffering}
        />
      ) : (
        <SurvivorForm
          killers={killers}
          survivors={survivors}
          perks={perks}
          maps={maps}
          offering={survivorOffering}
          addOns={survivorAddOns}
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
  offering: KillerOffering[];
}) => {
  const { killers, survivors, perks, maps, offering } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedKiller, setSelectedKiller] = useState<Killer | null>(null);
  const router = useRouter();

  const killerFormSchema = z.object({
    killerId: z.string(),
    mapId: z.string(),
    survivorsIds: z.array(z.string()).length(4),
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
      survivorsIds: [],
      perks: [],
      addOns: [],
      offering: [],
      numberOfKills: 0,
      numberOfHooks: 0,
      numberOfGeneratorsRemaining: 0,
      score: 0,
    },
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
                      setSelectedKiller(
                        killers.find((killer) => killer.id === value) || null
                      );
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a killer" />
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
          <div className="flex flex-row gap-4">
            {/* AddOns */}
            <FormField
              control={form.control}
              name="addOns"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-bold">Add-ons</FormLabel>
                  <FormControl>
                    <AddOnMultiSelect
                      addOns={selectedKiller?.addOns || []}
                      value={selectedKiller?.addOns.filter((addOn) =>
                        field.value?.includes(addOn.id)
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((addOn) => addOn.id))
                      }
                      text="Add-on(s)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4">
            {/* Offering */}
            <OfferingSelector offering={offering} />
          </div>
          <div className="flex flex-row gap-4">
            {/* Survivors */}
            <SurvivorSelectorGroup survivors={survivors} variant="killer" />
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

const SurvivorForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  perks: KillerPerk[];
  maps: Map[];
  offering: SurvivorOffering[];
  addOns: SurvivorAddOn[];
}) => {
  const { killers, survivors, perks, maps, offering, addOns } = props;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const survivorFormSchema = z.object({
    survivorId: z.string(),
    killerId: z.string(),
    survivorsIds: z.array(z.string()),
    mapId: z.string(),
    perks: z.array(z.string()),
    addOns: z.array(z.string()),
    offering: z.array(z.string()),
    numberOfRescues: z.number().min(0).max(6),
    numberOfGeneratorsDone: z.number().min(0).max(5),
    score: z.number().min(0),
    escaped: z.boolean(),
  });

  const form = useForm<z.infer<typeof survivorFormSchema>>({
    resolver: zodResolver(survivorFormSchema),
    defaultValues: {
      survivorId: "",
      killerId: "",
      mapId: "",
      survivorsIds: [],
      perks: [],
      addOns: [],
      offering: [],
      numberOfRescues: 0,
      numberOfGeneratorsDone: 0,
      score: 0,
      escaped: false,
    },
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
      <VisualHelper variant="survivor" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-between items-center">
            {/* Main Survivor */}
            <FormField
              control={form.control}
              name="survivorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold" htmlFor="survivor">
                    Your survivor
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    id="survivor"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a survivor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {survivors.map((survivor) => (
                        <SelectItem key={survivor.id} value={survivor.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={survivor.image}
                              alt={survivor.name}
                              width={32}
                              height={32}
                            />
                            {survivor.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          <div className="flex flex-row gap-4">
            {/* AddOns */}
            <FormField
              control={form.control}
              name="addOns"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-bold">Add-ons</FormLabel>
                  <FormControl>
                    <AddOnMultiSelect
                      addOns={addOns}
                      value={addOns.filter((addOn) =>
                        field.value?.includes(addOn.id)
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((addOn) => addOn.id))
                      }
                      text="Add-on(s)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-4">
            {/* Offering */}
            <OfferingSelector offering={offering} />
          </div>
          <div className="flex flex-row gap-4">
            {/* Survivors */}
            <SurvivorSelectorGroup survivors={survivors} variant="survivor" />
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
                      max={6}
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : "Add Match"}
          </Button>
        </form>
      </Form>
    </>
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a map" />
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
              </SelectTrigger>
            </FormControl>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
