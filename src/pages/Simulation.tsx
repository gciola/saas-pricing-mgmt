import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeButton } from "@/components/HomeButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type SimulationResult = {
  produtos: Array<{
    codoferta: string;
    descoferta: string;
    precounitario: number;
    fatliquido: number;
    custototal: number;
    margemvalor: number;
    margempercent: number;
  }>;
  resumo: {
    totalfatliquido: number;
    totalmargemvalor: number;
    totalmargempercent: number;
  };
};

export default function Simulation() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [contractDuration, setContractDuration] = useState("12");
  const [hubQty, setHubQty] = useState("1");
  const [partnerQty, setPartnerQty] = useState("1");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("description")
        .order("description");
      if (error) throw error;
      return data;
    },
  });

  const { data: franchises } = useQuery({
    queryKey: ["franchises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("franchise")
        .select("frlabel")
        .order("frlabel");
      if (error) throw error;
      return data;
    },
  });

  const handleSimulate = async () => {
    try {
      const { data, error } = await supabase.rpc("getbasepricedeal", {
        dealnr: "0",
        apidescproduct: selectedProduct,
        contractdur: parseInt(contractDuration),
        apifranchise: selectedFranchise,
        hubqty: parseInt(hubQty),
        partnerqty: parseInt(partnerQty),
      });

      if (error) throw error;
      setSimulationResult(data);
      toast({
        title: "Simulação realizada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar simulação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <HomeButton />
          <h1 className="text-2xl font-bold">Simulação de Margem</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Produto</label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.description} value={product.description}>
                  {product.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Franquia</label>
          <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma franquia" />
            </SelectTrigger>
            <SelectContent>
              {franchises?.map((franchise) => (
                <SelectItem key={franchise.frlabel} value={franchise.frlabel}>
                  {franchise.frlabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duração do Contrato</label>
          <Select value={contractDuration} onValueChange={setContractDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade Hub</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={hubQty}
            onChange={(e) => setHubQty(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade Parceiro</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={partnerQty}
            onChange={(e) => setPartnerQty(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={handleSimulate} className="w-full">
            Simular
          </Button>
        </div>
      </div>

      {simulationResult && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Produtos</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Faturamento Líquido</TableHead>
                  <TableHead>Custo Total</TableHead>
                  <TableHead>Margem (Valor)</TableHead>
                  <TableHead>Margem (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulationResult.produtos.map((produto) => (
                  <TableRow key={produto.codoferta}>
                    <TableCell>{produto.descoferta}</TableCell>
                    <TableCell>R$ {produto.precounitario.toFixed(2)}</TableCell>
                    <TableCell>R$ {produto.fatliquido.toFixed(2)}</TableCell>
                    <TableCell>R$ {produto.custototal.toFixed(2)}</TableCell>
                    <TableCell>R$ {produto.margemvalor.toFixed(2)}</TableCell>
                    <TableCell>{produto.margempercent.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Resumo</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faturamento Líquido Total</TableHead>
                  <TableHead>Margem Total (Valor)</TableHead>
                  <TableHead>Margem Total (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    R$ {simulationResult.resumo.totalfatliquido.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    R$ {simulationResult.resumo.totalmargemvalor.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {simulationResult.resumo.totalmargempercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}