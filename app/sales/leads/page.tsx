import { eq } from "drizzle-orm";
import { LeadsManager } from "@/components/sales/leads-manager";
import { hasRole, requireAnyRole } from "@/lib/auth-session";
import { getSalesLeads } from "@/lib/data-access";
import { db } from "@/lib/db";
import { leads as leadsTable } from "@/lib/db/schema";
export const metadata = { title: "Sales leads" };
export default async function LeadsPage() {
  const session = await requireAnyRole(["admin", "sales"]);
  const leads = hasRole(session.user.role, "admin")
    ? await getSalesLeads()
    : await db
        .select()
        .from(leadsTable)
        .where(eq(leadsTable.ownerId, session.user.id));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Sales leads</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          A lightweight CRM view connecting prospects, proposals, and demos.
        </p>
      </div>
      <LeadsManager
        leads={leads.map((lead) => ({
          ...lead,
          updatedAt: lead.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
