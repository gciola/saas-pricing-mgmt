import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(product)
          .eq("idproduct", editingProduct.idproduct);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(product);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
      setEditingProduct(null);
      toast({
        title: "Success",
        description: `Product ${editingProduct ? "updated" : "created"} successfully`,
      });
    },
    onError: (error: Error) => {
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
    const product = {
      description: formData.get("description") as string,
      franchisetype: formData.get("franchisetype") as string,
      codproduct: formData.get("codproduct") as string,
      combo: formData.get("combo") === "on",
      modules: formData.get("modules") 
        ? JSON.parse(formData.get("modules") as string) 
        : null
    };
    mutation.mutate(product);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <PlusCircle className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="franchisetype"
                  className="block text-sm font-medium mb-1"
                >
                  Franchise Type
                </label>
                <Input
                  id="franchisetype"
                  name="franchisetype"
                  defaultValue={editingProduct?.franchisetype || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="codproduct"
                  className="block text-sm font-medium mb-1"
                >
                  Product Code
                </label>
                <Input
                  id="codproduct"
                  name="codproduct"
                  defaultValue={editingProduct?.codproduct || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="modules"
                  className="block text-sm font-medium mb-1"
                >
                  Modules (JSON)
                </label>
                <Textarea
                  id="modules"
                  name="modules"
                  defaultValue={editingProduct?.modules ? JSON.stringify(editingProduct.modules) : ""}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="combo"
                  name="combo"
                  defaultChecked={editingProduct?.combo || false}
                />
                <label
                  htmlFor="combo"
                  className="text-sm font-medium"
                >
                  Is Combo
                </label>
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? "Update" : "Create"} Product
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
            <TableHead>Franchise Type</TableHead>
            <TableHead>Product Code</TableHead>
            <TableHead>Is Combo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.idproduct}>
              <TableCell>{product.idproduct}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.franchisetype}</TableCell>
              <TableCell>{product.codproduct}</TableCell>
              <TableCell>{product.combo ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingProduct(product);
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

export default Products;