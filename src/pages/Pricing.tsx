import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingForm } from "@/components/pricing/PricingForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HomeButton } from "@/components/HomeButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Pricing {
  idoffer: string;
  baseprice: number;
  version: number;
  current: boolean;
}

export default function Pricing() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Pricing) => {
      if (editingPricing) {
        const { error } = await supabase
          .from("pricing")
          .update(data)
          .eq("idoffer", editingPricing.idoffer)
          .eq("version", editingPricing.version);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pricing").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      setIsDialogOpen(false);
      setEditingPricing(null);
      toast({
        title: "Success",
        description: editingPricing
          ? "Pricing updated successfully"
          : "Pricing created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ idoffer, version }: { idoffer: string; version: number }) => {
      const { error } = await supabase
        .from("pricing")
        .delete()
        .eq("idoffer", idoffer)
        .eq("version", version);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      toast({
        title: "Success",
        description: "Pricing deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <HomeButton />
          <h1 className="text-3xl font-bold">Pricing</h1>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Pricing
        </Button>
      </div>

      <PricingTable
        onEdit={(pricing) => {
          setEditingPricing(pricing);
          setIsDialogOpen(true);
        }}
        onDelete={(idoffer, version) =>
          deleteMutation.mutate({ idoffer, version })
        }
      />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPricing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPricing ? "Edit Pricing" : "Add Pricing"}
            </DialogTitle>
          </DialogHeader>
          <PricingForm
            editingPricing={editingPricing}
            onSubmit={(data) => mutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}