import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientMembers, user } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  title: z.string().trim().min(1).max(120),
  notifyReports: z.boolean(),
  notifyInvoices: z.boolean(),
  notifyProjects: z.boolean(),
  notifyMonthly: z.boolean(),
});
export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const value = schema.parse(await request.json());
    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          name: value.name,
          email: value.email.toLowerCase(),
          notifyReports: value.notifyReports,
          notifyInvoices: value.notifyInvoices,
          notifyProjects: value.notifyProjects,
          notifyMonthly: value.notifyMonthly,
        })
        .where(eq(user.id, session.user.id));
      await tx
        .update(clientMembers)
        .set({ title: value.title })
        .where(eq(clientMembers.userId, session.user.id));
    });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid settings" },
        { status: 400 },
      );
    const message = error instanceof Error ? error.message : "";
    return Response.json(
      {
        error: /duplicate key/i.test(message)
          ? "That email address is already in use."
          : "Could not save settings.",
      },
      { status: /duplicate key/i.test(message) ? 409 : 500 },
    );
  }
}
