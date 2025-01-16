import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SettingsTable } from "@/components/settings/SettingsTable";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HomeButton } from "@/components/HomeButton";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<{
    parameter: string;
    value: string | null;
  } | null>(null);
  const { toast } = useToast();

  const { data: settings, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .order("parameter");

      if (error) {
        console.error("Error fetching settings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch settings",
        });
        return [];
      }

      return data;
    },
  });

  const handleEdit = (settings: { parameter: string; value: string | null }) => {
    setEditingSettings(settings);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingSettings(null);
    setOpen(false);
  };

  const handleSuccess = () => {
    refetch();
    handleClose();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <HomeButton />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <SettingsTable
        settings={settings || []}
        onEdit={handleEdit}
        onAdd={() => setOpen(true)}
        onSuccess={handleSuccess}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <SettingsForm
            settings={editingSettings}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}