import { toast } from "sonner";

export type ExtractedZones = {
  name: string;
  perks: string;
  addOns: string;
  offering: string;
  score: string;
  fullRow: string;
  survivor?: string[];
  killer?: string;
};

// const FullResolutions = [
//   { width: 1920, height: 1080 },
//   { width: 2560, height: 1440 },
//   { width: 3840, height: 2160 },
// ];

export async function extractVisualHints(file: File): Promise<ExtractedZones> {
  if (!file || !(file instanceof Blob)) {
    toast.error("No valid file provided.");
    throw new Error("No valid file provided.");
  }

  // Retour par défaut temporaire - fonctionnalité à implémenter
  return {
    name: "",
    perks: "",
    addOns: "",
    offering: "",
    score: "",
    fullRow: "",
    survivor: [],
    killer: "",
  };
}

// Fonction temporairement commentée - sera utilisée plus tard
// function isFullScreenshotResolution(
//   imageWidth: number,
//   imageHeight: number,
//   tolerance = 10
// ): boolean {
//   return FullResolutions.some(
//     ({ width, height }) =>
//       Math.abs(imageWidth - width) <= tolerance &&
//       Math.abs(imageHeight - height) <= tolerance
//   );
// }
