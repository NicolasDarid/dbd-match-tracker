import { toast } from "sonner";

export type ExtractedZones = {
  name: string;
  perks: string;
  addOns: string;
  offering: string;
  score: string;
  fullRow: string;
};

const FullResolutions = [
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
];

export async function extractVisualHints(file: File): Promise<ExtractedZones> {
  if (!file || !(file instanceof Blob)) {
    // Handle the case where no file was selected or it's not a Blob
    toast.error("No valid file provided.");
    return; // Or handle the error appropriately
  }
  const imageBitmap = await createImageBitmap(file);
  const { width, height } = imageBitmap;

  const zones = getZones({ width, height });

  const cropZone = (zone: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): string => {
    const canvas = document.createElement("canvas");
    canvas.width = zone.width;
    canvas.height = zone.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      imageBitmap,
      zone.x,
      zone.y,
      zone.width,
      zone.height,
      0,
      0,
      zone.width,
      zone.height
    );
    return canvas.toDataURL(); // use URL.createObjectURL(blob) if you prefer blob
  };

  if (!isFullScreenshotResolution(width, height)) {
    return {
      killer: cropZone(zones.killer),
    };
  }

  return {
    killer: cropZone(zones.killer),
    survivor: [
      cropZone(zones?.survivor1),
      cropZone(zones?.survivor2),
      cropZone(zones?.survivor3),
      cropZone(zones?.survivor4),
    ],
  };
}

function getZones({ width, height }: { width: number; height: number }) {
  const scaleX = width / 2560;
  const scaleY = height / 1440;
  if (!isFullScreenshotResolution(width, height)) {
    return {
      killer: {
        x: 0,
        y: 0,
        width,
        height,
      },
    };
  }
  return {
    killer: {
      x: Math.round(200 * scaleX),
      y: Math.round(990 * scaleY),
      width: Math.round(850 * scaleX),
      height: Math.round(160 * scaleY),
    },
    survivor1: {
      x: Math.round(200 * scaleX),
      y: Math.round(830 * scaleY),
      width: Math.round(850 * scaleX),
      height: Math.round(160 * scaleY),
    },
    survivor2: {
      x: Math.round(200 * scaleX),
      y: Math.round(670 * scaleY),
      width: Math.round(850 * scaleX),
      height: Math.round(160 * scaleY),
    },
    survivor3: {
      x: Math.round(200 * scaleX),
      y: Math.round(510 * scaleY),
      width: Math.round(850 * scaleX),
      height: Math.round(160 * scaleY),
    },
    survivor4: {
      x: Math.round(200 * scaleX),
      y: Math.round(350 * scaleY),
      width: Math.round(850 * scaleX),
      height: Math.round(160 * scaleY),
    },
  };
}

function isFullScreenshotResolution(
  imageWidth: number,
  imageHeight: number,
  tolerance = 10
): boolean {
  return FullResolutions.some(
    ({ width, height }) =>
      Math.abs(imageWidth - width) <= tolerance &&
      Math.abs(imageHeight - height) <= tolerance
  );
}
