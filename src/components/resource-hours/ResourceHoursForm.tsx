import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceHoursFormProps {
  editingHours?: {
    idoffer: string;
    idresource: string;
    hours: number;
    monthly: boolean;
  };
  onSubmit: (data: {
    idoffer: string;
    idresource: string;
    hours: number;
    monthly: boolean;
  }) => void;
}

export function ResourceHoursForm({
  editingHours,
  onSubmit,
}: ResourceHoursFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      idoffer: editingHours?.idoffer || "",
      idresource: editingHours?.idresource || "",
      hours: editingHours?.hours || 0,
      monthly: editingHours?.monthly || false,
    },
  });

  const { data: offers = [], isLoading: isLoadingOffers } = useQuery({
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

  const { data: resources = [], isLoading: isLoadingResources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("idresource, description")
        .order("description");
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoadingOffers || isLoadingResources) {
    return <div>Carregando...</div>;
  }

  const selectedOffer = offers.find((offer) => offer.idoffer === form.watch("idoffer"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idoffer"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Oferta</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      {selectedOffer?.descoffer || "Selecione a oferta..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Procurar oferta..." />
                    <CommandEmpty>Nenhuma oferta encontrada.</CommandEmpty>
                    <CommandGroup>
                      {offers.map((offer) => (
                        <CommandItem
                          key={offer.idoffer}
                          value={offer.descoffer}
                          onSelect={() => {
                            form.setValue("idoffer", offer.idoffer);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === offer.idoffer ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {offer.descoffer}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idresource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurso</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o recurso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem
                      key={resource.idresource}
                      value={resource.idresource}
                    >
                      {resource.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Mensal</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {editingHours ? "Atualizar" : "Criar"} Horas de Recurso
        </Button>
      </form>
    </Form>
  );
}