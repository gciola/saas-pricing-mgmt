import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferForm } from "./OfferForm";
import { ResourceHoursStep } from "./ResourceHoursStep";
import { PricingStep } from "./PricingStep";
import { cn } from "@/lib/utils";

interface OfferStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingOffer: any | null;
  onSubmit: (data: any) => void;
  offerGroups: any[];
  mode?: "full" | "resources" | "pricing";
}

export function OfferStepsModal({
  isOpen,
  onClose,
  editingOffer,
  onSubmit,
  offerGroups,
  mode = "full",
}: OfferStepsModalProps) {
  const [currentStep, setCurrentStep] = useState(
    mode === "resources" ? 2 : mode === "pricing" ? 3 : 1
  );
  const [offerData, setOfferData] = useState<any>(editingOffer || {});

  const steps = [
    { number: 1, title: "Offer Details" },
    { number: 2, title: "Resource Hours" },
    { number: 3, title: "Pricing" },
  ];

  const handleStepSubmit = async (stepData: any) => {
    const newData = { ...offerData, ...stepData };
    setOfferData(newData);

    if (currentStep === 3 || mode !== "full") {
      await onSubmit(newData);
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingOffer ? "Edit" : "Create"} Offer{" "}
            {mode !== "full" && `- ${steps[currentStep - 1].title}`}
          </DialogTitle>
        </DialogHeader>

        {mode === "full" && (
          <div className="flex justify-between mb-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "flex items-center",
                  step.number !== steps.length && "w-full"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {step.number}
                </div>
                <div
                  className={cn(
                    "ml-2",
                    currentStep >= step.number && "text-primary"
                  )}
                >
                  {step.title}
                </div>
                {step.number !== steps.length && (
                  <div
                    className={cn(
                      "h-0.5 w-full mx-4",
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <OfferForm
            editingOffer={editingOffer}
            offerGroups={offerGroups}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleStepSubmit({
                idoffer: formData.get("idoffer"),
                descoffer: formData.get("descoffer"),
                idfranchise: formData.get("idfranchise")
                  ? Number(formData.get("idfranchise"))
                  : null,
                parceltype: formData.get("parceltype"),
                payer: formData.get("payer"),
                quantity1: formData.get("quantity1") === "on",
                idgroup: formData.get("idgroup"),
                idproduct: formData.get("idproduct")
                  ? Number(formData.get("idproduct"))
                  : null,
              });
            }}
          />
        )}

        {currentStep === 2 && (
          <ResourceHoursStep
            offer={offerData}
            onSubmit={handleStepSubmit}
            editOnly={mode !== "full"}
          />
        )}

        {currentStep === 3 && (
          <PricingStep
            offer={offerData}
            onSubmit={handleStepSubmit}
            editOnly={mode !== "full"}
          />
        )}

        {mode === "full" && currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-4"
          >
            Previous Step
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}