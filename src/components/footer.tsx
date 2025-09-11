"use client";

import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CookieSettings from "@/components/cookieSettings";

export default function Footer() {
  const [isCookieDialogOpen, setIsCookieDialogOpen] = useState(false);

  return (
    <footer className="border-t border-red-950 bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              DBD Match Tracker
            </h3>
            <p className="text-gray-300 text-sm">
              A fan-made application for tracking Dead by Daylight match
              statistics. Not affiliated with Behavior Interactive Inc.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/stats/killer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Killer Stats
                </Link>
              </li>
              <li>
                <Link
                  href="/stats/survivor"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Survivor Stats
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Dialog
                  open={isCookieDialogOpen}
                  onOpenChange={setIsCookieDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="text-gray-300 hover:text-white transition-colors text-left">
                      Cookie settings
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <CookieSettings
                      onClose={() => setIsCookieDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/NicolasDarid/dbd-match-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Source Code
                </a>
              </li>
              <li>
                <span className="text-gray-300">
                  Dead by Daylight © Behavior Interactive
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-950 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © 2025 DBD Match Tracker. Not affiliated with Behavior Interactive
              Inc.
            </p>
            <p className="text-sm text-gray-300 mt-2 md:mt-0">
              Made with ❤️ for the Dead by Daylight community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
