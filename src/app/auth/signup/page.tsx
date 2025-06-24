"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, FormEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Loader } from "lucide-react";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    authClient.signUp.email(
      { email, name, password, callbackURL: "/auth/signin" },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          router.push("/");
        },
        onError: (ctx: { error: { message: string } }) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
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
              <Label>Username</Label>
              <Input
                name="name"
                id="name"
                type="name"
                placeholder="Your username"
                required
              />
            </div>
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
            {isLoading ? <Loader className="animate-spin" /> : "Sign up"}
          </Button>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center mt-2">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-indigo-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
