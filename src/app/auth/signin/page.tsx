"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, FormEventHandler, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Loader } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          // Récupérer l'URL de redirection depuis les paramètres de requête
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get("redirect") || "/";
          router.push(redirectTo);
          router.refresh();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Ignorer les erreurs, l'utilisateur n'est pas connecté
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const event = {
      onRequest: () => setIsLoading(true),
      onSuccess: () => {
        setIsLoading(false);
        // Récupérer l'URL de redirection depuis les paramètres de requête
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "/";
        router.push(redirectTo);
        router.refresh();
      },
      onError: (ctx: { error: { message: string } }) => {
        toast.error(ctx.error.message);
        setIsLoading(false);
      },
    };
    authClient.signIn.email({ email, password }, event);
  };
  return (
    <Card className="w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="*:not-first:mt-2">
              <Label>Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="hi@youremail.com"
                required
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label>Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-indigo-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
