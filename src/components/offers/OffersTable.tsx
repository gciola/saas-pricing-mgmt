import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Search } from "lucide-react";
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

interface OffersTableProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (idoffer: string) => void;
}

export function OffersTable({ offers, onEdit, onDelete }: OffersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("idproduct, description");
      if (error) throw error;
      return data;
    },
  });

  const { data: franchises } = useQuery({
    queryKey: ["franchises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("franchise")
        .select("idfranchise, frlabel");
      if (error) throw error;
      return data;
    },
  });

  const getProductDescription = (idproduct: number | null) => {
    if (!idproduct) return "None";
    const product = products?.find((p) => p.idproduct === idproduct);
    return product?.description || `Product ${idproduct}`;
  };

  const getFranchiseLabel = (idfranchise: number | null) => {
    if (!idfranchise) return "None";
    const franchise = franchises?.find((f) => f.idfranchise === idfranchise);
    return franchise?.frlabel || `Franchise ${idfranchise}`;
  };

  const filteredOffers = offers.filter((offer) => {
    if (!searchTerm) return true;

    // Split search terms and remove empty strings
    const searchTerms = searchTerm.toLowerCase().split(" ").filter(Boolean);

    // Create a string that combines all searchable fields
    const searchableText = [
      offer.descoffer,
      offer.parceltype,
      getProductDescription(offer.idproduct),
      getFranchiseLabel(offer.idfranchise),
    ]
      .join(" ")
      .toLowerCase();

    // Return true only if ALL search terms are found in the searchable text
    return searchTerms.every((term) => searchableText.includes(term));
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search offers by description, parcel type, product or franchise... (use spaces to search multiple terms)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Franchise</TableHead>
            <TableHead>Parcel Type</TableHead>
            <TableHead>Payer</TableHead>
            <TableHead>Quantity 1</TableHead>
            <TableHead>Group ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOffers.map((offer) => (
            <TableRow key={offer.idoffer}>
              <TableCell>{offer.idoffer}</TableCell>
              <TableCell>{offer.descoffer}</TableCell>
              <TableCell>{getFranchiseLabel(offer.idfranchise)}</TableCell>
              <TableCell>{offer.parceltype}</TableCell>
              <TableCell>{offer.payer}</TableCell>
              <TableCell>{offer.quantity1 ? "Yes" : "No"}</TableCell>
              <TableCell>{offer.idgroup}</TableCell>
              <TableCell>{getProductDescription(offer.idproduct)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(offer)}
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
                        onDelete(offer.idoffer);
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