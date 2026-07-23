import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads, salesQuotes } from "@/lib/db/schema";
import { getSalesApiSession } from "@/lib/sales-auth";

const item = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(500),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().min(0),
  billing: z.enum(["one-time", "monthly"]).default("one-time"),
  category: z.string().max(100).default("Custom"),
});
const discovery = z.object({
  industry: z.string().max(120).default(""),
  primaryGoal: z.string().max(500).default(""),
  currentState: z.string().max(1000).default(""),
  urgency: z.string().max(80).default("Flexible"),
  budget: z.string().max(80).default("Not confirmed"),
});
const quote = z
  .object({
    id: z.string().optional(),
    leadId: z.string().nullable().optional(),
    leadName: z.string().trim().min(1).max(160),
    leadEmail: z.string().trim().email(),
    company: z.string().trim().min(1).max(160),
    phone: z.string().max(60).optional(),
    title: z.string().trim().min(1).max(200),
    status: z.enum(["draft", "sent", "accepted", "declined"]),
    currency: z.string().length(3),
    items: z.array(item),
    discovery,
    discountPercent: z.coerce.number().int().min(0).max(100),
    depositPercent: z.coerce.number().int().min(0).max(100),
    estimatedTimeline: z.string().trim().min(1).max(120),
    paymentTerms: z.string().trim().min(1).max(500),
    notes: z.string().max(3000),
    validUntil: z.string().date(),
    trainingMode: z.boolean(),
    scenario: z.string().max(200).nullable().optional(),
  })
  .superRefine((value, context) => {
    if (value.status !== "draft" && value.items.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Add at least one scope item before sharing the quote",
        path: ["items"],
      });
    }
  });
function scope(
  session: { user: { id: string; role?: string | null } },
  ownerId: string | null,
) {
  return hasRole(session.user.role, "admin") || ownerId === session.user.id;
}
export async function POST(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const value = quote.parse(await request.json());
    const result = await db.transaction(async (tx) => {
      let leadId = value.leadId;
      if (!leadId) {
        const [lead] = await tx
          .insert(leads)
          .values({
            ownerId: session.user.id,
            name: value.leadName,
            email: value.leadEmail.toLowerCase(),
            company: value.company,
            phone: value.phone,
            status: value.status === "draft" ? "qualified" : "proposal",
          })
          .returning({ id: leads.id });
        leadId = lead.id;
      }
      const [created] = await tx
        .insert(salesQuotes)
        .values({
          leadId,
          ownerId: session.user.id,
          quoteNumber: `F-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
          title: value.title,
          status: value.status,
          currency: value.currency.toUpperCase(),
          items: value.items,
          discovery: value.discovery,
          discountPercent: value.discountPercent,
          depositPercent: value.depositPercent,
          estimatedTimeline: value.estimatedTimeline,
          paymentTerms: value.paymentTerms,
          notes: value.notes,
          validUntil: value.validUntil,
          shareToken: randomUUID(),
          trainingMode: value.trainingMode,
          scenario: value.scenario,
        })
        .returning({ id: salesQuotes.id, shareToken: salesQuotes.shareToken });
      if (value.status !== "draft")
        await tx
          .update(leads)
          .set({ status: value.status === "accepted" ? "won" : "proposal" })
          .where(eq(leads.id, leadId));
      return created;
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid quote" },
        { status: 400 },
      );
    return Response.json({ error: "Could not create quote" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const value = quote.parse(await request.json());
    if (!value.id)
      return Response.json({ error: "Missing quote" }, { status: 400 });
    const quoteId = value.id;
    const [current] = await db
      .select()
      .from(salesQuotes)
      .where(eq(salesQuotes.id, quoteId))
      .limit(1);
    if (!current || !scope(session, current.ownerId))
      return Response.json({ error: "Not found" }, { status: 404 });
    await db.transaction(async (tx) => {
      await tx
        .update(salesQuotes)
        .set({
          title: value.title,
          status: value.status,
          currency: value.currency.toUpperCase(),
          items: value.items,
          discovery: value.discovery,
          discountPercent: value.discountPercent,
          depositPercent: value.depositPercent,
          estimatedTimeline: value.estimatedTimeline,
          paymentTerms: value.paymentTerms,
          notes: value.notes,
          validUntil: value.validUntil,
          trainingMode: value.trainingMode,
          scenario: value.scenario,
        })
        .where(eq(salesQuotes.id, quoteId));
      if (current.leadId) {
        await tx
          .update(leads)
          .set({
            name: value.leadName,
            email: value.leadEmail.toLowerCase(),
            company: value.company,
            phone: value.phone,
            status:
              value.status === "accepted"
                ? "won"
                : value.status === "declined"
                  ? "lost"
                  : value.status === "draft"
                    ? "qualified"
                    : "proposal",
          })
          .where(eq(leads.id, current.leadId));
      }
    });
    return Response.json({ id: quoteId, shareToken: current.shareToken });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid quote" },
        { status: 400 },
      );
    return Response.json({ error: "Could not update quote" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing quote" }, { status: 400 });
  const [current] = await db
    .select()
    .from(salesQuotes)
    .where(eq(salesQuotes.id, id))
    .limit(1);
  if (!current || !scope(session, current.ownerId))
    return Response.json({ error: "Not found" }, { status: 404 });
  await db.delete(salesQuotes).where(eq(salesQuotes.id, id));
  return Response.json({ ok: true });
}
