import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  type BillingProvider,
  getAppUrl,
  getStripe,
  initializePaystackTransaction,
} from "@/lib/billing";
import { getOwnedInvoice } from "@/lib/data-access";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    invoiceId?: string;
    provider?: BillingProvider;
  } | null;
  if (
    !body?.invoiceId ||
    !["stripe", "paystack"].includes(body.provider ?? "")
  ) {
    return Response.json(
      { error: "Invalid checkout request" },
      { status: 400 },
    );
  }

  const invoice = await getOwnedInvoice(body.invoiceId, session.user.id);
  if (!invoice)
    return Response.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "paid") {
    return Response.json({ error: "Invoice is already paid" }, { status: 409 });
  }

  try {
    if (body.provider === "stripe") {
      const localPaymentId = randomUUID();
      const checkout = await getStripe().checkout.sessions.create({
        mode: "payment",
        customer_email: session.user.email,
        client_reference_id: invoice.id,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: invoice.currency.toLowerCase(),
              unit_amount: invoice.amountCents,
              product_data: { name: `The Forge invoice ${invoice.id}` },
            },
          },
        ],
        metadata: { invoiceId: invoice.id, paymentId: localPaymentId },
        success_url: `${getAppUrl()}/portal/invoices?payment=success`,
        cancel_url: `${getAppUrl()}/portal/invoices?payment=cancelled`,
      });

      if (!checkout.url)
        throw new Error("Stripe did not return a checkout URL");
      await db.insert(payments).values({
        id: localPaymentId,
        invoiceId: invoice.id,
        provider: "stripe",
        providerReference: checkout.id,
        amountCents: invoice.amountCents,
        currency: invoice.currency,
        checkoutUrl: checkout.url,
      });
      return Response.json({ url: checkout.url });
    }

    const reference = `forge-${randomUUID()}`;
    const [payment] = await db
      .insert(payments)
      .values({
        invoiceId: invoice.id,
        provider: "paystack",
        providerReference: reference,
        amountCents: invoice.amountCents,
        currency: invoice.currency,
      })
      .returning({ id: payments.id });

    try {
      const transaction = await initializePaystackTransaction({
        email: session.user.email,
        amountCents: invoice.amountCents,
        currency: invoice.currency,
        reference,
        invoiceId: invoice.id,
      });
      await db
        .update(payments)
        .set({ checkoutUrl: transaction.authorization_url })
        .where(eq(payments.id, payment.id));
      return Response.json({ url: transaction.authorization_url });
    } catch (error) {
      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.id, payment.id));
      throw error;
    }
  } catch (error) {
    console.error("Checkout creation failed", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 502 },
    );
  }
}
