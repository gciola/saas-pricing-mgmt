import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SettingsTableProps {
  settings: Array<{
    parameter: string;
    value: string | null;
  }>;
  onEdit: (settings: { parameter: string; value: string | null }) => void;
  onAdd: () => void;
  onSuccess: () => void;
}

export function SettingsTable({
  settings,
  onEdit,
  onAdd,
  onSuccess,
}: SettingsTableProps) {
  const [deleteParameter, setDeleteParameter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deleteParameter) return;

    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("parameter", deleteParameter);

    if (error) {
      console.error("Error deleting setting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete setting",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Setting deleted successfully",
    });
    onSuccess();
    setDeleteParameter(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Setting
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((setting) => (
              <TableRow key={setting.parameter}>
                <TableCell>{setting.parameter}</TableCell>
                <TableCell>{setting.value}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(setting)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteParameter(setting.parameter)}
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

      <AlertDialog
        open={!!deleteParameter}
        onOpenChange={() => setDeleteParameter(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              setting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}