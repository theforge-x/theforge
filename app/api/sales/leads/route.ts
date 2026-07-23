import { eq } from "drizzle-orm";
import { z } from "zod";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSalesApiSession } from "@/lib/sales-auth";

const schema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email(),
  company: z.string().trim().min(1).max(160),
  phone: z.string().max(60).nullable().optional(),
  status: z.enum(["new", "qualified", "proposal", "won", "lost"]),
  source: z.string().max(100),
  notes: z.string().max(3000),
});
export async function PUT(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const value = schema.parse(await request.json());
    const [current] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, value.id))
      .limit(1);
    if (
      !current ||
      (!hasRole(session.user.role, "admin") &&
        current.ownerId !== session.user.id)
    )
      return Response.json({ error: "Not found" }, { status: 404 });
    await db
      .update(leads)
      .set({ ...value, email: value.email.toLowerCase() })
      .where(eq(leads.id, value.id));
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid lead" },
        { status: 400 },
      );
    return Response.json({ error: "Could not update lead" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing lead" }, { status: 400 });
  const [current] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id))
    .limit(1);
  if (
    !current ||
    (!hasRole(session.user.role, "admin") &&
      current.ownerId !== session.user.id)
  )
    return Response.json({ error: "Not found" }, { status: 404 });
  await db.delete(leads).where(eq(leads.id, id));
  return Response.json({ ok: true });
}
