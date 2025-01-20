import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { FormControl, FormItem, FormLabel } from "./form";

interface OfferSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function OfferSelect({
  value,
  onValueChange,
  label = "Oferta",
  placeholder = "Selecione uma oferta...",
}: OfferSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("idoffer, descoffer")
        .order("descoffer");
      if (error) throw error;
      return data || [];
    },
  });

  // Render loading state
  if (isLoading) {
    return (
      <FormItem className="flex flex-col">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Button variant="outline" className="w-full" disabled>
            Carregando ofertas...
          </Button>
        </FormControl>
      </FormItem>
    );
  }

  // Find selected offer after loading is complete
  const selectedOffer = offers.find((offer) => offer.idoffer === value);

  return (
    <FormItem className="flex flex-col">
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedOffer?.descoffer || placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        {offers.length > 0 && (
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
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
        )}
      </Popover>
    </FormItem>
  );
}