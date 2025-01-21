import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
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
  placeholder = "Digite termos para buscar ofertas...",
}: OfferSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
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

  // Advanced search function that handles multiple terms
  const getMatchScore = (text: string, searchTerms: string[]) => {
    const normalizedText = text.toLowerCase();
    return searchTerms.reduce((score, term) => {
      return score + (normalizedText.includes(term.toLowerCase()) ? 1 : 0);
    }, 0);
  };

  // Filter and sort offers based on search terms
  const filteredOffers = debouncedQuery
    ? offers
        .map(offer => ({
          ...offer,
          score: getMatchScore(
            offer.descoffer,
            debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)
          )
        }))
        .filter(offer => offer.score > 0)
        .sort((a, b) => b.score - a.score)
    : offers;

  // Find selected offer
  const selectedOffer = offers.find(offer => offer.idoffer === value);

  return (
    <FormItem className="flex flex-col">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="relative">
          <Command className="border rounded-md">
            <div className="flex items-center border-b px-3">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={placeholder}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex-1 pl-2"
              />
            </div>
            {filteredOffers.length > 0 && (
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredOffers.map((offer) => (
                  <CommandItem
                    key={offer.idoffer}
                    value={offer.descoffer}
                    onSelect={() => {
                      onValueChange?.(offer.idoffer);
                      setSearchQuery(offer.descoffer);
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
            )}
            {!isLoading && filteredOffers.length === 0 && (
              <CommandEmpty>Nenhuma oferta encontrada.</CommandEmpty>
            )}
          </Command>
        </div>
      </FormControl>
      {selectedOffer && (
        <div className="text-sm text-muted-foreground mt-1">
          Selecionado: {selectedOffer.descoffer}
        </div>
      )}
    </FormItem>
  );
}