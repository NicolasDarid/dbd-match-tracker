import { getUser } from "@/lib/auth-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "./logout";
import Image from "next/image";
import logo from "../../public/logo.png";

export default async function Header() {
  const user = await getUser();

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
        <Link href="/auth/stats/killer" className="cursor-pointer">
          <Button className="cursor-pointer">Killer Stats</Button>
        </Link>
        <Link href="/auth/stats/survivor" className="cursor-pointer">
          <Button className="cursor-pointer">Survivor Stats</Button>
        </Link>
        <Link href="/legal" className="cursor-pointer">
          <Button className="cursor-pointer">Legal</Button>
        </Link>
      </div>

      <h1 className="max-sm:hidden min-lg:absolute min-lg:left-1/2 min-lg:top-1/2 min-lg:-translate-x-1/2 min-lg:-translate-y-1/2 font-roboto text-4xl font-bold text-white text-shadow-red-900 text-shadow-lg">
        DBD Match Tracker
      </h1>

      <>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user.name || user.email}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={"/auth"}>My account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <LogoutButton className="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/auth/signin"
            className="text-primary bg-gray-100 hover:bg-gray-300 rounded-md px-2 py-1"
          >
            Sign In
          </Link>
        )}
      </>
    </header>
  );
}
