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
import { Book, CircleUserRound, Loader } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PerkMultiSelect } from "./perkMultiSelect";
import { SurvivorSelectorGroup } from "./survivorSelectorGroup";
import { Input } from "./ui/input";
import { toast } from "sonner";

export const MatchForm = (props: {
  killers: Killer[];
  survivors: Survivor[];
  killerPerks: KillerPerk[];
  survivorPerks: SurvivorPerk[];
  maps: Map[];
}) => {
  const { killers, survivors, killerPerks, survivorPerks, maps } = props;
  const [killerSide, setKillerSide] = useState(false);
  // const router = useRouter();

  const perks = killerSide ? killerPerks : survivorPerks;

  // const survivorFormSchema = z.object({
  //   survivorId: z.string(),
  //   killerId: z.string(),
  //   survivorsIds: z.array(z.string()),
  //   mapId: z.string(),
  //   perks: z.array(z.string()),
  //   numberOfRescues: z.number().min(0).max(6),
  //   numberOfGeneratorsDone: z.number().min(0).max(5),
  //   score: z.number().min(0),
  // });

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

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const killerFormSchema = z.object({
    killerId: z.string(),
    mapId: z.string(),
    survivorsIds: z.array(z.string()).length(4),
    perks: z.array(z.string()),
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
                <Select onValueChange={field.onChange} value={field.value}>
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
          <FormField
            control={form.control}
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
        </div>
        <div className="flex flex-row gap-4">
          {/* Perks */}
          <FormField
            control={form.control}
            name="perks"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg font-bold">Perks</FormLabel>
                <FormControl>
                  <PerkMultiSelect
                    perks={perks}
                    value={perks.filter((perk) =>
                      field.value?.includes(perk.id)
                    )}
                    onChange={(selected) =>
                      field.onChange(selected.map((perk) => perk.id))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* AddOns */}
        {/* Offering */}
        <div className="flex flex-row gap-4">
          {/* Survivors */}
          <SurvivorSelectorGroup survivors={survivors} />
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
