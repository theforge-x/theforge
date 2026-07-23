import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { clientMembers } from "@/lib/db/schema";

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !hasRole(session.user.role, "admin")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    clientId?: string | null;
  } | null;
  if (!body?.userId)
    return Response.json({ error: "Missing user" }, { status: 400 });
  const userId = body.userId;

  await db.transaction(async (tx) => {
    await tx.delete(clientMembers).where(eq(clientMembers.userId, userId));
    if (body.clientId) {
      await tx.insert(clientMembers).values({
        userId,
        clientId: body.clientId,
        title: "Client member",
      });
    }
  });

  return Response.json({ ok: true });
}
