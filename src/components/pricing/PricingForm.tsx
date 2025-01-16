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

interface PricingFormProps {
  editingPricing?: {
    idoffer: string;
    baseprice: number;
    version: number;
    current: boolean;
  };
  onSubmit: (data: {
    idoffer: string;
    baseprice: number;
    version: number;
    current: boolean;
  }) => void;
}

export function PricingForm({ editingPricing, onSubmit }: PricingFormProps) {
  const form = useForm({
    defaultValues: {
      idoffer: editingPricing?.idoffer || "",
      baseprice: editingPricing?.baseprice || 0,
      version: editingPricing?.version || 1,
      current: editingPricing?.current || true,
    },
  });

  const { data: offers, isLoading: isLoadingOffers } = useQuery({
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

  if (isLoadingOffers) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idoffer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select offer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {offers.map((offer) => (
                    <SelectItem
                      key={offer.idoffer}
                      value={offer.idoffer}
                    >
                      {offer.descoffer}
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
          name="baseprice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Current Version</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {editingPricing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}