import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

async function adminSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session && hasRole(session.user.role, "admin") ? session : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await adminSession(request)))
    return Response.json({ error: "Forbidden" }, { status: 403 });
  const parsed = z
    .object({
      name: z.string().trim().min(1).max(160),
      email: z
        .string()
        .trim()
        .email()
        .transform((value) => value.toLowerCase()),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  try {
    const { id } = await params;
    await db.update(user).set(parsed.data).where(eq(user.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "That email may already be in use." },
      { status: 409 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await adminSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (id === session.user.id)
    return Response.json(
      { error: "You cannot delete your own account." },
      { status: 400 },
    );
  await db.delete(user).where(eq(user.id, id));
  return Response.json({ ok: true });
}
