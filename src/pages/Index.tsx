import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, Gift, Package, Wrench } from "lucide-react";

const menuItems = [
  {
    title: "Products",
    description: "Manage your product catalog",
    icon: Package,
    path: "/products",
  },
  {
    title: "Franchises",
    description: "Manage franchise operations",
    icon: Users,
    path: "/franchises",
  },
  {
    title: "Offers",
    description: "Create and manage offers",
    icon: Gift,
    path: "/offers",
  },
  {
    title: "Offer Groups",
    description: "Organize offers into groups",
    icon: LayoutDashboard,
    path: "/offer-groups",
  },
  {
    title: "Resources",
    description: "Manage resources and costs",
    icon: Wrench,
    path: "/resources",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.path} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(item.path)}
                >
                  Access {item.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}