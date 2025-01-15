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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Edit2, Save, Trash2, X } from "lucide-react";
import { ResourceForm } from "./ResourceForm";

interface Resource {
  idresource: string;
  description: string;
  resourcetype: string;
  hourcost: number | null;
}

export function ResourcesTable() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCost, setEditedCost] = useState<string>("");
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
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
      return data as Resource[];
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("idresource", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      setDeleteConfirmOpen(false);
      setResourceToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
      console.error("Error deleting resource:", error);
    },
  });

  const formatCurrency = (value: number | null) => {
    if (value === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleStartEdit = (resource: Resource) => {
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

  const handleDelete = (resource: Resource) => {
    setResourceToDelete(resource.idresource);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      deleteMutation.mutate(resourceToDelete);
    }
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
            <TableHead className="w-[150px]">Actions</TableHead>
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
                <div className="flex gap-2">
                  {editingId === resource.idresource ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(resource)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingResource(resource)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Resource</DialogTitle>
                          </DialogHeader>
                          <ResourceForm
                            initialData={resource}
                            onSuccess={() => setEditingResource(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(resource)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}