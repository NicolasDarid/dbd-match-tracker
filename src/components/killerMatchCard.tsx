// "use client";

// import { KillerMatch } from "@/generated/prisma";
// import { Card, CardContent, CardFooter } from "./ui/card";
// import Image from "next/image";
// import clsx from "clsx";
// import { Loader, Trash } from "lucide-react";
// import { useState } from "react";
// import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export const KillerMatchCard = (props: { match: KillerMatch }) => {
//   const { match } = props;
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleDelete = async (id: string, side: "killer" | "survivor") => {
//     setIsLoading(true);
//     const response = await fetch("/api/match/add", {
//       method: "DELETE",
//       body: JSON.stringify({
//         id,
//         side,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     setIsLoading(false);
//     if (response.ok) {
//       toast.success("Match deleted successfully");
//       router.refresh();
//     } else {
//       toast.error("Failed to delete match");
//     }
//   };

//   return (
//     <Card
//       key={match.id}
//       className={clsx(
//         "p-4 shadow-md border-2 border-red-950 font-roboto text-white font-bold",
//         match.killerWin
//           ? "bg-gradient-to-r from-black/80 to-red-950/40"
//           : "bg-gradient-to-r from-black/80 to-red-950/40"
//       )}
//     >
//       <CardContent>
//         <div className="flex flex-row justify-between items-center">
//           <Image
//             src={match.killer.image}
//             alt={match.killer.name}
//             width={150}
//             height={150}
//           />
//           <Image
//             src={match.map.image}
//             alt={match.map.name}
//             width={150}
//             height={150}
//           />
//         </div>
//         <div className="flex flex-row gap-4 justify-between">
//           <div className="grid grid-cols-2 gap-2">
//             {match.perks.map((perk) => (
//               <div key={perk.id}>
//                 <Image
//                   src={perk.image}
//                   alt={perk.name}
//                   width={75}
//                   height={75}
//                   className="rounded-md bg-purple-900 border-2 border-black"
//                 />
//               </div>
//             ))}
//           </div>
//           {match.addOns?.length > 0 && (
//             <div className="flex flex-col gap-2 items-center">
//               {match.addOns.map((addOn) => (
//                 <div key={addOn.id}>
//                   <Image
//                     src={addOn.image}
//                     alt={addOn.name}
//                     width={75}
//                     height={75}
//                     className="rounded-md bg-amber-200/50 border-2 border-black"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//           {match.offerings?.length > 0 && (
//             <div className="flex flex-row gap-2 items-center">
//               {match.offerings.map((offering) => (
//                 <div key={offering.id}>
//                   <Image
//                     src={offering.image}
//                     alt={offering.name}
//                     width={75}
//                     height={75}
//                     className="rounded-md bg-green-400 border-2 border-black"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="flex flex-row justify-between items-center mt-4">
//           <div className="flex flex-row gap-2 items-center">
//             <Image
//               src="/icon_sacrifices.png"
//               alt="sacrifices"
//               width={50}
//               height={50}
//               className="rounded-md"
//             />
//             <p>{match.numberOfKills}</p>
//           </div>
//           <div className="flex flex-row gap-2 items-center">
//             <Image
//               src="/icon_hooks.png"
//               alt="hook"
//               width={50}
//               height={50}
//               className="rounded-md"
//             />
//             <p>{match.numberOfHooks}</p>
//           </div>
//           <div className="flex flex-row gap-2 items-center">
//             <Image
//               src="/icon_generators.png"
//               alt="generator"
//               width={50}
//               height={50}
//               className="rounded-md"
//             />
//             <p>{match.numberOfGeneratorsRemaining}</p>
//           </div>
//           <p>
//             Score : <span className="font-bold">{match.score}</span>
//           </p>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <div className="flex justify-end m-auto w-full">
//           <Button
//             disabled={isLoading}
//             onClick={() => {
//               handleDelete(match.id, "killer");
//             }}
//             variant={"destructive"}
//           >
//             {isLoading ? <Loader className="animate-spin" /> : <Trash />}
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

"use client";

import { KillerMatch } from "@/generated/prisma";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import clsx from "clsx";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const KillerMatchCard = ({ match }: { match: KillerMatch }) => {
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
      className={clsx(
        "p-4 rounded-xl shadow-lg shadow-black/50 border border-red-800/30 font-roboto text-white transition-all duration-300",
        "bg-gradient-to-br from-zinc-900 via-black to-red-950/40 hover:shadow-red-900/40"
      )}
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
          <Image
            src={match.killer.image}
            alt={match.killer.name}
            width={150}
            height={150}
            className="rounded-md border border-red-900 shadow-inner"
          />
          <Image
            src={match.map.image}
            alt={match.map.name}
            width={150}
            height={150}
            className="rounded-md border border-red-900 shadow-inner"
          />
        </div>

        <div className="flex justify-between items-start mt-4 gap-6">
          <div className="grid grid-cols-2 gap-2">
            {match.perks.map((perk) => (
              <Image
                key={perk.id}
                src={perk.image}
                alt={perk.name}
                width={60}
                height={60}
                className="rounded-sm border border-purple-900 shadow-md shadow-black/60"
              />
            ))}
          </div>

          {match.addOns?.length > 0 && (
            <div className="flex flex-col gap-2">
              {match.addOns.map((addOn) => (
                <Image
                  key={addOn.id}
                  src={addOn.image}
                  alt={addOn.name}
                  width={60}
                  height={60}
                  className="rounded-sm border border-amber-500/30 bg-amber-100/10 shadow"
                />
              ))}
            </div>
          )}

          {match.offerings?.length > 0 && (
            <div className="flex flex-col gap-2">
              {match.offerings.map((offering) => (
                <Image
                  key={offering.id}
                  src={offering.image}
                  alt={offering.name}
                  width={60}
                  height={60}
                  className="rounded-sm border border-green-600/30 bg-green-300/10 shadow"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 text-center text-sm font-semibold items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/icon_sacrifices.png"
              alt="sacrifices"
              width={40}
              height={40}
              className="rounded-md"
            />
            <p className="text-red-400">{match.numberOfKills}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/icon_hooks.png"
              alt="hook"
              width={40}
              height={40}
              className="rounded-md"
            />
            <p className="text-yellow-300">{match.numberOfHooks}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/icon_generators.png"
              alt="generator"
              width={40}
              height={40}
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
