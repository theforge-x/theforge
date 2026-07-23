import { Activity, FileText, FolderKanban, Receipt } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GrowthChart } from "@/components/app-shell/growth-chart";
import { KpiCard } from "@/components/app-shell/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser, getClientWorkspace } from "@/lib/data-access";

export default async function PortalDashboard() {
  const session = await requireRole("client");
  const account = await getClientAccountForUser(session.user.id);
  if (!account) redirect("/login?error=client-account-required");
  const {
    projects: myProjects,
    invoices: myInvoices,
    reports: myReports,
    growth,
  } = await getClientWorkspace(account.client.id);
  const openInvoice = myInvoices.find((i) => i.status !== "paid");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">
          Welcome back, {session.user.name.split(" ")[0]}.
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's where your growth system stands this week.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active projects"
          value={String(myProjects.length)}
          icon={FolderKanban}
        />
        <KpiCard
          label="Avg. project progress"
          value={`${Math.round(myProjects.reduce((a, p) => a + p.progress, 0) / (myProjects.length || 1))}%`}
          delta="+12% this month"
          icon={Activity}
        />
        <KpiCard
          label="Open balance"
          value={openInvoice ? `$${openInvoice.amount.toLocaleString()}` : "$0"}
          deltaPositive={!openInvoice}
          delta={openInvoice ? "Due soon" : "All settled"}
          icon={Receipt}
        />
        <KpiCard
          label="Reports delivered"
          value={String(myReports.length)}
          icon={FileText}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <GrowthChart data={growth} />

        <Card>
          <CardHeader>
            <CardTitle>Active projects</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {myProjects.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Badge variant="outline">{p.phase}</Badge>
                </div>
                <Progress value={p.progress} />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>{p.owner}</span>
                  <span>{p.progress}%</span>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link href="/portal/projects">View all projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {myReports.map((r) => (
            <Link
              key={r.id}
              href="/portal/reports"
              className="hover:bg-secondary/50 -mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-2.5 text-sm transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="text-accent size-4" />
                {r.title}
              </span>
              <span className="text-muted-foreground text-xs">{r.date}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
