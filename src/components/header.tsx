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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Home,
  BarChart3,
  Skull,
  Shield,
  FileText,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigationItems = [
    { href: "/", label: "History", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/analytics#killers-section", label: "Killer Stats", icon: Skull },
    {
      href: "/analytics#survivors-section",
      label: "Survivor Stats",
      icon: Shield,
    },
    { href: "/legal", label: "Legal", icon: FileText },
  ];

  return (
    <header className="relative bg-gradient-to-r from-gray-900/95 via-black/95 to-red-950/95 backdrop-blur-md border-b border-red-800/30 shadow-2xl shadow-red-900/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src={"/logo.png"}
                  alt="DBD Match Tracker"
                  width={48}
                  height={48}
                  className="rounded-lg border border-red-500/30 shadow-lg shadow-red-900/30 group-hover:shadow-red-900/50 transition-all duration-300"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white font-roboto">
                  DBD Match Tracker
                </h1>
                <p className="text-xs text-gray-400">Survivor or Hunter?</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-red-400 hover:bg-red-900/30 border border-transparent hover:border-red-500/50 transition-all duration-300 font-medium shadow-sm hover:shadow-red-900/20"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <CookieIndicator />

            {loading ? (
              <Button
                disabled
                variant="outline"
                className="border-white/30 text-white bg-gray-800/50"
              >
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                Loading...
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white bg-gray-800/50 hover:bg-red-900/30 hover:border-red-500/70 transition-all duration-300 shadow-sm hover:shadow-red-900/20"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800/95 backdrop-blur-md border border-red-500/30 shadow-xl">
                  <DropdownMenuItem asChild>
                    <LogoutButton className="w-full text-white hover:bg-red-900/20" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-900/50 border border-red-500/30">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:text-red-400 hover:bg-red-900/30 border border-transparent hover:border-red-500/30 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-red-800/30 bg-gray-900/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-red-400 hover:bg-red-900/30 border border-transparent hover:border-red-500/50 transition-all duration-300 font-medium"
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
