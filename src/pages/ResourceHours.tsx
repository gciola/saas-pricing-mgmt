import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResourceHoursTable } from "@/components/resource-hours/ResourceHoursTable";
import { ResourceHoursForm } from "@/components/resource-hours/ResourceHoursForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HomeButton } from "@/components/HomeButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ResourceHours {
  idoffer: string;
  idresource: string;
  hours: number;
  monthly: boolean;
}

export default function ResourceHours() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHours, setEditingHours] = useState<ResourceHours | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ResourceHours) => {
      if (editingHours) {
        const { error } = await supabase
          .from("resourcehours")
          .update(data)
          .eq("idoffer", editingHours.idoffer)
          .eq("idresource", editingHours.idresource);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resourcehours").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceHours"] });
      setIsDialogOpen(false);
      setEditingHours(null);
      toast({
        title: "Success",
        description: editingHours
          ? "Resource hours updated successfully"
          : "Resource hours created successfully",
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
    mutationFn: async ({
      idoffer,
      idresource,
    }: {
      idoffer: string;
      idresource: string;
    }) => {
      const { error } = await supabase
        .from("resourcehours")
        .delete()
        .eq("idoffer", idoffer)
        .eq("idresource", idresource);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceHours"] });
      toast({
        title: "Success",
        description: "Resource hours deleted successfully",
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <HomeButton />
          <h1 className="text-3xl font-bold">Resource Hours</h1>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Resource Hours
        </Button>
      </div>

      <ResourceHoursTable
        onEdit={(hours) => {
          setEditingHours(hours);
          setIsDialogOpen(true);
        }}
        onDelete={(idoffer, idresource) =>
          deleteMutation.mutate({ idoffer, idresource })
        }
      />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingHours(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHours ? "Edit Resource Hours" : "Add Resource Hours"}
            </DialogTitle>
          </DialogHeader>
          <ResourceHoursForm
            editingHours={editingHours || undefined}
            onSubmit={(data) => mutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}