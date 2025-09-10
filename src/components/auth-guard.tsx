"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();

        if (session?.data?.user) {
          setIsAuthenticated(true);
        } else {
          // Rediriger vers la page de connexion avec l'URL de redirection
          const signInUrl = `/auth/signin?redirect=${encodeURIComponent(
            pathname
          )}`;
          router.push(signInUrl);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // En cas d'erreur, rediriger vers la page de connexion
        const signInUrl = `/auth/signin?redirect=${encodeURIComponent(
          pathname
        )}`;
        router.push(signInUrl);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">
              Vérification de l&apos;authentification...
            </p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection est en cours
  }

  return <>{children}</>;
}
