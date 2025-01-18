import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { OfferForm } from "@/components/offers/OfferForm";
import { OffersTable } from "@/components/offers/OffersTable";

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
    mutationFn: async (offer: Offer) => {
      if (editingOffer) {
        const { error } = await supabase
          .from("offers")
          .update(offer)
          .eq("idoffer", editingOffer.idoffer);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offers").insert(offer);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsOpen(false);
      setEditingOffer(null);
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? "Edit Offer" : "Create Offer"}
              </DialogTitle>
            </DialogHeader>
            <OfferForm
              editingOffer={editingOffer}
              offerGroups={offerGroups || []}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                mutation.mutate({
                  idoffer: formData.get("idoffer") as string,
                  descoffer: formData.get("descoffer") as string,
                  idfranchise: formData.get("idfranchise")
                    ? Number(formData.get("idfranchise"))
                    : null,
                  parceltype: formData.get("parceltype") as string,
                  payer: formData.get("payer") as string,
                  quantity1: formData.get("quantity1") === "on",
                  idgroup: formData.get("idgroup") as string,
                  idproduct: formData.get("idproduct")
                    ? Number(formData.get("idproduct"))
                    : null,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <OffersTable
        offers={offers || []}
        onEdit={(offer) => {
          setEditingOffer(offer);
          setIsOpen(true);
        }}
        onDelete={(idoffer) => deleteMutation.mutate(idoffer)}
      />
    </div>
  );
}
