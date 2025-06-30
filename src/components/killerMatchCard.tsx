import { KillerMatch } from "@/generated/prisma";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import clsx from "clsx";

// const prisma = new PrismaClient();

export const KillerMatchCard = (props: { match: KillerMatch }) => {
  const { match } = props;

  return (
    <Card
      key={match.id}
      className={clsx(
        "p-4 shadow-md ",
        match.killerWin
          ? "bg-gradient-to-r from-slate-50/60 to-blue-200"
          : "bg-gradient-to-r from-slate-50/60 to-red-200"
      )}
    >
      <CardContent>
        <div className="flex flex-row justify-between items-center">
          <Image
            src={match.killer.image}
            alt={match.killer.name}
            width={150}
            height={150}
          />
          <Image
            src={match.map.image}
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
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/icon_sacrifices.png"
              alt="sacrifices"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p>{match.numberOfKills}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/icon_hooks.png"
              alt="hook"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p>{match.numberOfHooks}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/icon_generators.png"
              alt="generator"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p>{match.numberOfGeneratorsRemaining}</p>
          </div>
          <p>
            Score : <span className="font-bold">{match.score}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
