import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

interface OfferSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export function OfferSelect({
  value,
  onValueChange,
  label,
}: OfferSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("idoffer, descoffer")
          .order("descoffer");
        
        if (error) {
          console.error("Error fetching offers:", error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in query:", error);
        return [];
      }
    },
  });

  const selectedOffer = offers.find(offer => offer.idoffer === value);

  return (
    <FormItem className="flex flex-col">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {selectedOffer ? selectedOffer.descoffer : "Selecione uma oferta"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Procurar oferta..." />
              <CommandEmpty>Nenhuma oferta encontrada.</CommandEmpty>
              <CommandGroup>
                {offers.map((offer) => (
                  <CommandItem
                    key={offer.idoffer}
                    value={offer.descoffer}
                    onSelect={() => {
                      onValueChange(offer.idoffer);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === offer.idoffer ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {offer.descoffer}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
    </FormItem>
  );
}