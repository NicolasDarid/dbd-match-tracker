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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";

interface AddOn {
  id: string;
  name: string;
  image: string;
}

interface AddOnMultiSelectProps {
  addOns: AddOn[];
  value: AddOn[];
  onChange: (selected: AddOn[]) => void;
  text: string;
  maxSelections?: number;
}

export function AddOnMultiSelect({
  addOns,
  value = [],
  onChange,
  text,
  maxSelections,
}: AddOnMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const toggleAddOn = (addOn: AddOn) => {
    const isSelected = value.some((a) => a.id === addOn.id);
    if (isSelected) {
      onChange(value.filter((a) => a.id !== addOn.id));
    } else {
      // Vérifier si on a atteint la limite maximale
      if (maxSelections && value.length >= maxSelections) {
        return; // Ne pas ajouter si la limite est atteinte
      }
      onChange([...value, addOn]);
    }
  };

  const removeAddOn = (addOnId: string) => {
    onChange(value.filter((a) => a.id !== addOnId));
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
                } ${text} selected`
              : `Select ${text}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${text}...`} />
            <CommandEmpty>No {text} found.</CommandEmpty>
            <CommandGroup className="h-103">
              {addOns.map((addOn) => {
                const isSelected = value.some((a) => a.id === addOn.id);
                const isDisabled =
                  maxSelections && value.length >= maxSelections && !isSelected;
                return (
                  <CommandItem
                    key={addOn.id}
                    onSelect={() => toggleAddOn(addOn)}
                    className={
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <Badge
                      className={`flex items-center gap-2 w-full cursor-pointer bg-amber-200/50 ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <div className="transform rotate-45 border-[1.5px] border-black overflow-hidden">
                        {addOn.image ? (
                          <Image
                            src={addOn.image}
                            alt={addOn.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover transform -rotate-45 scale-105"
                          />
                        ) : (
                          <Image
                            src="/Placeholder_addons.webp"
                            alt={addOn.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover transform -rotate-45 scale-105"
                          />
                        )}
                      </div>
                      <span className="text-sm ml-2 text-black">
                        {addOn.name}
                      </span>
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
          {value.map((addOn) => (
            <Badge
              key={addOn.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer bg-amber-200/50 px-4"
              onClick={() => removeAddOn(addOn.id)}
            >
              {addOn.image ? (
                <Image
                  src={addOn.image}
                  alt={addOn.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover transform -rotate-45 scale-105"
                />
              ) : (
                <Image
                  src="/Placeholder_addons.webp"
                  alt={addOn.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover transform scale-105"
                />
              )}
              <span className="text-sm ml-2 text-black">{addOn.name}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
