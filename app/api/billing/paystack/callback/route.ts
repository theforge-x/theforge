import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getAppUrl, verifyPaystackTransaction } from "@/lib/billing";
import { db } from "@/lib/db";
import { invoices, payments } from "@/lib/db/schema";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.redirect(
      `${getAppUrl()}/portal/invoices?payment=failed`,
    );
  }

  try {
    const result = await verifyPaystackTransaction(reference);
    const [payment] = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.provider, "paystack"),
          eq(payments.providerReference, reference),
        ),
      )
      .limit(1);
    if (
      !payment ||
      result.status !== "success" ||
      result.amount !== payment.amountCents ||
      result.currency !== payment.currency
    ) {
      throw new Error("Payment verification did not match the invoice");
    }

    await db.transaction(async (tx) => {
      await tx
        .update(payments)
        .set({
          status: "paid",
          paidAt: result.paid_at ? new Date(result.paid_at) : new Date(),
          providerPayload: result,
        })
        .where(eq(payments.id, payment.id));
      await tx
        .update(invoices)
        .set({ status: "paid" })
        .where(eq(invoices.id, payment.invoiceId));
    });
    return NextResponse.redirect(
      `${getAppUrl()}/portal/invoices?payment=success`,
    );
  } catch (error) {
    console.error("Paystack callback verification failed", error);
    return NextResponse.redirect(
      `${getAppUrl()}/portal/invoices?payment=failed`,
    );
  }
}
