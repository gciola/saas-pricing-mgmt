import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useOfferMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.editingOffer) {
        const { error: offerError } = await supabase
          .from("offers")
          .update({
            descoffer: data.descoffer,
            idfranchise: data.idfranchise,
            parceltype: data.parceltype,
            payer: data.payer,
            quantity1: data.quantity1,
            idgroup: data.idgroup,
            idproduct: data.idproduct,
          })
          .eq("idoffer", data.editingOffer.idoffer);
        if (offerError) throw offerError;
      } else {
        const { error: offerError } = await supabase.from("offers").insert({
          idoffer: data.idoffer,
          descoffer: data.descoffer,
          idfranchise: data.idfranchise,
          parceltype: data.parceltype,
          payer: data.payer,
          quantity1: data.quantity1,
          idgroup: data.idgroup,
          idproduct: data.idproduct,
        });
        if (offerError) throw offerError;
      }

      if (data.resourceHours) {
        if (data.editingOffer) {
          const { error: deleteError } = await supabase
            .from("resourcehours")
            .delete()
            .eq("idoffer", data.editingOffer.idoffer);
          if (deleteError) throw deleteError;
        }
        
        if (data.resourceHours.length > 0) {
          const { error: resourceError } = await supabase
            .from("resourcehours")
            .insert(data.resourceHours);
          if (resourceError) throw resourceError;
        }
      }

      if (data.pricing) {
        if (data.editingOffer) {
          const { error: updateError } = await supabase
            .from("pricing")
            .update({ current: false })
            .eq("idoffer", data.editingOffer.idoffer);
          if (updateError) throw updateError;
        }

        const { error: pricingError } = await supabase
          .from("pricing")
          .insert(data.pricing);
        if (pricingError) throw pricingError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["resourceHours"] });
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      toast({
        title: "Success",
        description: "Offer updated successfully",
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
    mutationFn: async (idoffer: string) => {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("idoffer", idoffer);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({
        title: "Success",
        description: "Offer deleted successfully",
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

  return { mutation, deleteMutation };
}