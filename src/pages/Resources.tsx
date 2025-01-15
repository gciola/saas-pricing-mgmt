import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ResourcesTable } from "@/components/resources/ResourcesTable";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Resources() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resources Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      <ResourcesTable />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <ResourceForm onSuccess={() => {
            setIsDialogOpen(false);
            toast({
              title: "Success",
              description: "Resource created successfully",
            });
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}