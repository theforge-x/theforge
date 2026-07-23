import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

import { KpiCard } from "@/components/app-shell/kpi-card";
import { RevenueChart } from "@/components/app-shell/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudioMetrics } from "@/lib/data-access";

export default async function AdminDashboard() {
  const { clients, monthlyRevenue } = await getStudioMetrics();
  const activeClients = clients.filter((c) => c.status === "active");
  const totalMrr = clients.reduce((sum, c) => sum + c.mrr, 0);
  const atRisk = clients.filter((c) => c.health < 60);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Studio overview</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Everything running across the client roster right now.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Monthly recurring revenue"
          value={`$${totalMrr.toLocaleString()}`}
          delta="+8.4% vs last month"
          icon={DollarSign}
        />
        <KpiCard
          label="Active clients"
          value={String(activeClients.length)}
          icon={Users}
        />
        <KpiCard
          label="Revenue added (YTD)"
          value="$421K"
          delta="+22% vs last year"
          icon={TrendingUp}
        />
        <KpiCard
          label="Accounts at risk"
          value={String(atRisk.length)}
          deltaPositive={atRisk.length === 0}
          delta={atRisk.length ? "Needs attention" : "All healthy"}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueChart data={monthlyRevenue} />

        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {atRisk.map((c) => (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="hover:bg-secondary/50 -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-muted-foreground text-xs capitalize">
                    {c.status}
                  </div>
                </div>
                <Badge variant="destructive">{c.health}% health</Badge>
              </Link>
            ))}
            {atRisk.length === 0 ? (
              <p className="text-muted-foreground py-2 text-sm">
                No accounts currently flagged.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
