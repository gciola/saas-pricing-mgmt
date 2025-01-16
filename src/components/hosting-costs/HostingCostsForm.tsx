import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface HostingCost {
  idproduct: number;
  hcost: number;
}

interface HostingCostsFormProps {
  editingCost: HostingCost | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function HostingCostsForm({ editingCost, onSubmit }: HostingCostsFormProps) {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("idproduct, description")
        .order('description');
      if (error) throw error;
      return data;
    },
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="idproduct">Product</Label>
        <Select 
          name="idproduct" 
          defaultValue={editingCost?.idproduct?.toString()}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product) => (
              <SelectItem 
                key={product.idproduct} 
                value={product.idproduct.toString()}
              >
                {product.description || `Product ${product.idproduct}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="hcost">Hosting Cost (%)</Label>
        <div className="pt-2">
          <Slider
            name="hcost"
            defaultValue={[editingCost ? editingCost.hcost * 100 : 0]}
            max={100}
            step={1}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {editingCost ? "Update" : "Create"}
      </Button>
    </form>
  );
}