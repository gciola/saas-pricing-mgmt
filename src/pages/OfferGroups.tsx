import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/HomeButton";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

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
          <HomeButton />
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                mutation.mutate({
                  idgroup: formData.get("idgroup") as string,
                  descgroup: formData.get("descgroup") as string,
                  grouptype: formData.get("grouptype") as string,
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="idgroup">Group ID</Label>
                <Input
                  id="idgroup"
                  name="idgroup"
                  defaultValue={editingGroup?.idgroup}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descgroup">Description</Label>
                <Input
                  id="descgroup"
                  name="descgroup"
                  defaultValue={editingGroup?.descgroup}
                  required
                />
              </div>
              <div>
                <Label htmlFor="grouptype">Group Type</Label>
                <Input
                  id="grouptype"
                  name="grouptype"
                  defaultValue={editingGroup?.grouptype}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingGroup ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                    onClick={() => {
                      setEditingGroup(group);
                      setIsOpen(true);
                    }}
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
                        deleteMutation.mutate(group.idgroup);
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
    </div>
  );
}
