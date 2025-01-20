import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { OfferSelect } from "@/components/ui/offer-select";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idoffer"
          render={({ field }) => (
            <OfferSelect
              value={field.value}
              onValueChange={field.onChange}
            />
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