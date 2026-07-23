import { Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser, getClientWorkspace } from "@/lib/data-access";

export const metadata: Metadata = { title: "Projects" };

const phaseVariant = {
  Diagnose: "outline",
  Forge: "default",
  Temper: "ember",
} as const;

export default async function PortalProjectsPage() {
  const session = await requireRole("client");
  const account = await getClientAccountForUser(session.user.id);
  if (!account) redirect("/login?error=client-account-required");
  const { projects: myProjects } = await getClientWorkspace(account.client.id);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Projects</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Every system currently being diagnosed, forged, or tempered for your
          business.
        </p>
      </div>

      <div className="grid gap-4">
        {myProjects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant={phaseVariant[p.phase]}>{p.phase}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={p.progress} />
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" /> {p.owner}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Due {p.dueDate}
                </span>
                <span>{p.progress}% complete</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
