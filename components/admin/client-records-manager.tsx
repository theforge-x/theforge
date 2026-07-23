"use client";

import { FileText, Loader2, Pencil, Plus, Receipt, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  deleteAdminResource,
  saveAdminResource,
} from "@/components/admin/admin-resource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { InvoiceView, ReportView } from "@/lib/data-access";

type Editing =
  | { type: "invoice"; value: InvoiceView | null }
  | { type: "report"; value: ReportView | null }
  | null;

export function ClientRecordsManager({
  clientId,
  invoices,
  reports,
}: {
  clientId: string;
  invoices: InvoiceView[];
  reports: ReportView[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const resource = editing.type === "invoice" ? "invoices" : "reports";
    try {
      await saveAdminResource(resource, editing.value ? "PUT" : "POST", values);
      toast.success(
        `${editing.type === "invoice" ? "Invoice" : "Report"} saved`,
      );
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save record",
      );
    } finally {
      setPending(false);
    }
  }

  async function remove(type: "invoices" | "reports", id: string) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    setPending(true);
    try {
      await deleteAdminResource(type, id);
      toast.success("Record deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete record",
      );
    } finally {
      setPending(false);
    }
  }

  const invoice = editing?.type === "invoice" ? editing.value : null;
  const report = editing?.type === "report" ? editing.value : null;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing({ type: "invoice", value: null })}
            >
              <Plus /> Add
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {item.currency} {item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize">{item.status}</TableCell>
                    <TableCell>
                      <div className="flex">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${item.id}`}
                          onClick={() =>
                            setEditing({ type: "invoice", value: item })
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${item.id}`}
                          onClick={() => remove("invoices", item.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!invoices.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No invoices yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Reports</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing({ type: "report", value: null })}
            >
              <Plus /> Add
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {reports.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{item.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.type} · {item.date}
                  </div>
                </div>
                <div className="flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => setEditing({ type: "report", value: item })}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => remove("reports", item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            {!reports.length ? (
              <p className="text-muted-foreground text-sm">No reports yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editing?.type === "invoice" ? <Receipt /> : <FileText />}{" "}
              {editing?.value ? "Edit" : "Add"} {editing?.type}
            </DialogTitle>
            <DialogDescription>
              This information is immediately reflected in the client portal.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="clientId" value={clientId} />
              {editing.type === "invoice" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Invoice ID</Label>
                    <Input
                      name="id"
                      defaultValue={
                        invoice?.id ?? `INV-${Date.now().toString().slice(-6)}`
                      }
                      readOnly={Boolean(invoice)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Amount</Label>
                    <Input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={invoice?.amount}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Currency</Label>
                    <Input
                      name="currency"
                      defaultValue={invoice?.currency ?? "USD"}
                      minLength={3}
                      maxLength={3}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Select
                      name="status"
                      defaultValue={invoice?.status ?? "due"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due">Due</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Issued</Label>
                    <Input
                      name="issued"
                      type="date"
                      defaultValue={
                        invoice?.issued ?? new Date().toISOString().slice(0, 10)
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Due</Label>
                    <Input
                      name="due"
                      type="date"
                      defaultValue={
                        invoice?.due ?? new Date().toISOString().slice(0, 10)
                      }
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {report ? (
                    <input type="hidden" name="id" value={report.id} />
                  ) : null}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>Title</Label>
                    <Input name="title" defaultValue={report?.title} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Type</Label>
                    <Input
                      name="type"
                      defaultValue={report?.type ?? "Monthly report"}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Report date</Label>
                    <Input
                      name="date"
                      type="date"
                      defaultValue={
                        report?.date ?? new Date().toISOString().slice(0, 10)
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>File URL</Label>
                    <Input
                      name="fileUrl"
                      type="url"
                      placeholder="https://…"
                      defaultValue={report?.fileUrl ?? ""}
                    />
                  </div>
                </>
              )}
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
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
