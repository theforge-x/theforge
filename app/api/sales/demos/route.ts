import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads, websiteDemos } from "@/lib/db/schema";
import { getSalesApiSession } from "@/lib/sales-auth";

const block = z.object({
  id: z.string(),
  type: z.enum(["hero", "features", "proof", "cta", "footer"]),
  title: z.string().max(300),
  body: z.string().max(2000),
  button: z.string().max(100).optional(),
});
const brand = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z
    .string()
    .max(80)
    .regex(/^[a-zA-Z0-9 ,'-]+$/),
  logo: z.string().max(500000).optional(),
});
const schema = z.object({
  id: z.string().optional(),
  leadId: z.string().nullable().optional(),
  prospectName: z.string().min(1).max(160),
  leadEmail: z.string().email(),
  company: z.string().min(1).max(160),
  title: z.string().min(1).max(200),
  template: z.string().max(80),
  status: z.enum(["draft", "published"]),
  brand,
  blocks: z.array(block).min(1).max(30),
  reusable: z.boolean(),
});
function accessible(
  session: { user: { id: string; role?: string | null } },
  ownerId: string | null,
) {
  return hasRole(session.user.role, "admin") || ownerId === session.user.id;
}
export async function POST(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const value = schema.parse(await request.json());
    const created = await db.transaction(async (tx) => {
      let leadId = value.leadId;
      if (!leadId) {
        const [lead] = await tx
          .insert(leads)
          .values({
            ownerId: session.user.id,
            name: value.prospectName,
            email: value.leadEmail.toLowerCase(),
            company: value.company,
            source: "demo-builder",
            status: "qualified",
          })
          .returning({ id: leads.id });
        leadId = lead.id;
      }
      const [demo] = await tx
        .insert(websiteDemos)
        .values({
          leadId,
          ownerId: session.user.id,
          title: value.title,
          prospectName: value.prospectName,
          template: value.template,
          status: value.status,
          shareToken: randomUUID(),
          brand: value.brand,
          blocks: value.blocks,
          reusable: value.reusable,
        })
        .returning({
          id: websiteDemos.id,
          shareToken: websiteDemos.shareToken,
        });
      return demo;
    });
    return Response.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid demo" },
        { status: 400 },
      );
    return Response.json({ error: "Could not create demo" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const value = schema.parse(await request.json());
    if (!value.id)
      return Response.json({ error: "Missing demo" }, { status: 400 });
    const demoId = value.id;
    const [current] = await db
      .select()
      .from(websiteDemos)
      .where(eq(websiteDemos.id, demoId))
      .limit(1);
    if (!current || !accessible(session, current.ownerId))
      return Response.json({ error: "Not found" }, { status: 404 });
    await db.transaction(async (tx) => {
      await tx
        .update(websiteDemos)
        .set({
          title: value.title,
          prospectName: value.prospectName,
          template: value.template,
          status: value.status,
          brand: value.brand,
          blocks: value.blocks,
          reusable: value.reusable,
        })
        .where(eq(websiteDemos.id, demoId));
      if (current.leadId)
        await tx
          .update(leads)
          .set({
            name: value.prospectName,
            email: value.leadEmail.toLowerCase(),
            company: value.company,
          })
          .where(eq(leads.id, current.leadId));
    });
    return Response.json({ id: demoId, shareToken: current.shareToken });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid demo" },
        { status: 400 },
      );
    return Response.json({ error: "Could not update demo" }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { id } = z.object({ id: z.string() }).parse(await request.json());
  const [current] = await db
    .select()
    .from(websiteDemos)
    .where(eq(websiteDemos.id, id))
    .limit(1);
  if (!current || !accessible(session, current.ownerId))
    return Response.json({ error: "Not found" }, { status: 404 });
  const [copy] = await db
    .insert(websiteDemos)
    .values({
      leadId: current.leadId,
      ownerId: session.user.id,
      title: `${current.title} (copy)`,
      prospectName: current.prospectName,
      template: current.template,
      status: "draft",
      shareToken: randomUUID(),
      brand: current.brand,
      blocks: current.blocks,
      reusable: current.reusable,
    })
    .returning({ id: websiteDemos.id });
  return Response.json(copy, { status: 201 });
}
export async function DELETE(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing demo" }, { status: 400 });
  const [current] = await db
    .select()
    .from(websiteDemos)
    .where(eq(websiteDemos.id, id))
    .limit(1);
  if (!current || !accessible(session, current.ownerId))
    return Response.json({ error: "Not found" }, { status: 404 });
  await db.delete(websiteDemos).where(eq(websiteDemos.id, id));
  return Response.json({ ok: true });
}
