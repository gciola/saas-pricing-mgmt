import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HomeButton = () => {
  return (
    <Link to="/">
      <Button variant="ghost" size="icon">
        <Home className="h-5 w-5" />
      </Button>
    </Link>
  );
};