import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OfferSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function OfferSelect({
  value,
  onValueChange,
  label,
  placeholder = "Selecione uma oferta...",
}: OfferSelectProps) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("idoffer, descoffer")
        .order('descoffer');
      if (error) throw error;
      return data || [];
    },
  });

  const offers = data || [];

  // Filter offers based on local search
  const filteredOffers = offers.filter((offer) =>
    offer.descoffer.toLowerCase().includes(localSearch.toLowerCase())
  );

  // Find selected offer
  const selectedOffer = offers.find((offer) => offer.idoffer === value);

  if (error) {
    console.error("Error loading offers:", error);
    return (
      <FormItem className="flex flex-col">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Button variant="outline" className="w-full text-destructive" disabled>
            Error loading offers
          </Button>
        </FormControl>
      </FormItem>
    );
  }

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
                "Loading offers..."
              ) : (
                <>
                  {selectedOffer?.descoffer || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Procurar oferta..." 
                value={localSearch}
                onValueChange={setLocalSearch}
              />
              <CommandEmpty>Nenhuma oferta encontrada.</CommandEmpty>
              <CommandGroup>
                {filteredOffers.map((offer) => (
                  <CommandItem
                    key={offer.idoffer}
                    value={offer.descoffer}
                    onSelect={() => {
                      onValueChange?.(offer.idoffer);
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