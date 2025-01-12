import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">USC Pricing</h1>
            <Button onClick={handleLogout} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button
            onClick={() => navigate("/products")}
            className="h-32 text-lg"
            variant="outline"
          >
            Products Management
          </Button>
          {/* Add more navigation buttons here as we implement other features */}
        </div>
      </div>
    </div>
  );
};

export default Index;