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

//import Image from "next/image";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="flex items-center gap-4 px-4 py-2 border-b justify-between">
      <Link href="/">
        Home
        {/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}
      </Link>
      <div>
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
          <Link href="/auth/signin">Sign In</Link>
        )}
      </div>
    </header>
  );
}
