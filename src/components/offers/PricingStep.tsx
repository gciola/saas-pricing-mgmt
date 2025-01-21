import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PricingStepProps {
  offer: any;
  onSubmit: (data: any) => void;
  editOnly?: boolean;
}

export function PricingStep({
  offer,
  onSubmit,
  editOnly = false,
}: PricingStepProps) {
  const form = useForm({
    defaultValues: {
      baseprice: 0,
      current: true,
    },
  });

  const { data: existingPricing } = useQuery({
    queryKey: ["pricing", offer.idoffer],
    queryFn: async () => {
      if (!offer.idoffer) return null;
      const { data, error } = await supabase
        .from("pricing")
        .select("*")
        .eq("idoffer", offer.idoffer)
        .eq("current", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Update form values when existing pricing data is loaded
  if (existingPricing && !form.getValues().baseprice) {
    form.reset({
      baseprice: existingPricing.baseprice,
      current: existingPricing.current,
    });
  }

  const handleSubmit = (values: any) => {
    onSubmit({
      pricing: {
        idoffer: offer.idoffer,
        baseprice: Number(values.baseprice),
        version: existingPricing?.version
          ? existingPricing.version + 1
          : 1,
        current: values.current,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Current Version</FormLabel>
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
          {editOnly ? "Save Changes" : "Complete"}
        </Button>
      </form>
    </Form>
  );
}