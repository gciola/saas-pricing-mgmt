import { useState } from "react";
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

interface PricingTableProps {
  onEdit: (pricing: {
    idoffer: string;
    baseprice: number;
    version: number;
    current: boolean;
  }) => void;
  onDelete: (idoffer: string, version: number) => void;
}

export function PricingTable({ onEdit, onDelete }: PricingTableProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    idoffer: string;
    version: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pricing, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing")
        .select(`
          *,
          offers:idoffer (
            descoffer
          )
        `)
        .order('idoffer');
      if (error) throw error;
      return data;
    },
  });

  const filteredPricing = pricing?.filter((price) => {
    if (!searchTerm) return true;
    const searchTerms = searchTerm.toLowerCase().split(" ").filter(Boolean);
    const searchableText = [
      price.offers?.descoffer,
      price.baseprice.toString(),
      price.version.toString(),
      price.current ? "Sim" : "Não"
    ].join(" ").toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar preços por oferta, preço base, versão ou status... (use espaços para pesquisar múltiplos termos)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Current</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPricing?.map((price) => (
            <TableRow key={`${price.idoffer}-${price.version}`}>
              <TableCell>{price.offers?.descoffer}</TableCell>
              <TableCell>{price.baseprice}</TableCell>
              <TableCell>{price.version}</TableCell>
              <TableCell>{price.current ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(price)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setDeleteConfirmation({
                      idoffer: price.idoffer,
                      version: price.version,
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
              pricing record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmation) {
                  onDelete(
                    deleteConfirmation.idoffer,
                    deleteConfirmation.version
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
