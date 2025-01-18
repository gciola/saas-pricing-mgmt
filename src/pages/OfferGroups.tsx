import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { OfferGroupForm } from "@/components/offer-groups/OfferGroupForm";
import { OfferGroupsTable } from "@/components/offer-groups/OfferGroupsTable";

interface OfferGroup {
  idgroup: string;
  descgroup: string;
  grouptype: string;
}

export default function OfferGroups() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OfferGroup | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offerGroups, isLoading } = useQuery({
    queryKey: ["offerGroups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offergroup").select("*");
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (group: OfferGroup) => {
      if (editingGroup) {
        const { error } = await supabase
          .from("offergroup")
          .update(group)
          .eq("idgroup", editingGroup.idgroup);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offergroup").insert(group);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerGroups"] });
      setIsOpen(false);
      setEditingGroup(null);
      toast({
        title: `Offer Group ${editingGroup ? "updated" : "created"} successfully`,
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
    mutationFn: async (idgroup: string) => {
      const { error } = await supabase
        .from("offergroup")
        .delete()
        .eq("idgroup", idgroup);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerGroups"] });
      toast({
        title: "Offer Group deleted successfully",
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Offer Groups</h1>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Add Offer Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? "Edit Offer Group" : "Create Offer Group"}
              </DialogTitle>
            </DialogHeader>
            <OfferGroupForm
              editingGroup={editingGroup}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                mutation.mutate({
                  idgroup: formData.get("idgroup") as string,
                  descgroup: formData.get("descgroup") as string,
                  grouptype: formData.get("grouptype") as string,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <OfferGroupsTable
        offerGroups={offerGroups}
        onEdit={(group) => {
          setEditingGroup(group);
          setIsOpen(true);
        }}
        onDelete={(idgroup) => deleteMutation.mutate(idgroup)}
      />
    </div>
  );
}
