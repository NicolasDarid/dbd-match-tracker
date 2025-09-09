"use client";

import { useState, useEffect } from "react";

export type CookieConsent = "accepted" | "necessary-only" | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier le consentement stocké
    const storedConsent = localStorage.getItem(
      "cookie-consent"
    ) as CookieConsent;
    setConsent(storedConsent);
    setIsLoading(false);
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsent("accepted");
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary-only");
    setConsent("necessary-only");
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    setConsent(null);
  };

  return {
    consent,
    isLoading,
    acceptAll,
    acceptNecessary,
    resetConsent,
    hasConsent: consent !== null,
    canUseAnalytics: consent === "accepted",
  };
}
