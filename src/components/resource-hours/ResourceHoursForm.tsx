import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function ResourceHoursForm({ editingHours, onSubmit }: ResourceHoursFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string>(editingHours?.idoffer || "");

  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("idoffer, descoffer")
        .order('descoffer');
      if (error) throw error;
      return data;
    },
  });

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("idresource, description")
        .order('description');
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      idoffer: selectedOffer,
      idresource: formData.get("idresource") as string,
      hours: Number(formData.get("hours")),
      monthly: formData.get("monthly") === "on",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Offer</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedOffer
                ? offers?.find((offer) => offer.idoffer === selectedOffer)?.descoffer
                : "Select offer..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search offer..." />
              <CommandEmpty>No offer found.</CommandEmpty>
              <CommandGroup>
                {offers?.map((offer) => (
                  <CommandItem
                    key={offer.idoffer}
                    value={offer.idoffer}
                    onSelect={(currentValue) => {
                      setSelectedOffer(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedOffer === offer.idoffer ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {offer.descoffer}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idresource">Resource</Label>
        <Select name="idresource" defaultValue={editingHours?.idresource}>
          <SelectTrigger>
            <SelectValue placeholder="Select a resource" />
          </SelectTrigger>
          <SelectContent>
            {resources?.map((resource) => (
              <SelectItem key={resource.idresource} value={resource.idresource}>
                {resource.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Hours</Label>
        <Input
          id="hours"
          name="hours"
          type="number"
          step="0.1"
          defaultValue={editingHours?.hours}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="monthly"
          name="monthly"
          defaultChecked={editingHours?.monthly}
        />
        <Label htmlFor="monthly">Monthly Effort</Label>
      </div>

      <Button type="submit" className="w-full">
        {editingHours ? "Update" : "Create"}
      </Button>
    </form>
  );
}