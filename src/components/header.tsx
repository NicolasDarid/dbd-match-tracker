"use client";

import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "./logout";
import CookieIndicator from "./cookieIndicator";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session?.data?.user || null);
      } catch (error) {
        setUser(null);
        toast.error("Error checking authentication", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className="relative flex items-center gap-4 px-4 py-2 border-b border-red-950 justify-between text-xl">
      <div className="flex flex-row gap-4 items-center">
        <Link href="/" className="cursor-pointer">
          <Image
            src={logo}
            alt="logo"
            width={64}
            height={64}
            className="rounded-md"
          />
        </Link>
        <Link href="/" className="cursor-pointer">
          <Button className="cursor-pointer">History</Button>
        </Link>
        <Link href="/stats/killer" className="cursor-pointer">
          <Button className="cursor-pointer">Killer Stats</Button>
        </Link>
        <Link href="/stats/survivor" className="cursor-pointer">
          <Button className="cursor-pointer">Survivor Stats</Button>
        </Link>
        <Link href="/legal" className="cursor-pointer">
          <Button className="cursor-pointer">Legal</Button>
        </Link>
      </div>

      <h1 className="max-sm:hidden min-lg:absolute min-lg:left-1/2 min-lg:top-1/2 min-lg:-translate-x-1/2 min-lg:-translate-y-1/2 font-roboto text-4xl font-bold text-white text-shadow-red-900 text-shadow-lg">
        DBD Match Tracker
      </h1>

      <div className="flex items-center gap-2">
        <CookieIndicator />
        {loading ? (
          <Button disabled>Loading...</Button>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user.name || user.email}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <LogoutButton className="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/signin">
            <Button className="cursor-pointer">Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
