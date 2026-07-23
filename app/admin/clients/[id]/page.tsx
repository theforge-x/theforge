import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientRecordsManager } from "@/components/admin/client-records-manager";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getClientDetails } from "@/lib/data-access";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetails(id);
  return { title: detail?.client.name ?? "Client" };
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetails(id);
  if (!detail) notFound();
  const {
    client,
    projects: clientProjects,
    invoices: clientInvoices,
    reports: clientReports,
  } = detail;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/clients"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-3.5" /> All clients
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">{client.name}</h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              {client.industry} · {client.contact}
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" />
              </span>
            </p>
          </div>
          <Badge
            className="capitalize"
            variant={client.status === "active" ? "success" : "outline"}
          >
            {client.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="px-5">
            <div className="text-muted-foreground text-xs">Plan</div>
            <div className="font-display mt-1 text-2xl">{client.plan}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-5">
            <div className="text-muted-foreground text-xs">MRR</div>
            <div className="font-display mt-1 text-2xl">
              {client.mrr ? `$${client.mrr.toLocaleString()}` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-5">
            <div className="text-muted-foreground text-xs">Health score</div>
            <div className="font-display mt-1 text-2xl">{client.health}%</div>
            <Progress value={client.health} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {clientProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet.</p>
          ) : (
            clientProjects.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Badge variant="outline">{p.phase}</Badge>
                </div>
                <Progress value={p.progress} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ClientRecordsManager
        clientId={client.id}
        invoices={clientInvoices}
        reports={clientReports}
      />
    </div>
  );
}
