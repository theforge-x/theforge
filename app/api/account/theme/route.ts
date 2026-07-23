import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { theme } = z
    .object({ theme: z.enum(["light", "dark"]) })
    .parse(await request.json());
  await db.update(user).set({ theme }).where(eq(user.id, session.user.id));
  return Response.json({ ok: true });
}
