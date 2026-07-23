import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";

import { getPaystackSecret } from "@/lib/billing";
import { db } from "@/lib/db";
import { invoices, payments, webhookEvents } from "@/lib/db/schema";

type PaystackEvent = {
  event: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const received = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", getPaystackSecret())
    .update(rawBody)
    .digest("hex");
  const valid =
    received.length === expected.length &&
    timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!valid) return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(rawBody) as PaystackEvent;
  const eventId = `${event.event}:${event.data.id}`;
  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({
        provider: "paystack",
        eventId,
        eventType: event.event,
        payload: event,
      })
      .onConflictDoNothing()
      .returning({ id: webhookEvents.id });
    if (inserted.length === 0) return;

    if (event.event === "charge.success" && event.data.status === "success") {
      const [payment] = await tx
        .select()
        .from(payments)
        .where(
          and(
            eq(payments.provider, "paystack"),
            eq(payments.providerReference, event.data.reference),
          ),
        )
        .limit(1);
      if (
        payment &&
        payment.amountCents === event.data.amount &&
        payment.currency === event.data.currency
      ) {
        await tx
          .update(payments)
          .set({
            status: "paid",
            paidAt: event.data.paid_at
              ? new Date(event.data.paid_at)
              : new Date(),
            providerPayload: event,
          })
          .where(eq(payments.id, payment.id));
        await tx
          .update(invoices)
          .set({ status: "paid" })
          .where(eq(invoices.id, payment.invoiceId));
      }
    }
  });

  return new Response("ok");
}
