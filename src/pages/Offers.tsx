import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { OffersTable } from "@/components/offers/OffersTable";
import { OfferStepsModal } from "@/components/offers/OfferStepsModal";

interface Offer {
  idoffer: string;
  descoffer: string;
  idfranchise: number | null;
  parceltype: string;
  payer: string;
  quantity1: boolean;
  idgroup: string;
  idproduct: number | null;
}

export default function Offers() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [modalMode, setModalMode] = useState<"full" | "resources" | "pricing">("full");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offers, isLoading: isLoadingOffers } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: offerGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["offerGroups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offergroup")
        .select("idgroup, descgroup");
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Handle offer data
      if (editingOffer) {
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
          .eq("idoffer", editingOffer.idoffer);
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

      // Handle resource hours if present
      if (data.resourceHours) {
        if (editingOffer) {
          const { error: deleteError } = await supabase
            .from("resourcehours")
            .delete()
            .eq("idoffer", editingOffer.idoffer);
          if (deleteError) throw deleteError;
        }
        
        if (data.resourceHours.length > 0) {
          const { error: resourceError } = await supabase
            .from("resourcehours")
            .insert(data.resourceHours);
          if (resourceError) throw resourceError;
        }
      }

      // Handle pricing if present
      if (data.pricing) {
        if (editingOffer) {
          const { error: updateError } = await supabase
            .from("pricing")
            .update({ current: false })
            .eq("idoffer", editingOffer.idoffer);
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
      setIsOpen(false);
      setEditingOffer(null);
      setModalMode("full");
      toast({
        title: `Offer ${editingOffer ? "updated" : "created"} successfully`,
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
        title: "Offer deleted successfully",
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

  if (isLoadingOffers || isLoadingGroups) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Offers</h1>
        </div>
        <Button onClick={() => {
          setModalMode("full");
          setEditingOffer(null);
          setIsOpen(true);
        }}>
          <Plus className="mr-2" />
          Add Offer
        </Button>
      </div>

      <OffersTable
        offers={offers || []}
        onEdit={(offer) => {
          setEditingOffer(offer);
          setModalMode("full");
          setIsOpen(true);
        }}
        onEditResources={(offer) => {
          setEditingOffer(offer);
          setModalMode("resources");
          setIsOpen(true);
        }}
        onEditPricing={(offer) => {
          setEditingOffer(offer);
          setModalMode("pricing");
          setIsOpen(true);
        }}
        onDelete={(idoffer) => deleteMutation.mutate(idoffer)}
      />

      <OfferStepsModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingOffer(null);
          setModalMode("full");
        }}
        editingOffer={editingOffer}
        offerGroups={offerGroups || []}
        onSubmit={mutation.mutate}
        mode={modalMode}
      />
    </div>
  );
}