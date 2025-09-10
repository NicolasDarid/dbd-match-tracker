import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MatchHistory } from "@/components/matchHistory";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <Card className="flex items-center justify-center max-h-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Please login to continue.
        </h2>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          <LogIn className="mr-2" />
          Login
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-gray-400/20 flex flex-row max-h-full gap-4 rounded-md">
      <Card className=" w-full m-4 backdrop-blur-md  inset-shadow-sm inset-shadow-gray-400/40 bg-white/10 border border-white/10 shadow-lg rounded-xl transition-all duration-300 hover:bg-white/15 hover:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-roboto text-center text-2xl text-white">
            {user.name}
          </CardTitle>
          {user.image ? (
            <Image src={user.image} alt={user.name} width={100} height={100} />
          ) : null}
          <Link href="/api/match">
            <Button className="font-roboto-condensed">Add Match</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <MatchHistory />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
