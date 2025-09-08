"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { extractVisualHints, ExtractedZones } from "@/lib/extractVisualHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const VisualHelper = ({ variant }: { variant: string }) => {
  const [helpers, setHelpers] = useState<ExtractedZones | null>(null);
  const [survivorNumber, setSurvivorNumber] = useState(0);

  const handleVisualHelpers = async (file: File) => {
    const images = await extractVisualHints(file);
    setHelpers(images);
  };

  if (variant === "survivor") {
    return (
      <div className="flex flex-col gap-2 border-2 p-2 rounded-md">
        <Label htmlFor="visualHelper" className="text-lg">
          Visual Helper
        </Label>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm">Which survivor were you ?</h2>
          <Select
            defaultValue="1"
            onValueChange={(value) => {
              setSurvivorNumber(parseInt(value));
            }}
            value={survivorNumber.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Which survivor were you ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Survivor 1</SelectItem>
              <SelectItem value="1">Survivor 2</SelectItem>
              <SelectItem value="2">Survivor 3</SelectItem>
              <SelectItem value="3">Survivor 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm">Import your screenshot to the page</h2>
          <Input
            id="visualHelper"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVisualHelpers(e.target.files[0]);
              }
            }}
          />
        </div>

        {helpers ? (
          helpers.survivor && helpers.survivor.length > 0 ? (
            <div className="grid grid-row-5 gap-2">
              <div>
                <Image
                  src={helpers.survivor[survivorNumber]}
                  alt="visualHelper"
                  width={850}
                  height={160}
                  className="rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-row-5 gap-2">
              <div>
                <Image
                  src={helpers.killer || ""}
                  alt="visualHelper"
                  width={850}
                  height={160}
                  className="rounded-md"
                />
              </div>
            </div>
          )
        ) : null}
      </div>
    );
  }
  if (variant === "killer") {
    return (
      <div className="flex flex-col gap-2 border-2 p-2 rounded-md">
        <Label htmlFor="visualHelper" className="text-lg">
          Visual Helper
        </Label>
        <div className="flex flex-col gap-4">
          <h2 className="text-sm">Import your screenshot to the page</h2>
          <Input
            name="visualHelper"
            id="visualHelper"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVisualHelpers(e.target.files[0]);
              }
            }}
          />
        </div>

        {helpers ? (
          <div className="grid grid-row-5 gap-2">
            <div>
              <Image
                src={helpers.killer || ""}
                alt="visualHelper"
                width={850}
                height={160}
                className="rounded-md"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
};
