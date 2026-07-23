"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AppointmentForm({ duration }: { duration: number }) {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [slots, setSlots] = useState<{ startsAt: string; timezone: string }[]>(
    [],
  );
  const [loadingSlots, setLoadingSlots] = useState(true);
  useEffect(() => {
    fetch("/api/availability")
      .then((response) => response.json())
      .then((value) => setSlots(value.slots ?? []))
      .catch(() => toast.error("Could not load available times"))
      .finally(() => setLoadingSlots(false));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      values.startsAt = new Date(String(values.startsAt)).toISOString();
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Could not request appointment");
      setComplete(true);
      toast.success("Appointment request received");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not request appointment",
      );
    } finally {
      setPending(false);
    }
  }

  if (complete)
    return (
      <div className="border-border bg-card rounded-lg border p-10 text-center">
        <CalendarCheck className="text-primary mx-auto size-8" />
        <h3 className="font-display mt-4 text-2xl">Request received.</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          We’ll confirm the slot and send your Zoom link after approval.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="border-border bg-card grid gap-5 rounded-lg border p-8 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="booking-name">Name</Label>
        <Input id="booking-name" name="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="booking-email">Email</Label>
        <Input id="booking-email" name="email" type="email" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="booking-company">Company</Label>
        <Input id="booking-company" name="company" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="booking-time">Available time</Label>
        <select
          id="booking-time"
          name="startsAt"
          required
          disabled={loadingSlots || !slots.length}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
        >
          <option value="">
            {loadingSlots
              ? "Loading availability…"
              : slots.length
                ? "Choose a time"
                : "No times currently available"}
          </option>
          {slots.map((slot) => (
            <option key={slot.startsAt} value={slot.startsAt}>
              {new Date(slot.startsAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              ({slot.timezone})
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="booking-notes">What would you like to discuss?</Label>
        <Textarea id="booking-notes" name="notes" rows={4} />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button variant="ember" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <CalendarCheck />}{" "}
          Request {duration}-minute call
        </Button>
        <span className="text-muted-foreground text-xs">
          Times are displayed in your local timezone.
        </span>
      </div>
    </form>
  );
}
