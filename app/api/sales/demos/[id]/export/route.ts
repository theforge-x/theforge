import { eq } from "drizzle-orm";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { websiteDemos } from "@/lib/db/schema";
import { type DemoBlock, type DemoBrand, demoHtml } from "@/lib/demo-render";
import { getSalesApiSession } from "@/lib/sales-auth";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSalesApiSession(request);
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const [demo] = await db
    .select()
    .from(websiteDemos)
    .where(eq(websiteDemos.id, id))
    .limit(1);
  if (!demo) return Response.json({ error: "Not found" }, { status: 404 });
  if (!hasRole(session.user.role, "admin") && demo.ownerId !== session.user.id)
    return Response.json({ error: "Not found" }, { status: 404 });
  const html = demoHtml(
    demo.title,
    demo.brand as DemoBrand,
    demo.blocks as DemoBlock[],
  );
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${demo.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html"`,
    },
  });
}
