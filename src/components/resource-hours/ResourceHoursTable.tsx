import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ResourceHoursTableProps {
  onEdit: (hours: {
    idoffer: string;
    idresource: string;
    hours: number;
    monthly: boolean;
  }) => void;
  onDelete: (idoffer: string, idresource: string) => void;
}

export function ResourceHoursTable({ onEdit, onDelete }: ResourceHoursTableProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    idoffer: string;
    idresource: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: resourceHours = [], isLoading, error } = useQuery({
    queryKey: ["resourceHours"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("resourcehours")
          .select(`
            *,
            offers:idoffer (
              descoffer
            ),
            resources:idresource (
              description
            )
          `)
          .order('idoffer');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching resource hours:", error);
        return [];
      }
    },
  });

  const filteredResourceHours = (resourceHours || []).filter((hours) => {
    if (!searchTerm) return true;
    const searchTerms = searchTerm.toLowerCase().split(" ").filter(Boolean);
    const searchableText = [
      hours.offers?.descoffer || '',
      hours.resources?.description || '',
      hours.hours?.toString() || '',
      hours.monthly ? "Mensal" : "Não mensal"
    ].join(" ").toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading resource hours</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar horas por oferta, recurso, quantidade ou tipo... (use espaços para pesquisar múltiplos termos)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Monthly</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResourceHours.map((hours) => (
              <TableRow key={`${hours.idoffer}-${hours.idresource}`}>
                <TableCell>{hours.offers?.descoffer || 'N/A'}</TableCell>
                <TableCell>{hours.resources?.description || 'N/A'}</TableCell>
                <TableCell>{hours.hours}</TableCell>
                <TableCell>{hours.monthly ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(hours)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setDeleteConfirmation({
                        idoffer: hours.idoffer,
                        idresource: hours.idresource,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteConfirmation}
        onOpenChange={() => setDeleteConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resource hours record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmation) {
                  onDelete(
                    deleteConfirmation.idoffer,
                    deleteConfirmation.idresource
                  );
                }
                setDeleteConfirmation(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}