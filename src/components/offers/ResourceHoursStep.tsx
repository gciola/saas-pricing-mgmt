import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResourceHoursStepProps {
  offer: any;
  onSubmit: (data: any) => void;
  editOnly?: boolean;
}

export function ResourceHoursStep({
  offer,
  onSubmit,
  editOnly = false,
}: ResourceHoursStepProps) {
  const [resourceHours, setResourceHours] = useState<Record<string, any>>({});

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("description");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: existingHours } = useQuery({
    queryKey: ["resourceHours", offer.idoffer],
    queryFn: async () => {
      if (!offer.idoffer) return [];
      const { data, error } = await supabase
        .from("resourcehours")
        .select("*")
        .eq("idoffer", offer.idoffer);
      if (error) throw error;
      return data || [];
    },
  });

  // Update resource hours when existing data is loaded
  if (existingHours && Object.keys(resourceHours).length === 0) {
    const hoursMap = existingHours.reduce((acc: Record<string, any>, curr: any) => {
      acc[curr.idresource] = {
        hours: curr.hours,
        monthly: curr.monthly,
      };
      return acc;
    }, {});
    setResourceHours(hoursMap);
  }

  if (isLoading) return <div>Loading...</div>;

  const handleSubmit = () => {
    const resourceHoursData = Object.entries(resourceHours)
      .filter(([_, value]) => value.hours > 0)
      .map(([idresource, value]) => ({
        idoffer: offer.idoffer,
        idresource,
        hours: Number(value.hours),
        monthly: value.monthly,
      }));

    onSubmit({ resourceHours: resourceHoursData });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Monthly</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources?.map((resource) => (
            <TableRow key={resource.idresource}>
              <TableCell>{resource.description}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={resourceHours[resource.idresource]?.hours || 0}
                  onChange={(e) =>
                    setResourceHours((prev) => ({
                      ...prev,
                      [resource.idresource]: {
                        ...prev[resource.idresource],
                        hours: e.target.value,
                      },
                    }))
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={resourceHours[resource.idresource]?.monthly || false}
                  onCheckedChange={(checked) =>
                    setResourceHours((prev) => ({
                      ...prev,
                      [resource.idresource]: {
                        ...prev[resource.idresource],
                        monthly: checked,
                      },
                    }))
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleSubmit} className="w-full">
        {editOnly ? "Save Changes" : "Next Step"}
      </Button>
    </div>
  );
}