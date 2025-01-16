import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  parameter: z.string().min(1, "Parameter is required"),
  value: z.string().nullable(),
});

interface SettingsFormProps {
  settings: {
    parameter: string;
    value: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SettingsForm({
  settings,
  onClose,
  onSuccess,
}: SettingsFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parameter: settings?.parameter || "",
      value: settings?.value || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = settings
      ? await supabase
          .from("settings")
          .update({ value: values.value })
          .eq("parameter", settings.parameter)
      : await supabase.from("settings").insert([values]);

    if (error) {
      console.error("Error saving setting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save setting",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Setting saved successfully",
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="parameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parameter</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!!settings}
                  placeholder="Enter parameter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter value" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}