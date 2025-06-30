"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";

interface Perk {
  id: string;
  name: string;
  image: string;
}

interface PerkMultiSelectProps {
  perks: Perk[];
  value: Perk[];
  onChange: (selected: Perk[]) => void;
}

export function PerkMultiSelect({
  perks,
  value,
  onChange,
}: PerkMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const togglePerk = (perk: Perk) => {
    const isSelected = value.some((p) => p.id === perk.id);
    if (isSelected) {
      onChange(value.filter((p) => p.id !== perk.id));
    } else {
      onChange([...value, perk]);
    }
  };

  const removePerk = (perkId: string) => {
    onChange(value.filter((p) => p.id !== perkId));
  };

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
            {value.length > 0
              ? `${value.length} Perks selected`
              : "Select Perks..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search perks..." />
            <CommandEmpty>No perks found.</CommandEmpty>
            <CommandGroup>
              {perks.map((perk) => {
                const isSelected = value.some((p) => p.id === perk.id);
                return (
                  <CommandItem key={perk.id} onSelect={() => togglePerk(perk)}>
                    <Badge className="flex items-center gap-2 w-full">
                      <div className="transform rotate-45 border-[1.5px] border-white overflow-hidden">
                        <Image
                          src={perk.image}
                          alt={perk.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover transform -rotate-45 scale-105"
                        />
                      </div>
                      <span className="text-sm ml-2">{perk.name}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </Badge>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 w-full justify-center">
          {value.map((perk) => (
            <Badge
              key={perk.id}
              variant="secondary"
              className="flex items-center gap-1"
              onClick={() => removePerk(perk.id)}
            >
              {perk.name}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
