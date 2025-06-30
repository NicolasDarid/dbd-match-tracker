import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

type SurvivorSelectorGroupProps = {
  survivors: { id: string; name: string; image: string }[];
};

export const SurvivorSelectorGroup = ({
  survivors,
}: SurvivorSelectorGroupProps) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((index) => (
        <FormField
          key={index}
          control={control}
          name={`survivorsIds.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Survivor {index + 1}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a survivor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {survivors.map((survivor) => (
                    <SelectItem key={survivor.id} value={survivor.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={survivor.image}
                          alt={survivor.name}
                          width={32}
                          height={32}
                        />
                        {survivor.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
