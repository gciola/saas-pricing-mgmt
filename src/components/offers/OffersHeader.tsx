import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface OffersHeaderProps {
  onAddOffer: () => void;
}

export function OffersHeader({ onAddOffer }: OffersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Offers</h1>
      </div>
      <Button onClick={onAddOffer}>
        <Plus className="mr-2" />
        Add Offer
      </Button>
    </div>
  );
}