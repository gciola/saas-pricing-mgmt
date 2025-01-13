import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Franchise ID</TableHead>
          <TableHead>Parcel Type</TableHead>
          <TableHead>Payer</TableHead>
          <TableHead>Quantity 1</TableHead>
          <TableHead>Group ID</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers?.map((offer) => (
          <TableRow key={offer.idoffer}>
            <TableCell>{offer.idoffer}</TableCell>
            <TableCell>{offer.descoffer}</TableCell>
            <TableCell>{offer.idfranchise}</TableCell>
            <TableCell>{offer.parceltype}</TableCell>
            <TableCell>{offer.payer}</TableCell>
            <TableCell>{offer.quantity1 ? "Yes" : "No"}</TableCell>
            <TableCell>{offer.idgroup}</TableCell>
            <TableCell>{offer.idproduct}</TableCell>
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
  );
}