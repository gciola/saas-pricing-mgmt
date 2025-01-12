import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Pencil } from "lucide-react";

type Franchise = {
  idfranchise: number;
  franchisetype: string | null;
  limits: number | null;
  frlabel: string;
};

const Franchises = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);

  const { data: franchises, isLoading } = useQuery({
    queryKey: ["franchises"],
    queryFn: async () => {
      const { data, error } = await supabase.from("franchise").select("*");
      if (error) throw error;
      return data as Franchise[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (franchise: Partial<Franchise>) => {
      if (editingFranchise) {
        const { error } = await supabase
          .from("franchise")
          .update(franchise)
          .eq("idfranchise", editingFranchise.idfranchise);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("franchise").insert(franchise);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["franchises"] });
      setIsOpen(false);
      setEditingFranchise(null);
      toast({
        title: "Success",
        description: `Franchise ${editingFranchise ? "updated" : "created"} successfully`,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const franchise = {
      frlabel: formData.get("frlabel") as string,
      franchisetype: formData.get("franchisetype") as string,
      limits: formData.get("limits") ? Number(formData.get("limits")) : null,
    };
    mutation.mutate(franchise);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Franchises</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFranchise(null)}>
              <PlusCircle className="mr-2" />
              Add Franchise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFranchise ? "Edit" : "Add"} Franchise</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="frlabel" className="block text-sm font-medium mb-1">
                  Label
                </label>
                <Input
                  id="frlabel"
                  name="frlabel"
                  defaultValue={editingFranchise?.frlabel}
                  required
                />
              </div>
              <div>
                <label htmlFor="franchisetype" className="block text-sm font-medium mb-1">
                  Franchise Type
                </label>
                <Input
                  id="franchisetype"
                  name="franchisetype"
                  defaultValue={editingFranchise?.franchisetype || ""}
                />
              </div>
              <div>
                <label htmlFor="limits" className="block text-sm font-medium mb-1">
                  Limits
                </label>
                <Input
                  id="limits"
                  name="limits"
                  type="number"
                  defaultValue={editingFranchise?.limits || ""}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingFranchise ? "Update" : "Create"} Franchise
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {franchises?.map((franchise) => (
            <TableRow key={franchise.idfranchise}>
              <TableCell>{franchise.idfranchise}</TableCell>
              <TableCell>{franchise.frlabel}</TableCell>
              <TableCell>{franchise.franchisetype}</TableCell>
              <TableCell>{franchise.limits}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingFranchise(franchise);
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Franchises;