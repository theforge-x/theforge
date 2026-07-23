import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser, getClientWorkspace } from "@/lib/data-access";

export const metadata: Metadata = { title: "Reports" };

export default async function PortalReportsPage() {
  const session = await requireRole("client");
  const account = await getClientAccountForUser(session.user.id);
  if (!account) redirect("/login?error=client-account-required");
  const { reports: myReports } = await getClientWorkspace(account.client.id);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Reports</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Audits, performance reviews, and results — everything we've delivered.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col divide-y divide-border px-0">
          {myReports.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-md">
                  <FileText className="text-accent size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{r.type}</Badge>
                    {r.date}
                  </div>
                </div>
              </div>
              {r.fileUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={r.fileUrl} target="_blank" rel="noreferrer">
                    <Download className="size-3.5" /> Download
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <Download className="size-3.5" /> Unavailable
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
