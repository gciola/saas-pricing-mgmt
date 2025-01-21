import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OffersHeader } from "@/components/offers/OffersHeader";
import { OffersTable } from "@/components/offers/OffersTable";
import { OfferStepsModal } from "@/components/offers/OfferStepsModal";
import { useOfferMutations } from "@/components/offers/OffersMutations";

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
  const { mutation, deleteMutation } = useOfferMutations();

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

  const handleModalOpen = (
    offer: Offer | null = null,
    mode: "full" | "resources" | "pricing" = "full"
  ) => {
    setEditingOffer(offer);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setEditingOffer(null);
    setModalMode("full");
  };

  if (isLoadingOffers || isLoadingGroups) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <OffersHeader onAddOffer={() => handleModalOpen(null, "full")} />

      <OffersTable
        offers={offers || []}
        onEdit={(offer) => handleModalOpen(offer, "full")}
        onEditResources={(offer) => handleModalOpen(offer, "resources")}
        onEditPricing={(offer) => handleModalOpen(offer, "pricing")}
        onDelete={(idoffer) => deleteMutation.mutate(idoffer)}
      />

      <OfferStepsModal
        isOpen={isOpen}
        onClose={handleModalClose}
        editingOffer={editingOffer}
        offerGroups={offerGroups || []}
        onSubmit={mutation.mutate}
        mode={modalMode}
      />
    </div>
  );
}