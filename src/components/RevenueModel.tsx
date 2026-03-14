import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const RevenueModel = () => {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      numericPrice: 0,
      features: [
        "10 Fact Checks / day",
        "Basic AI analysis",
        "Limited evidence sources"
      ]
    },
    {
      name: "Pro Plan",
      price: "₹299 / month",
      numericPrice: 29900, // In paise (299 * 100)
      features: [
        "Unlimited fact checks",
        "Advanced evidence analysis",
        "Priority AI processing"
      ]
    },
    {
      name: "Enterprise Plan",
      price: "₹999 / month",
      numericPrice: 99900, // In paise (999 * 100)
      features: [
        "Fact-checking API",
        "Misinformation monitoring",
        "Dashboard analytics"
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChoosePlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
  };

  const handleRazorpayPayment = () => {
    if (!selectedPlan) return;

    if (selectedPlan.numericPrice === 0) {
      handleFinalCheckout();
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_demo_key", // This should be replaced with a real key from .env (e.g. import.meta.env.VITE_RAZORPAY_KEY_ID)
      amount: selectedPlan.numericPrice,
      currency: "INR",
      name: "UNNATI — Guardian of Truth",
      description: `Subscription: ${selectedPlan.name}`,
      image: "/icon.svg",
      handler: function (response: any) {
        toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        handleFinalCheckout();
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999"
      },
      notes: {
        plan: selectedPlan.name
      },
      theme: {
        color: "#00f2fe"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          toast.info("Payment cancelled");
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleFinalCheckout = () => {
    toast.success(`Successfully subscribed to the ${selectedPlan?.name}!`);
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <div className="mt-10 p-6 border rounded-xl bg-card border-border shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 font-display text-primary">
        Revenue Model
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="border rounded-lg p-5 bg-background border-border shadow font-sans flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2 font-display text-foreground">
              {plan.name}
            </h3>

            <p className="text-2xl font-bold text-primary mb-4 font-display">
              {plan.price}
            </p>

            <ul className="text-sm space-y-2 text-muted-foreground flex-grow mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-primary">✔</span> {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleChoosePlan(plan)}
              className="mt-auto w-full bg-primary/20 hover:bg-primary/30 text-primary py-2.5 rounded-md font-medium transition-colors border border-primary/30"
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display">Checkout: {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Confirm your plan selection to proceed to secure payment via Razorpay.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium text-foreground">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-bold text-primary text-xl">{selectedPlan?.price}</span>
            </div>
            
            <div className="rounded-md bg-secondary/50 p-4 border border-border">
              <h4 className="text-sm font-semibold mb-2">Included Features:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {selectedPlan?.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary text-xs mt-0.5">■</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <button 
              onClick={() => setSelectedPlan(null)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-md border border-border hover:bg-secondary text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className="px-4 py-2 flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-[0_0_15px_rgba(var(--primary),0.5)] disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                selectedPlan?.numericPrice === 0 ? "Activate Now" : "Pay with Razorpay"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueModel;
