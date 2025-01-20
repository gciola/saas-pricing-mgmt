import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [allowedDomain, setAllowedDomain] = useState("");

  useEffect(() => {
    // Fetch allowed domain from settings
    const fetchAllowedDomain = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("parameter", "DOMAIN")
        .single();

      if (error) {
        console.error("Error fetching allowed domain:", error);
        return;
      }
      setAllowedDomain(data?.value || "");
    };

    fetchAllowedDomain();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
      if (event === "SIGNED_UP") {
        const email = session?.user?.email;
        if (email && !email.endsWith(`@${allowedDomain}`)) {
          await supabase.auth.signOut();
          setErrorMessage("This email domain is not authorized");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, allowedDomain]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center mb-4">Gerenciador de Ofertas SaaS</CardTitle>
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
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                    inputBackground: 'hsl(var(--background))',
                    inputText: 'hsl(var(--foreground))',
                  },
                },
              },
            }}
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;