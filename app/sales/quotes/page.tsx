import { eq } from "drizzle-orm";
import { QuoteBuilder } from "@/components/sales/quote-builder";
import { hasRole, requireAnyRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads, salesQuotes } from "@/lib/db/schema";
export const metadata = { title: "Quote builder" };
export default async function QuotesPage() {
  const session = await requireAnyRole(["admin", "sales"]);
  const base = db
    .select({ quote: salesQuotes, lead: leads })
    .from(salesQuotes)
    .leftJoin(leads, eq(salesQuotes.leadId, leads.id));
  const rows = hasRole(session.user.role, "admin")
    ? await base
    : await base.where(eq(salesQuotes.ownerId, session.user.id));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Quote builder</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Create branded proposals, practice sales scenarios, and track each
          opportunity through conversion.
        </p>
      </div>
      <QuoteBuilder
        quotes={rows.map(({ quote, lead }) => ({
          ...quote,
          items: quote.items as never,
          discovery: quote.discovery as never,
          createdAt: undefined,
          updatedAt: undefined,
          leadName: lead?.name ?? "",
          leadEmail: lead?.email ?? "",
          company: lead?.company ?? "",
          phone: lead?.phone ?? "",
        }))}
      />
    </div>
  );
}
