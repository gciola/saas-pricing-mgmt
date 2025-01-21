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
  const [searchQuery, setSearchQuery] = useState("");

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers", searchQuery],
    queryFn: async () => {
      try {
        if (!searchQuery.trim()) {
          // If no search query, return all offers ordered by description
          const { data, error } = await supabase
            .from("offers")
            .select("idoffer, descoffer")
            .order("descoffer");
          if (error) throw error;
          return data || [];
        }

        // Use vector similarity search when there's a search query
        const { data, error } = await supabase
          .rpc("match_offers", {
            query_text: searchQuery,
            match_threshold: 0.5,
            match_count: 10
          });
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Find selected offer
  const selectedOffer = offers?.find((offer) => offer.idoffer === value);

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
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Procurar oferta..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Nenhuma oferta encontrada.</CommandEmpty>
            <CommandGroup>
              {(offers || []).map((offer) => (
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
    </FormItem>
  );
}