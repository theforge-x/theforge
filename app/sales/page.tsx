import { eq, sql } from "drizzle-orm";
import { ArrowUpRight, Presentation, ScrollText, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasRole, requireAnyRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { leads, salesQuotes, websiteDemos } from "@/lib/db/schema";
export default async function SalesDashboard() {
  const session = await requireAnyRole(["admin", "sales"]);
  const isAdmin = hasRole(session.user.role, "admin");
  const [[leadCount], [quoteCount], [demoCount], recent] = await Promise.all([
    isAdmin
      ? db.select({ value: sql<number>`count(*)::int` }).from(leads)
      : db
          .select({ value: sql<number>`count(*)::int` })
          .from(leads)
          .where(eq(leads.ownerId, session.user.id)),
    isAdmin
      ? db.select({ value: sql<number>`count(*)::int` }).from(salesQuotes)
      : db
          .select({ value: sql<number>`count(*)::int` })
          .from(salesQuotes)
          .where(eq(salesQuotes.ownerId, session.user.id)),
    isAdmin
      ? db.select({ value: sql<number>`count(*)::int` }).from(websiteDemos)
      : db
          .select({ value: sql<number>`count(*)::int` })
          .from(websiteDemos)
          .where(eq(websiteDemos.ownerId, session.user.id)),
    isAdmin
      ? db
          .select({ quote: salesQuotes, lead: leads })
          .from(salesQuotes)
          .leftJoin(leads, eq(salesQuotes.leadId, leads.id))
          .limit(5)
      : db
          .select({ quote: salesQuotes, lead: leads })
          .from(salesQuotes)
          .leftJoin(leads, eq(salesQuotes.leadId, leads.id))
          .where(eq(salesQuotes.ownerId, session.user.id))
          .limit(5),
  ]);
  const cards = [
    {
      label: "Tracked leads",
      value: leadCount.value,
      href: "/sales/leads",
      icon: Users,
    },
    {
      label: "Sales quotes",
      value: quoteCount.value,
      href: "/sales/quotes",
      icon: ScrollText,
    },
    {
      label: "Website demos",
      value: demoCount.value,
      href: "/sales/demos",
      icon: Presentation,
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Sales enablement</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Move from discovery to a tailored proposal and interactive proof in
          one workflow.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link href={card.href} key={card.label}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="text-muted-foreground text-xs">
                    {card.label}
                  </div>
                  <div className="font-display mt-2 text-3xl">{card.value}</div>
                </div>
                <card.icon className="text-accent size-6" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent proposals</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border px-0">
          {recent.map(({ quote, lead }) => (
            <Link
              href="/sales/quotes"
              key={quote.id}
              className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-secondary/40"
            >
              <div>
                <div className="text-sm font-medium">{quote.title}</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {lead?.company ?? "Unassigned"} · {quote.quoteNumber}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={quote.status === "accepted" ? "success" : "outline"}
                  className="capitalize"
                >
                  {quote.status}
                </Badge>
                <ArrowUpRight className="size-4" />
              </div>
            </Link>
          ))}
          {!recent.length ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No proposals yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
