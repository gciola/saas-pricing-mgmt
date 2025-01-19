import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import { Header } from "./Header";

const menuItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/products", label: "Products" },
  { path: "/franchises", label: "Franchises" },
  { path: "/offers", label: "Offers" },
  { path: "/offer-groups", label: "Offer Groups" },
  { path: "/resources", label: "Resources" },
  { path: "/resource-hours", label: "Resource Hours" },
  { path: "/hosting", label: "Hosting Costs" },
  { path: "/pricing", label: "Pricing" },
  { path: "/settings", label: "Settings" },
  { path: "/simulation", label: "Simulation" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't render the sidebar on the auth page
  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <>
      <Header toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div
        className={cn(
          "fixed inset-y-14 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}