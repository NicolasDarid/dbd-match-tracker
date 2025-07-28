import { SurvivorMatch } from "@/generated/prisma";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";
import clsx from "clsx";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SurvivorMatchCard = (props: { match: SurvivorMatch }) => {
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
        "p-4 shadow-md border-2 border-red-950",
        match.survivorWin
          ? "bg-gradient-to-r from-slate-50/60 to-blue-200"
          : "bg-gradient-to-r from-slate-50/60 to-red-200"
      )}
    >
      <CardContent>
        <div className="flex flex-row justify-between items-center">
          <Image
            src={match.survivor.image || ""}
            alt={match.survivor.name}
            width={150}
            height={150}
          />
          <Image
            src={match.killer.image || ""}
            alt={match.killer.name}
            width={150}
            height={150}
          />
          <Image
            src={match.map.image || ""}
            alt={match.map.name}
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-row justify-between px-6 py-2">
          {match.perks.map((perk) => (
            <div key={perk.id}>
              <Image
                src={perk.image}
                alt={perk.name}
                width={75}
                height={75}
                className="rounded-md bg-purple-900 border-2 border-black"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          {match.addOns?.length > 0 && (
            <div className="flex flex-row gap-2 items-center">
              {match.addOns.map((addOn) => (
                <div key={addOn.id}>
                  <Image
                    src={addOn.image}
                    alt={addOn.name}
                    width={75}
                    height={75}
                    className="rounded-md bg-amber-200/50 border-2 border-black"
                  />
                </div>
              ))}
            </div>
          )}
          {match.offerings?.length > 0 && (
            <div className="flex flex-row gap-2 items-center">
              {match.offerings.map((offering) => (
                <div key={offering.id}>
                  <Image
                    src={offering.image}
                    alt={offering.name}
                    width={75}
                    height={75}
                    className="rounded-md bg-green-200 border-2 border-black"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/icon_sacrifices.png"
              alt="sacrifices"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p>{match.numberOfRescues}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/icon_generators.png"
              alt="generator"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p>{match.numberOfGeneratorsDone}</p>
          </div>
          <p>
            Score : <span className="font-bold">{match.score}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end m-auto w-full">
          <Button
            disabled={isLoading}
            onClick={() => {
              handleDelete(match.id, "survivor");
            }}
            variant={"destructive"}
          >
            {isLoading ? <Loader className="animate-spin" /> : <Trash />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
