"use client";

import {
  ArrowLeft,
  CalendarCheck,
  Check,
  Clock,
  Globe2,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AvailabilitySlot = { startsAt: string; timezone: string };
type BookingStep = "slot" | "details";

function dateKey(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
}

function dateFromKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function AppointmentForm({ duration }: { duration: number }) {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [step, setStep] = useState<BookingStep>("slot");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string>();
  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [calendarMonth, setCalendarMonth] = useState<Date>();
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [visitorTimezone, setVisitorTimezone] = useState("Local timezone");

  useEffect(() => {
    setVisitorTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    fetch("/api/availability", { cache: "no-store" })
      .then(async (response) => {
        const value = (await response.json()) as {
          slots?: AvailabilitySlot[];
          error?: string;
        };
        if (!response.ok) throw new Error(value.error);
        return value;
      })
      .then((value) => setSlots(value.slots ?? []))
      .catch(() => toast.error("Could not load available times"))
      .finally(() => setLoadingSlots(false));
  }, []);

  const availableDateKeys = useMemo(
    () => new Set(slots.map((slot) => dateKey(new Date(slot.startsAt)))),
    [slots],
  );
  const selectedDate = selectedDateKey
    ? dateFromKey(selectedDateKey)
    : undefined;
  const selectedDateSlots = slots.filter(
    (slot) => dateKey(new Date(slot.startsAt)) === selectedDateKey,
  );
  const selectedSlotDetails = slots.find(
    (slot) => slot.startsAt === selectedSlot,
  );

  useEffect(() => {
    if (!selectedDateKey && slots.length) {
      const firstDateKey = dateKey(new Date(slots[0].startsAt));
      setSelectedDateKey(firstDateKey);
      setCalendarMonth(dateFromKey(firstDateKey));
    }
  }, [selectedDateKey, slots]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      toast.error("Choose an available time first");
      setStep("slot");
      return;
    }
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

  if (complete) {
    return (
      <div className="border-border/50 bg-card rounded-lg border p-10 text-center">
        <CalendarCheck className="text-primary mx-auto size-8" />
        <h3 className="font-display mt-4 text-2xl">Request received.</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          We’ll confirm the slot and send your Zoom link after approval.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border-border/50 bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <aside className="border-border/50 border-b p-7 lg:border-r lg:border-b-0">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-[0.16em]">
              theForge
            </div>
            <h2 className="font-display mt-5 text-2xl">
              Growth Constraint Map
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              A focused conversation about the constraint currently holding your
              growth back.
            </p>
            <div className="text-muted-foreground mt-7 flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              {duration} min
            </div>
            <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
              <Globe2 className="size-4" />
              {visitorTimezone}
            </div>
            {step === "details" && selectedSlotDetails && selectedDate ? (
              <div className="border-border/50 mt-7 border-t pt-5">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Selected time
                </p>
                <p className="mt-2 text-sm font-medium">
                  {formatDate(selectedDate)}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {new Date(selectedSlotDetails.startsAt).toLocaleTimeString(
                    [],
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  )}{" "}
                  ({selectedSlotDetails.timezone})
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="mt-4 h-auto px-0 text-sm"
                  onClick={() => setStep("slot")}
                >
                  <ArrowLeft className="size-3.5" /> Change time
                </Button>
              </div>
            ) : null}
          </aside>

          {step === "slot" ? (
            <section className="p-7 sm:p-9">
              <div className="mb-7">
                <h3 className="font-display text-2xl">Select a date & time</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Times are shown in your local timezone.
                </p>
              </div>

              <div className="grid gap-9 md:grid-cols-[minmax(280px,1fr)_190px]">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    onSelect={(date) => {
                      if (!date) return;
                      setSelectedDateKey(dateKey(date));
                      setSelectedSlot(undefined);
                    }}
                    disabled={
                      loadingSlots || !slots.length
                        ? () => true
                        : (date) => !availableDateKeys.has(dateKey(date))
                    }
                    className="mx-auto"
                  />
                  {!loadingSlots && !slots.length ? (
                    <p className="text-muted-foreground mt-4 text-center text-sm">
                      No times are currently available.
                    </p>
                  ) : null}
                </div>

                <div>
                  <h4 className="text-sm font-medium">
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "Available times"}
                  </h4>
                  <div className="mt-4 grid gap-2">
                    {selectedDateSlots.map((slot) => (
                      <div
                        key={slot.startsAt}
                        className={
                          selectedSlot === slot.startsAt
                            ? "grid grid-cols-2 gap-2"
                            : "grid"
                        }
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedSlot(slot.startsAt)}
                          className={
                            selectedSlot === slot.startsAt
                              ? "w-full rounded-md text-sm font-medium transition-colors"
                              : "text-primary hover:bg-primary/10 w-full rounded-md text-sm font-medium transition-colors"
                          }
                        >
                          {new Date(slot.startsAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </Button>
                        {selectedSlot === slot.startsAt ? (
                          <Button
                            type="button"
                            variant="ember"
                            onClick={() => setStep("details")}
                          >
                            <Check className="size-4" />
                            Next
                          </Button>
                        ) : null}
                      </div>
                    ))}
                    {!loadingSlots && !selectedDateSlots.length ? (
                      <p className="text-muted-foreground text-sm">
                        Choose another date.
                      </p>
                    ) : null}
                    {loadingSlots ? (
                      <p className="text-muted-foreground text-sm">
                        Loading times…
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <form onSubmit={submit} className="p-7 sm:p-9">
              <div className="mb-7">
                <h3 className="font-display text-2xl">Enter your details</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Add your details so we can confirm the conversation.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="booking-name">Name</Label>
                  <Input id="booking-name" name="name" required autoFocus />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="booking-email">Email</Label>
                  <Input
                    id="booking-email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="booking-company">Company</Label>
                  <Input id="booking-company" name="company" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="booking-notes">
                    What would you like to discuss?
                  </Label>
                  <Textarea id="booking-notes" name="notes" rows={4} />
                </div>
              </div>

              <input type="hidden" name="startsAt" value={selectedSlot ?? ""} />
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button variant="ember" disabled={pending}>
                  {pending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CalendarCheck />
                  )}
                  Schedule event
                </Button>
                <span className="text-muted-foreground text-xs">
                  You’ll receive a confirmation after approval.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      <article className="mx-auto mt-10 max-w-3xl border-t border-border/50 pt-8">
        <h3 className="font-display text-2xl">
          What the Growth Constraint Map is—and isn’t
        </h3>
        <div className="mt-5 grid gap-6 text-sm leading-relaxed sm:grid-cols-2">
          <div>
            <p className="font-medium">It is</p>
            <p className="text-muted-foreground mt-1">
              A focused diagnostic conversation to identify the constraint
              creating the most drag in your growth right now. We look at the
              handoffs between demand, follow-up, pipeline, delivery, and
              reporting, then clarify where a practical next move could create
              the most leverage.
            </p>
          </div>
          <div>
            <p className="font-medium">It isn’t</p>
            <p className="text-muted-foreground mt-1">
              A generic marketing audit, a sales pitch, or a promise of instant
              answers. You won’t leave with a 50-page report or a list of
              disconnected tactics. The goal is a sharper view of the
              bottleneck, what is contributing to it, and whether theForge is
              the right partner to help address it.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
