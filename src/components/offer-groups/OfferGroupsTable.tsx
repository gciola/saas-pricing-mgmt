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

interface OfferGroup {
  idgroup: string;
  descgroup: string;
  grouptype: string;
}

interface OfferGroupsTableProps {
  offerGroups: OfferGroup[];
  onEdit: (group: OfferGroup) => void;
  onDelete: (idgroup: string) => void;
}

export function OfferGroupsTable({
  offerGroups,
  onEdit,
  onDelete,
}: OfferGroupsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Group Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offerGroups?.map((group) => (
          <TableRow key={group.idgroup}>
            <TableCell>{group.idgroup}</TableCell>
            <TableCell>{group.descgroup}</TableCell>
            <TableCell>{group.grouptype}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(group)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this offer group?"
                      )
                    ) {
                      onDelete(group.idgroup);
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