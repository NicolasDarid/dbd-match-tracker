import { LogoutButton } from "@/components/logout";
import { getUser } from "@/lib/auth-session";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">
          Vous devez être connecté pour accéder à cette page.
        </h2>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          <LogIn className="mr-2" />
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <LogoutButton className="button mt-4" />
    </div>
  );
}
