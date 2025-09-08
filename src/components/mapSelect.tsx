"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Map {
  id: string;
  name: string;
  image: string | null;
}

interface MapSelectProps {
  maps: Map[];
  value: string; // map id
  onChange: (id: string) => void;
}

export function MapSelect({ maps, value, onChange }: MapSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedMap = maps.find((m) => m.id === value);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedMap ? selectedMap.name : `Select a map...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Search map...`} />
            <CommandEmpty>No map found.</CommandEmpty>
            <CommandGroup className="h-106">
              {maps.map((map) => (
                <CommandItem
                  key={map.id}
                  onSelect={() => {
                    onChange(map.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 w-full cursor-pointer">
                    {map.image ? (
                      <Image
                        src={map.image}
                        alt={map.name}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <Image
                        src="/Placeholder_maps.webp"
                        alt={map.name}
                        width={50}
                        height={50}
                      />
                    )}
                    <span className="text-sm ml-2">{map.name}</span>
                    {value === map.id && (
                      <Check className="ml-auto h-4 w-4 text-green-600" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
