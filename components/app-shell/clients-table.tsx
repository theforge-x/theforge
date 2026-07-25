"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  deleteAdminResource,
  saveAdminResource,
} from "@/components/admin/admin-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientStatus } from "@/lib/data";
import type { ClientView } from "@/lib/data-access";

const statusVariant: Record<
  ClientStatus,
  "success" | "outline" | "secondary" | "destructive"
> = {
  active: "success",
  onboarding: "outline",
  paused: "secondary",
  churned: "destructive",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function ClientsTable({ clients }: { clients: ClientView[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<ClientStatus | "all">("all");
  const [editing, setEditing] = useState<ClientView | "new" | null>(null);
  const [pending, setPending] = useState(false);
  const items =
    status === "all" ? clients : clients.filter((c) => c.status === status);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const value = Object.fromEntries(form.entries());
    try {
      await saveAdminResource(
        "clients",
        editing === "new" ? "POST" : "PUT",
        value,
      );
      toast.success(editing === "new" ? "Client created" : "Client updated");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save client",
      );
    } finally {
      setPending(false);
    }
  }

  async function remove(client: ClientView) {
    if (
      !window.confirm(
        `Delete ${client.name} and its related records? This cannot be undone.`,
      )
    )
      return;
    setPending(true);
    try {
      await deleteAdminResource("clients", client.id);
      toast.success("Client deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete client",
      );
    } finally {
      setPending(false);
    }
  }

  const current = editing === "new" ? null : editing;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">{items.length} clients</p>
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ClientStatus | "all")}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ember" onClick={() => setEditing("new")}>
            <Plus /> Add client
          </Button>
        </div>
      </div>

      <div className="border-border/50 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="w-24">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="hover:text-accent"
                  >
                    {c.name}
                  </Link>
                  <div className="text-muted-foreground text-xs font-normal">
                    {c.industry}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.plan}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[c.status]}
                    className="capitalize"
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {c.mrr ? `${c.currency} ${c.mrr.toLocaleString()}` : "—"}
                </TableCell>
                <TableCell>{c.health}%</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.startDate}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => setEditing(c)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${c.name}`}
                      disabled={pending}
                      onClick={() => remove(c)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{current ? "Edit client" : "Add client"}</DialogTitle>
            <DialogDescription>
              Changes update dashboards, projects, reports, and billing views
              immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {current ? (
              <input type="hidden" name="id" value={current.id} />
            ) : null}
            <Field label="Business name">
              <Input name="name" defaultValue={current?.name} required />
            </Field>
            <Field label="Primary contact">
              <Input name="contact" defaultValue={current?.contact} required />
            </Field>
            <Field label="Industry">
              <Input
                name="industry"
                defaultValue={current?.industry}
                required
              />
            </Field>
            <Field label="Plan">
              <Input
                name="plan"
                defaultValue={current?.plan ?? "Forge Build"}
                required
              />
            </Field>
            <Field label="Status">
              <Select
                name="status"
                defaultValue={current?.status ?? "onboarding"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monthly recurring revenue">
              <Input
                name="mrr"
                type="number"
                min="0"
                step="0.01"
                defaultValue={current?.mrr ?? 0}
                required
              />
            </Field>
            <Field label="Currency">
              <Input
                name="currency"
                minLength={3}
                maxLength={3}
                defaultValue={current?.currency ?? "USD"}
                required
              />
            </Field>
            <Field label="Start date">
              <Input
                name="startDate"
                type="date"
                defaultValue={
                  current?.startDate ?? new Date().toISOString().slice(0, 10)
                }
                required
              />
            </Field>
            <Field label="Health score">
              <Input
                name="health"
                type="number"
                min="0"
                max="100"
                defaultValue={current?.health ?? 50}
                required
              />
            </Field>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button variant="ember" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : null} Save
                client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
