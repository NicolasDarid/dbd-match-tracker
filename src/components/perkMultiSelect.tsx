"use client";
import { Check, ChevronsUpDown } from "lucide-react";

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
  image: string | null;
}

interface PerkMultiSelectProps {
  perks: Perk[];
  value: Perk[];
  onChange: (selected: Perk[]) => void;
  maxSelections?: number;
}

export function PerkMultiSelect({
  perks,
  value,
  onChange,
  maxSelections,
}: PerkMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const togglePerk = (perk: Perk) => {
    const isSelected = value.some((p) => p.id === perk.id);
    if (isSelected) {
      onChange(value.filter((p) => p.id !== perk.id));
    } else {
      // Vérifier si on a atteint la limite maximale
      if (maxSelections && value.length >= maxSelections) {
        return; // Ne pas ajouter si la limite est atteinte
      }
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
              ? `${value.length}${
                  maxSelections ? `/${maxSelections}` : ""
                } Perks selected`
              : "Select Perks..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search perks..." />
            <CommandEmpty>No perks found.</CommandEmpty>
            <CommandGroup className="h-106 cursor-pointer">
              {perks.map((perk) => {
                const isSelected = value.some((p) => p.id === perk.id);
                const isDisabled =
                  maxSelections && value.length >= maxSelections && !isSelected;
                return (
                  <CommandItem
                    key={perk.id}
                    onSelect={() => togglePerk(perk)}
                    className={
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  >
                    <Badge
                      className={`flex items-center gap-2 w-full ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <div className="transform rotate-45 border-[1.5px] border-white overflow-hidden">
                        {perk.image ? (
                          <Image
                            src={perk.image}
                            alt={perk.name}
                            width={50}
                            height={50}
                            className="transform rotate-315"
                          />
                        ) : (
                          <Image
                            src="/Placeholder_perks.webp"
                            alt={perk.name}
                            width={50}
                            height={50}
                            className="transform rotate-315"
                          />
                        )}
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
        <div className="flex flex-wrap gap-2 mt-4 w-full justify-center items-center">
          {value.map((perk) => (
            <Badge
              key={perk.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer bg-purple-200/50 px-4"
              onClick={() => removePerk(perk.id)}
            >
              {perk.image ? (
                <Image
                  src={perk.image}
                  alt={perk.name}
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/Placeholder_perks.webp"
                  alt={perk.name}
                  width={50}
                  height={50}
                />
              )}
              <span className="text-sm ml-2 text-black">{perk.name}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
