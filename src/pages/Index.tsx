import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  Gift, 
  LayoutDashboard, 
  Wrench, 
  Server, 
  DollarSign, 
  Settings, 
  PieChart,
  Clock
} from "lucide-react";

const menuItems = [
  {
    title: "Gerencie seus Produtos",
    description: "Cadastre novos produtos de USC e de outras unidades de negócio.",
    icon: Package,
    path: "/products",
    action: "Acessar Produtos"
  },
  {
    title: "Edite as franquias de ofertas",
    description: "Franquia são faixas por volume e tamanho das empresas definidas por produto, alterando o preço e custo das ofertas",
    icon: Users,
    path: "/franchises",
    action: "Acessar Franquias"
  },
  {
    title: "Gerencie suas ofertas",
    description: "Adicione todas as ofertas no maior nível de granularidade, definindo recorrência, franquia e produto associados.",
    icon: Gift,
    path: "/offers",
    action: "Acessar Ofertas"
  },
  {
    title: "Agrupe suas ofertas",
    description: "Agrupe as ofertas compatíveis com a apresentação de propostas para cada tipo de exposição (Setup/Recorrente).",
    icon: LayoutDashboard,
    path: "/offer-groups",
    action: "Acessar Grupos de Oferta"
  },
  {
    title: "Adicione o esforço",
    description: "Determine o esforço em horas de cada oferta abertos por recurso, definindo se o esforço é mensal ou unitário.",
    icon: Clock,
    path: "/resource-hours",
    action: "Acessar Esforço"
  },
  {
    title: "Gerencie seus recursos",
    description: "Defina recursos humanos por atividade e cargo e os respectivos custos por hora trabalhada.",
    icon: Wrench,
    path: "/resources",
    action: "Acessar Recursos"
  },
  {
    title: "Defina custos de hosting",
    description: "Defina o % da receita que represente o custo de infraestrutura para suportar as soluções no período contratado.",
    icon: Server,
    path: "/hosting",
    action: "Acessar Custos de Hosting"
  },
  {
    title: "Gerencie os preços base",
    description: "Defina os preços no nível mais granular das ofertas, separados por Setup (unitário e Recorrente periódico).",
    icon: DollarSign,
    path: "/pricing",
    action: "Acessar Preços"
  },
  {
    title: "Altere parâmetros gerais",
    description: "Defina parâmetros de comissionamento, custos de infra, custos de disparo e link com CRM.",
    icon: Settings,
    path: "/settings",
    action: "Acessar Parâmetros Gerais"
  },
  {
    title: "Simule a margem",
    description: "Efetue simulações de ofertas com parâmetros de produto, franquia, duração de contrato e quantidades por tipo.",
    icon: PieChart,
    path: "/simulation",
    action: "Simular Margem"
  }
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold mb-4">Gerenciador de Ofertas SaaS</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Gerencie as ofertas SaaS da sua empresa adicionando produtos, ofertas,
              agrupamento de ofertas, custos diversos e obtenha as margens efetivas em
              suas propostas comerciais.
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              As alterações efetuadas nos dados refletirão na precificação das
              propostas adicionadas no CRM Bitrix24 da sua empresa
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Card 
              key={item.path} 
              className="bg-[#132F4C] border-[#1E4976] hover:border-[#2977CC] transition-all duration-300 group flex flex-col h-full"
            >
              <CardHeader className="flex-grow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#173A5E] group-hover:bg-[#2977CC] transition-colors shrink-0">
                    <item.icon className="h-6 w-6 text-[#66B2FF]" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Button 
                  className="w-full bg-[#173A5E] hover:bg-[#2977CC] text-white border-none h-11"
                  onClick={() => navigate(item.path)}
                >
                  {item.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}