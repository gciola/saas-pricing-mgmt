import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ThemeToggle";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch allowed domain from settings
  const { data: domainSetting } = useQuery({
    queryKey: ["settings", "DOMAIN"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("parameter", "DOMAIN")
        .single();
      
      if (error) throw error;
      return data?.value;
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check if user's email domain matches the allowed domain
        const userEmail = session.user.email;
        if (userEmail && domainSetting && !userEmail.endsWith(domainSetting)) {
          await supabase.auth.signOut();
          setErrorMessage(`Only emails with domain ${domainSetting} are allowed.`);
          return;
        }
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, domainSetting]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold mb-4">Gerenciador de Ofertas SaaS</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Faça login para gerenciar as ofertas SaaS da sua empresa.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <SupabaseAuth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'rgb(var(--primary))',
                        brandAccent: 'rgb(var(--primary))',
                      },
                    },
                  },
                }}
                providers={["google"]}
                redirectTo={`${window.location.origin}/auth/callback`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;