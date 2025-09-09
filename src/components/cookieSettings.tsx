"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Shield, BarChart3, Settings2 } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

interface CookieSettingsProps {
  onClose?: () => void;
}

export default function CookieSettings({ onClose }: CookieSettingsProps) {
  const { consent, acceptAll, acceptNecessary, resetConsent } =
    useCookieConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    consent === "accepted"
  );

  const handleSave = () => {
    if (analyticsEnabled) {
      acceptAll();
    } else {
      acceptNecessary();
    }
    onClose?.();
  };

  const handleReset = () => {
    resetConsent();
    setAnalyticsEnabled(false);
  };

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Cookie className="h-6 w-6 text-yellow-400" />
          Cookie Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cookies essentiels */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-400" />
            <div className="flex-1">
              <Label className="text-white font-medium">
                Essential cookies
              </Label>
              <p className="text-white/70 text-sm">
                Necessary for application functionality (authentication,
                session)
              </p>
            </div>
            <Switch checked={true} disabled className="opacity-50" />
          </div>
        </div>

        {/* Cookies analytiques */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <div className="flex-1">
              <Label className="text-white font-medium">
                Analytics cookies
              </Label>
              <p className="text-white/70 text-sm">
                Help us understand how you use the application
              </p>
            </div>
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={setAnalyticsEnabled}
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start gap-3">
            <Settings2 className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="mb-2">
                <strong>Essential cookies:</strong> Always active for
                application functionality.
              </p>
              <p>
                <strong>Analytics cookies:</strong> Optional, used to improve
                user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save preferences
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/30 hover:bg-white/10"
          >
            Reset
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
