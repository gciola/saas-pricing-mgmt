import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Save, X } from "lucide-react";

export function ResourcesTable() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCost, setEditedCost] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("idresource");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, cost }: { id: string; cost: number }) => {
      const { error } = await supabase
        .from("resources")
        .update({ hourcost: cost })
        .eq("idresource", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Success",
        description: "Hour cost updated successfully",
      });
      setEditingId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update hour cost",
        variant: "destructive",
      });
      console.error("Error updating hour cost:", error);
    },
  });

  const formatCurrency = (value: number | null) => {
    if (value === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleStartEdit = (resource: any) => {
    setEditingId(resource.idresource);
    setEditedCost(resource.hourcost?.toString() || "0");
  };

  const handleSave = async (id: string) => {
    const numericValue = parseFloat(editedCost.replace(/[^\d,.-]/g, "").replace(",", "."));
    if (isNaN(numericValue)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    await updateMutation.mutate({ id, cost: numericValue });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Resource Type</TableHead>
            <TableHead>Hour Cost</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources?.map((resource) => (
            <TableRow key={resource.idresource}>
              <TableCell>{resource.idresource}</TableCell>
              <TableCell>{resource.description}</TableCell>
              <TableCell>{resource.resourcetype}</TableCell>
              <TableCell>
                {editingId === resource.idresource ? (
                  <Input
                    value={editedCost}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d,.-]/g, "");
                      setEditedCost(value);
                    }}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(resource.hourcost)
                )}
              </TableCell>
              <TableCell>
                {editingId === resource.idresource ? (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(resource.idresource)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartEdit(resource)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}