import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

interface Resource {
  idresource: string;
  description: string;
  resourcetype: string;
  hourcost: number | null;
}

interface ResourceFormProps {
  onSuccess: () => void;
  initialData?: Resource;
}

interface FormData {
  idresource: string;
  description: string;
  resourcetype: string;
  hourcost: string;
}

export function ResourceForm({ onSuccess, initialData }: ResourceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      idresource: initialData?.idresource || "",
      description: initialData?.description || "",
      resourcetype: initialData?.resourcetype || "",
      hourcost: initialData?.hourcost?.toString() || "0",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        idresource: data.idresource,
        description: data.description,
        resourcetype: data.resourcetype,
        hourcost: parseFloat(data.hourcost.replace(/[^\d,.-]/g, "").replace(",", ".")),
      };

      if (initialData) {
        const { error } = await supabase
          .from("resources")
          .update(payload)
          .eq("idresource", initialData.idresource);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resources").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Success",
        description: initialData
          ? "Resource updated successfully"
          : "Resource created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: initialData
          ? "Failed to update resource"
          : "Failed to create resource",
        variant: "destructive",
      });
      console.error("Error saving resource:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idresource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource ID</FormLabel>
              <FormControl>
                <Input {...field} disabled={!!initialData} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resourcetype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hourcost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hour Cost (BRL)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,.-]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update Resource" : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}