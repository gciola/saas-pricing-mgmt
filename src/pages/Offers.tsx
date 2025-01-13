import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/HomeButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

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

interface OfferGroup {
  idgroup: string;
  descgroup: string;
  grouptype: string;
}

export default function Offers() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          offergroup (
            idgroup,
            descgroup,
            grouptype
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const { data: offerGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ["offerGroups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offergroup").select("*");
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (offer: {
      idoffer: string;
      descoffer: string;
      idgroup: string;
      parceltype?: string;
      payer?: string;
      quantity1?: boolean;
    }) => {
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

  if (offersLoading || groupsLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <HomeButton />
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                mutation.mutate({
                  idoffer: formData.get("idoffer") as string,
                  descoffer: formData.get("descoffer") as string,
                  idgroup: formData.get("idgroup") as string,
                  parceltype: formData.get("parceltype") as string,
                  payer: formData.get("payer") as string,
                  quantity1: formData.get("quantity1") === "true",
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="idoffer">Offer ID</Label>
                <Input
                  id="idoffer"
                  name="idoffer"
                  defaultValue={editingOffer?.idoffer}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descoffer">Description</Label>
                <Input
                  id="descoffer"
                  name="descoffer"
                  defaultValue={editingOffer?.descoffer}
                  required
                />
              </div>
              <div>
                <Label htmlFor="idgroup">Offer Group</Label>
                <select
                  id="idgroup"
                  name="idgroup"
                  defaultValue={editingOffer?.idgroup}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {offerGroups?.map((group: OfferGroup) => (
                    <option key={group.idgroup} value={group.idgroup}>
                      {group.descgroup}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="parceltype">Parcel Type</Label>
                <select
                  id="parceltype"
                  name="parceltype"
                  defaultValue={editingOffer?.parceltype || "s"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="s">Setup</option>
                  <option value="r">Recurring</option>
                </select>
              </div>
              <div>
                <Label htmlFor="payer">Payer</Label>
                <select
                  id="payer"
                  name="payer"
                  defaultValue={editingOffer?.payer || "hub"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="hub">Hub</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div>
                <Label htmlFor="quantity1">Quantity</Label>
                <select
                  id="quantity1"
                  name="quantity1"
                  defaultValue={String(editingOffer?.quantity1 ?? true)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="true">Single</option>
                  <option value="false">Multiple</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                {editingOffer ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Parcel Type</TableHead>
            <TableHead>Payer</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers?.map((offer: Offer & { offergroup: OfferGroup }) => (
            <TableRow key={offer.idoffer}>
              <TableCell>{offer.idoffer}</TableCell>
              <TableCell>{offer.descoffer}</TableCell>
              <TableCell>{offer.offergroup.descgroup}</TableCell>
              <TableCell>
                {offer.parceltype === "s" ? "Setup" : "Recurring"}
              </TableCell>
              <TableCell>
                {offer.payer === "hub" ? "Hub" : "Partner"}
              </TableCell>
              <TableCell>{offer.quantity1 ? "Single" : "Multiple"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingOffer(offer);
                      setIsOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this offer?"
                        )
                      ) {
                        deleteMutation.mutate(offer.idoffer);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
