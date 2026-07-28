import Stripe from "stripe";
import { getSiteUrl } from "@/lib/site-url";

export type BillingProvider = "stripe" | "paystack";

export function getAppUrl() {
  return getSiteUrl();
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export function getPaystackSecret() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountCents: number;
  currency: string;
  reference: string;
  invoiceId: string;
}) {
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getPaystackSecret()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountCents,
        currency: input.currency,
        reference: input.reference,
        callback_url: `${getAppUrl()}/api/billing/paystack/callback`,
        metadata: { invoiceId: input.invoiceId },
      }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as {
    status: boolean;
    message: string;
    data?: { authorization_url: string; reference: string };
  };
  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Paystack initialization failed");
  }
  return payload.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getPaystackSecret()}` },
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as {
    status: boolean;
    message: string;
    data?: {
      status: string;
      reference: string;
      amount: number;
      currency: string;
      paid_at?: string;
      metadata?: { invoiceId?: string };
    };
  };
  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Paystack verification failed");
  }
  return payload.data;
}
