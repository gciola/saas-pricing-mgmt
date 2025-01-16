import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface HostingCost {
  idproduct: number;
  hcost: number;
  products: {
    description: string | null;
  } | null;
}

interface HostingCostsTableProps {
  hostingCosts: HostingCost[];
  onEdit: (cost: HostingCost) => void;
  onDelete: (idproduct: number) => void;
}

export function HostingCostsTable({ hostingCosts, onEdit, onDelete }: HostingCostsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Hosting Cost (%)</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hostingCosts?.map((cost) => (
          <TableRow key={cost.idproduct}>
            <TableCell>{cost.products?.description || `Product ${cost.idproduct}`}</TableCell>
            <TableCell>{(cost.hcost * 100).toFixed(1)}%</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(cost)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(cost.idproduct)}
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