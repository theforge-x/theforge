"use client";

import { CalendarClock, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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

type Appointment = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  notes: string;
  startsAt: string;
  durationMinutes: number;
  status: "pending" | "approved" | "cancelled";
  meetingUrl: string | null;
};
const localDateTime = (value: string) => {
  const d = new Date(value);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
};
export function AppointmentsManager({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Appointment | "new" | null>(null);
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setPending(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      data.startsAt = new Date(String(data.startsAt)).toISOString();
      await saveAdminResource(
        "appointments",
        editing === "new" ? "POST" : "PUT",
        data,
      );
      toast.success("Appointment updated");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update appointment",
      );
    } finally {
      setPending(false);
    }
  }
  async function remove(item: Appointment) {
    if (!window.confirm(`Delete appointment with ${item.name}?`)) return;
    setPending(true);
    try {
      await deleteAdminResource("appointments", item.id);
      toast.success("Appointment deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete appointment",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="ember" onClick={() => setEditing("new")}>
          <Plus />
          Create appointment
        </Button>
      </div>
      <Card>
        <CardContent className="divide-y divide-border px-0">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-md">
                  <CalendarClock className="text-accent size-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge
                      variant={
                        item.status === "approved" ? "success" : "outline"
                      }
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {new Date(item.startsAt).toLocaleString()} ·{" "}
                    {item.durationMinutes} min · {item.email}
                  </p>
                  {item.meetingUrl ? (
                    <a
                      className="text-primary mt-1 block text-xs underline"
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Zoom meeting
                    </a>
                  ) : null}
                </div>
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
          {!appointments.length ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No appointment requests yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage appointment</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              {editing !== "new" ? (
                <input type="hidden" name="id" value={editing.id} />
              ) : null}
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={editing === "new" ? "" : editing.name}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editing === "new" ? "" : editing.email}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Company</Label>
                <Input
                  name="company"
                  defaultValue={
                    editing === "new" ? "" : (editing.company ?? "")
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Date & time</Label>
                <Input
                  name="startsAt"
                  type="datetime-local"
                  defaultValue={
                    editing === "new" ? "" : localDateTime(editing.startsAt)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Duration (minutes)</Label>
                <Input
                  name="durationMinutes"
                  type="number"
                  min={15}
                  max={240}
                  defaultValue={
                    editing === "new" ? 30 : editing.durationMinutes
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select
                  name="status"
                  defaultValue={editing === "new" ? "pending" : editing.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  defaultValue={editing === "new" ? "" : editing.notes}
                />
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
                  appointment
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
