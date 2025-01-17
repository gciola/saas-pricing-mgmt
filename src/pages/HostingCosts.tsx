import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeButton } from "@/components/HomeButton";
import { HostingCostsTable } from "@/components/hosting-costs/HostingCostsTable";
import { HostingCostsForm } from "@/components/hosting-costs/HostingCostsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";

type HostingCost = {
  idproduct: number;
  hcost: number | null;
};

export default function HostingCosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<HostingCost | null>(null);

  const { data: hostingCosts, isLoading } = useQuery({
    queryKey: ["hostingCosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hostingcosts")
        .select("*, products(description)")
        .order('idproduct');
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (hostingCost: HostingCost) => {
      if (editingCost) {
        const { error } = await supabase
          .from("hostingcosts")
          .update({ hcost: hostingCost.hcost })
          .eq("idproduct", editingCost.idproduct);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hostingcosts")
          .insert({ 
            idproduct: hostingCost.idproduct,
            hcost: hostingCost.hcost 
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostingcosts"] });
      setIsOpen(false);
      setEditingCost(null);
      toast({
        title: "Success",
        description: `Hosting cost ${editingCost ? "updated" : "created"} successfully`,
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

  const deleteMutation = useMutation({
    mutationFn: async (idproduct: number) => {
      const { error } = await supabase
        .from("hostingcosts")
        .delete()
        .eq("idproduct", idproduct);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostingCosts"] });
      toast({
        title: "Success",
        description: "Hosting cost deleted successfully",
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <HomeButton />
          <h1 className="text-2xl font-bold">Hosting Costs</h1>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCost(null)}>
              <PlusCircle className="mr-2" />
              Add Hosting Cost
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCost ? "Edit" : "Add"} Hosting Cost
              </DialogTitle>
            </DialogHeader>
            <HostingCostsForm
              editingCost={editingCost}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const cost = {
                  idproduct: Number(formData.get("idproduct")),
                  hcost: Number(formData.get("hcost")) / 100, // Convert percentage to decimal
                };
                mutation.mutate(cost);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <HostingCostsTable
        hostingCosts={hostingCosts}
        onEdit={(cost) => {
          setEditingCost(cost);
          setIsOpen(true);
        }}
        onDelete={(idproduct) => {
          if (window.confirm("Are you sure you want to delete this hosting cost?")) {
            deleteMutation.mutate(idproduct);
          }
        }}
      />
    </div>
  );
}