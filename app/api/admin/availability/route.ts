import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { availabilityRules, blockedDates } from "@/lib/db/schema";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const timezone = z
  .string()
  .min(1)
  .max(80)
  .refine((value) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
      return true;
    } catch {
      return false;
    }
  }, "Enter a valid timezone, for example Africa/Lagos");
const rule = z
  .object({
    id: z.string().optional(),
    kind: z.literal("rule"),
    weekday: z.coerce.number().int().min(0).max(6),
    startTime: time,
    endTime: time,
    timezone,
    slotInterval: z.coerce.number().int().min(15).max(240),
    active: z.boolean(),
  })
  .refine((v) => v.endTime > v.startTime, {
    message: "End time must be after start time",
  });
const block = z
  .object({
    id: z.string().optional(),
    kind: z.literal("block"),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    reason: z.string().max(300),
  })
  .refine((v) => v.endsAt > v.startsAt, {
    message: "Block end must be after its start",
  });
async function allowed(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return Boolean(session && hasRole(session.user.role, "admin"));
}
export async function POST(request: Request) {
  if (!(await allowed(request)))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const json = await request.json();
    if (json.kind === "rule") {
      const value = rule.parse(json);
      await db.insert(availabilityRules).values(value);
    } else {
      const value = block.parse(json);
      await db.insert(blockedDates).values({
        ...value,
        startsAt: new Date(value.startsAt),
        endsAt: new Date(value.endsAt),
      });
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid availability" },
        { status: 400 },
      );
    return Response.json(
      { error: "Could not save availability" },
      { status: 500 },
    );
  }
}
export async function PUT(request: Request) {
  if (!(await allowed(request)))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const json = await request.json();
    if (json.kind === "rule") {
      const value = rule.parse(json);
      if (!value.id) throw new Error("Missing id");
      await db
        .update(availabilityRules)
        .set(value)
        .where(eq(availabilityRules.id, value.id));
    } else {
      const value = block.parse(json);
      if (!value.id) throw new Error("Missing id");
      await db
        .update(blockedDates)
        .set({
          startsAt: new Date(value.startsAt),
          endsAt: new Date(value.endsAt),
          reason: value.reason,
        })
        .where(eq(blockedDates.id, value.id));
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid availability" },
        { status: 400 },
      );
    return Response.json(
      { error: "Could not save availability" },
      { status: 500 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!(await allowed(request)))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const kind = url.searchParams.get("kind");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db
    .delete(kind === "block" ? blockedDates : availabilityRules)
    .where(eq(kind === "block" ? blockedDates.id : availabilityRules.id, id));
  return Response.json({ ok: true });
}
