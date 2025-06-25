import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="flex flex-col items-center justify-center max-h-full max-w-4xl mx-auto">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{user.name}</CardTitle>
          {user.image ? (
            <Image src={user.image} alt={user.name} width={100} height={100} />
          ) : null}
        </CardHeader>
      </Card>
    </div>
  );
}
