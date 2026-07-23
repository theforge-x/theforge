"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  status: "new" | "qualified" | "proposal" | "won" | "lost";
  source: string;
  notes: string;
  updatedAt: string;
};
export function LeadsManager({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Lead | null>(null);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch("/api/sales/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const result = await response.json();
    if (response.ok) {
      toast.success("Lead updated");
      setEditing(null);
      router.refresh();
    } else toast.error(result.error ?? "Could not update lead");
  }
  async function remove(id: string) {
    if (
      !confirm(
        "Delete this lead? Associated quotes and demos will be retained.",
      )
    )
      return;
    const response = await fetch(`/api/sales/leads?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Lead deleted");
      router.refresh();
    }
  }
  return (
    <>
      <Card>
        <CardContent className="divide-y divide-border px-0">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lead.name}</span>
                  <Badge
                    variant={lead.status === "won" ? "success" : "outline"}
                    className="capitalize"
                  >
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {lead.company} · {lead.email} · {lead.source}
                </p>
              </div>
              <div className="flex">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditing(lead)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(lead.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {!leads.length ? (
            <p className="text-muted-foreground p-10 text-center text-sm">
              Leads captured through quotes and demos will appear here.
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
            <DialogTitle>Edit lead</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing.id} />
              {[
                ["Name", "name", editing.name],
                ["Email", "email", editing.email],
                ["Company", "company", editing.company],
                ["Phone", "phone", editing.phone ?? ""],
                ["Source", "source", editing.source],
              ].map(([label, name, value]) => (
                <div key={name} className="flex flex-col gap-2">
                  <Label>{label}</Label>
                  <Input
                    name={name}
                    defaultValue={value}
                    required={name !== "phone"}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={editing.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["new", "qualified", "proposal", "won", "lost"].map(
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
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea name="notes" defaultValue={editing.notes} />
              </div>
              <DialogFooter className="sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button variant="ember">Save lead</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
