"use client";
import {
  Ban,
  CalendarPlus,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
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

type Rule = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  timezone: string;
  slotInterval: number;
  active: boolean;
};
type Block = { id: string; startsAt: string; endsAt: string; reason: string };
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const local = (value: string) => {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export function AvailabilityManager({
  rules,
  blocks,
}: {
  rules: Rule[];
  blocks: Block[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<
    Rule | Block | "rule" | "block" | null
  >(null);
  const [pending, setPending] = useState(false);
  const isRule =
    editing === "rule" ||
    (editing !== null && editing !== "block" && "weekday" in editing);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const data: Record<string, unknown> = Object.fromEntries(
        new FormData(event.currentTarget),
      );
      data.kind = isRule ? "rule" : "block";
      if (isRule) data.active = data.active === "true";
      else {
        data.startsAt = new Date(String(data.startsAt)).toISOString();
        data.endsAt = new Date(String(data.endsAt)).toISOString();
      }
      const response = await fetch("/api/admin/availability", {
        method: typeof editing === "object" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not save availability");
      toast.success("Availability saved");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save availability",
      );
    } finally {
      setPending(false);
    }
  }
  async function remove(kind: "rule" | "block", id: string) {
    if (!confirm("Delete this availability entry?")) return;
    const response = await fetch(
      `/api/admin/availability?kind=${kind}&id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (response.ok) {
      toast.success("Entry deleted");
      router.refresh();
    } else toast.error("Could not delete entry");
  }
  const current = typeof editing === "object" ? editing : null;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Weekly schedule</h3>
            <p className="text-muted-foreground text-xs">
              Recurring availability shown to visitors.
            </p>
          </div>
          <Button size="sm" variant="ember" onClick={() => setEditing("rule")}>
            <Plus />
            Add hours
          </Button>
        </div>
        <Card>
          <CardContent className="divide-y divide-border px-0">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex gap-3">
                  <Clock3 className="text-accent size-4" />
                  <div>
                    <div className="text-sm font-medium">
                      {days[rule.weekday]} · {rule.startTime}–{rule.endTime}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Every {rule.slotInterval} min · {rule.timezone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant={rule.active ? "success" : "outline"}>
                    {rule.active ? "Active" : "Paused"}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditing(rule)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove("rule", rule.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            {!rules.length ? (
              <p className="text-muted-foreground p-8 text-center text-sm">
                No recurring hours configured.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Blocked dates</h3>
            <p className="text-muted-foreground text-xs">
              Holidays, leave, and unavailable periods.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing("block")}
          >
            <Ban />
            Block time
          </Button>
        </div>
        <Card>
          <CardContent className="divide-y divide-border px-0">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <div className="text-sm font-medium">
                    {new Date(block.startsAt).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    to {new Date(block.endsAt).toLocaleString()} ·{" "}
                    {block.reason || "Unavailable"}
                  </div>
                </div>
                <div className="flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditing(block)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove("block", block.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            {!blocks.length ? (
              <p className="text-muted-foreground p-8 text-center text-sm">
                No blocked dates.
              </p>
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
            <DialogTitle>
              {isRule ? "Recurring availability" : "Block a date or time"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {current ? (
              <input type="hidden" name="id" value={current.id} />
            ) : null}
            {isRule ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Day</Label>
                  <Select
                    name="weekday"
                    defaultValue={
                      current && "weekday" in current
                        ? String(current.weekday)
                        : "1"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day, index) => (
                        <SelectItem value={String(index)} key={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    name="active"
                    defaultValue={
                      current && "active" in current
                        ? String(current.active)
                        : "true"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Starts</Label>
                  <Input
                    type="time"
                    name="startTime"
                    defaultValue={
                      current && "startTime" in current
                        ? current.startTime
                        : "09:00"
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Ends</Label>
                  <Input
                    type="time"
                    name="endTime"
                    defaultValue={
                      current && "endTime" in current
                        ? current.endTime
                        : "17:00"
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Timezone</Label>
                  <Input
                    name="timezone"
                    defaultValue={
                      current && "timezone" in current
                        ? current.timezone
                        : Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Slot interval</Label>
                  <Input
                    type="number"
                    name="slotInterval"
                    min={15}
                    max={240}
                    defaultValue={
                      current && "slotInterval" in current
                        ? current.slotInterval
                        : 30
                    }
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Starts</Label>
                  <Input
                    type="datetime-local"
                    name="startsAt"
                    defaultValue={
                      current && "startsAt" in current
                        ? local(current.startsAt)
                        : ""
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Ends</Label>
                  <Input
                    type="datetime-local"
                    name="endsAt"
                    defaultValue={
                      current && "endsAt" in current
                        ? local(current.endsAt)
                        : ""
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Reason</Label>
                  <Input
                    name="reason"
                    defaultValue={
                      current && "reason" in current ? current.reason : ""
                    }
                    placeholder="Holiday, event, focus time…"
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
                {pending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CalendarPlus />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
