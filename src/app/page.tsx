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
    <Card className="max-w-3xl mx-auto bg-gradient-to-l from-gray-200/40 to-gray-200/40 via-gray-300/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-roboto text-center text-2xl">
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
  );
}
