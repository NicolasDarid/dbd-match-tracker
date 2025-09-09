"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Settings } from "lucide-react";
import Link from "next/link";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function CookieBanner() {
  const [showDetails, setShowDetails] = useState(false);
  const { consent, isLoading, acceptAll, acceptNecessary } = useCookieConsent();

  const openSettings = () => {
    setShowDetails(!showDetails);
  };

  // Ne pas afficher si en cours de chargement ou si l'utilisateur a déjà donné son consentement
  if (isLoading || consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900/95 to-gray-800/95 border border-white/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="h-8 w-8 text-yellow-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Cookie Usage
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                We use cookies to make our application work and improve your
                experience. Essential cookies are necessary for authentication
                and user session functionality.
              </p>

              {showDetails && (
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-3">
                    Types of cookies used:
                  </h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>
                        <strong>Essential cookies:</strong> Authentication, user
                        session, security
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>
                        <strong>Preference cookies:</strong> Application
                        settings
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>
                        <strong>Analytics cookies:</strong> Usage statistics
                        (optional)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-3">
                    For more information, see our{" "}
                    <Link
                      href="/legal"
                      className="text-blue-400 hover:underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Accept all cookies
                </Button>

                <Button
                  onClick={acceptNecessary}
                  variant="outline"
                  className="border-white/30 hover:bg-white/10"
                >
                  Essential cookies only
                </Button>

                <Button
                  onClick={openSettings}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {showDetails ? "Hide" : "Settings"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
