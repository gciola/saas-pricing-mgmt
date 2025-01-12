import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Admin Panel</h1>
      <div className="grid gap-4">
        <Link to="/products">
          <Button className="w-full">Manage Products</Button>
        </Link>
        <Link to="/franchises">
          <Button className="w-full">Manage Franchises</Button>
        </Link>
      </div>
    </div>
  );
}