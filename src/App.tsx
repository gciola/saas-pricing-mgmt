import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Products from "@/pages/Products";
import Franchises from "@/pages/Franchises";
import Offers from "@/pages/Offers";
import OfferGroups from "@/pages/OfferGroups";
import Resources from "@/pages/Resources";
import ResourceHours from "@/pages/ResourceHours";
import HostingCosts from "@/pages/HostingCosts";
import Pricing from "@/pages/Pricing";
import Settings from "@/pages/Settings";
import Simulation from "@/pages/Simulation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Sidebar />
              <main className="lg:pl-64 pt-14">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/franchises"
                element={
                  <ProtectedRoute>
                    <Franchises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offers"
                element={
                  <ProtectedRoute>
                    <Offers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offer-groups"
                element={
                  <ProtectedRoute>
                    <OfferGroups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-hours"
                element={
                  <ProtectedRoute>
                    <ResourceHours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hosting"
                element={
                  <ProtectedRoute>
                    <HostingCosts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <ProtectedRoute>
                    <Pricing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/simulation"
                element={
                  <ProtectedRoute>
                    <Simulation />
                  </ProtectedRoute>
                }
              />
                </Routes>
              </main>
            </div>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
