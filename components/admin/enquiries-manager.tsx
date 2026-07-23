"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteAdminResource,
  saveAdminResource,
} from "@/components/admin/admin-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: string;
  createdAt: string;
};

export function EnquiriesManager({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setPending(true);
    try {
      await saveAdminResource(
        "enquiries",
        "PUT",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      toast.success("Enquiry updated");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update enquiry",
      );
    } finally {
      setPending(false);
    }
  }
  async function remove(item: Enquiry) {
    if (!window.confirm(`Delete enquiry from ${item.name}?`)) return;
    setPending(true);
    try {
      await deleteAdminResource("enquiries", item.id);
      toast.success("Enquiry deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete enquiry",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <Card>
        <CardContent className="divide-y divide-border px-0">
          {enquiries.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge
                    variant={
                      item.status === "qualified" ? "success" : "outline"
                    }
                    className="capitalize"
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {item.email}
                  {item.company ? ` · ${item.company}` : ""} · {item.createdAt}
                </div>
                <p className="mt-2 line-clamp-2 text-sm">{item.message}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditing(item)}
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(item)}
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {!enquiries.length ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No enquiries yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit enquiry</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing.id} />
              {[
                ["Name", "name", editing.name],
                ["Email", "email", editing.email],
                ["Phone", "phone", editing.phone ?? ""],
                ["Company", "company", editing.company ?? ""],
                ["Service", "service", editing.service ?? ""],
                ["Budget", "budget", editing.budget ?? ""],
              ].map(([label, name, value]) => (
                <div key={name} className="flex flex-col gap-2">
                  <Label>{label}</Label>
                  <Input name={name} defaultValue={value} />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={editing.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["new", "contacted", "qualified", "closed"].map(
                      (status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          {status}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div />
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Message</Label>
                <Textarea
                  name="message"
                  defaultValue={editing.message}
                  rows={5}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Internal notes</Label>
                <Textarea name="notes" defaultValue={editing.notes} rows={4} />
              </div>
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
