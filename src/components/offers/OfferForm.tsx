import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

interface OfferFormProps {
  editingOffer: Offer | null;
  offerGroups: { idgroup: string; descgroup: string }[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function OfferForm({ editingOffer, offerGroups, onSubmit }: OfferFormProps) {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("idproduct, description")
        .order('description');
      if (error) throw error;
      return data;
    },
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <Label htmlFor="idfranchise">Franchise ID</Label>
        <Input
          id="idfranchise"
          name="idfranchise"
          type="number"
          defaultValue={editingOffer?.idfranchise || ""}
        />
      </div>
      <div>
        <Label htmlFor="parceltype">Parcel Type</Label>
        <Select name="parceltype" defaultValue={editingOffer?.parceltype || "Setup"}>
          <SelectTrigger>
            <SelectValue placeholder="Select parcel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Setup">Setup</SelectItem>
            <SelectItem value="Recurring">Recurring</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="payer">Payer</Label>
        <Select name="payer" defaultValue={editingOffer?.payer || "Hub"}>
          <SelectTrigger>
            <SelectValue placeholder="Select payer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hub">Hub</SelectItem>
            <SelectItem value="Parceiro">Parceiro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="quantity1"
          name="quantity1"
          defaultChecked={editingOffer?.quantity1}
        />
        <Label htmlFor="quantity1">Quantity 1</Label>
      </div>
      <div>
        <Label htmlFor="idgroup">Offer Group</Label>
        <Select name="idgroup" defaultValue={editingOffer?.idgroup}>
          <SelectTrigger>
            <SelectValue placeholder="Select offer group" />
          </SelectTrigger>
          <SelectContent>
            {offerGroups.map((group) => (
              <SelectItem key={group.idgroup} value={group.idgroup}>
                {group.descgroup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="idproduct">Product</Label>
        <Select name="idproduct" defaultValue={editingOffer?.idproduct?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {products?.map((product) => (
              <SelectItem key={product.idproduct} value={product.idproduct.toString()}>
                {product.description || `Product ${product.idproduct}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        {editingOffer ? "Update" : "Create"}
      </Button>
    </form>
  );
}