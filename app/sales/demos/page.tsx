import { eq } from "drizzle-orm";
import { DemoBuilder } from "@/components/sales/demo-builder";
import { hasRole, requireAnyRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads, websiteDemos } from "@/lib/db/schema";
export const metadata = { title: "Website demo builder" };
export default async function DemosPage() {
  const session = await requireAnyRole(["admin", "sales"]);
  const base = db
    .select({ demo: websiteDemos, lead: leads })
    .from(websiteDemos)
    .leftJoin(leads, eq(websiteDemos.leadId, leads.id));
  const rows = hasRole(session.user.role, "admin")
    ? await base
    : await base.where(eq(websiteDemos.ownerId, session.user.id));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">HTML website demos</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Build, personalize, preview, share, duplicate, and export responsive
          prospect experiences.
        </p>
      </div>
      <DemoBuilder
        demos={rows.map(({ demo, lead }) => ({
          ...demo,
          status: demo.status as "draft" | "published",
          brand: demo.brand as never,
          blocks: demo.blocks as never,
          leadEmail: lead?.email ?? "",
          company: lead?.company ?? "",
        }))}
      />
    </div>
  );
}
