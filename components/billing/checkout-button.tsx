"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { BillingProvider } from "@/lib/billing";

export function CheckoutButton({
  invoiceId,
  provider,
}: {
  invoiceId: string;
  provider: BillingProvider;
}) {
  const [pending, setPending] = useState(false);

  async function checkout() {
    setPending(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, provider }),
      });
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !payload.url)
        throw new Error(payload.error ?? "Checkout failed");
      window.location.assign(payload.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
      setPending(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={checkout} disabled={pending}>
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <CreditCard className="size-3.5" />
      )}
      {provider === "stripe" ? "Stripe" : "Paystack"}
    </Button>
  );
}
