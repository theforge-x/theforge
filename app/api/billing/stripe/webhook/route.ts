import { and, eq } from "drizzle-orm";
import type Stripe from "stripe";

import { getStripe } from "@/lib/billing";
import { db } from "@/lib/db";
import { invoices, payments, webhookEvents } from "@/lib/db/schema";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret)
    return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({
        provider: "stripe",
        eventId: event.id,
        eventType: event.type,
        payload: event as unknown as Record<string, unknown>,
      })
      .onConflictDoNothing()
      .returning({ id: webhookEvents.id });
    if (inserted.length === 0) return;

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object;
      const invoiceId = checkout.metadata?.invoiceId;
      if (invoiceId && checkout.payment_status === "paid") {
        const [payment] = await tx
          .select()
          .from(payments)
          .where(
            and(
              eq(payments.provider, "stripe"),
              eq(payments.providerReference, checkout.id),
            ),
          )
          .limit(1);
        if (
          payment &&
          payment.invoiceId === invoiceId &&
          payment.amountCents === checkout.amount_total &&
          payment.currency.toLowerCase() === checkout.currency
        ) {
          await tx
            .update(payments)
            .set({
              status: "paid",
              paidAt: new Date(),
              providerPayload: checkout as unknown as Record<string, unknown>,
            })
            .where(eq(payments.id, payment.id));
          await tx
            .update(invoices)
            .set({ status: "paid" })
            .where(eq(invoices.id, invoiceId));
        }
      }
    } else if (event.type === "checkout.session.expired") {
      await tx
        .update(payments)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(payments.provider, "stripe"),
            eq(payments.providerReference, event.data.object.id),
          ),
        );
    }
  });

  return new Response("ok");
}
