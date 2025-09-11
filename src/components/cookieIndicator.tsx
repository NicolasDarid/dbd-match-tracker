"use client";

import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CookieSettings from "@/components/cookieSettings";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function CookieIndicator() {
  const { consent, isLoading } = useCookieConsent();

  // Ne pas afficher si en cours de chargement
  if (isLoading) return null;

  // Ne pas afficher si l'utilisateur n'a pas encore donné son consentement
  if (consent === null) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
          title="Paramètres des cookies"
        >
          <Cookie className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <CookieSettings />
      </DialogContent>
    </Dialog>
  );
}
