import { and, gt, ne } from "drizzle-orm";
import { getStudioSettings } from "@/lib/data-access";
import { db } from "@/lib/db";
import { appointments, availabilityRules, blockedDates } from "@/lib/db/schema";

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<string, number>;
}

function localToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const actual = partsInZone(new Date(guess), timeZone);
    const represented = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second ?? 0,
    );
    guess += Date.UTC(year, month - 1, day, hour, minute) - represented;
  }
  return new Date(guess);
}

export async function listAvailableSlots(days = 30) {
  const [rules, blocks, bookings, settings] = await Promise.all([
    db.select().from(availabilityRules),
    db.select().from(blockedDates).where(gt(blockedDates.endsAt, new Date())),
    db
      .select()
      .from(appointments)
      .where(
        and(
          ne(appointments.status, "cancelled"),
          gt(appointments.startsAt, new Date()),
        ),
      ),
    getStudioSettings(),
  ]);
  const slots: { startsAt: string; timezone: string }[] = [];
  const now = Date.now() + 60 * 60 * 1000;
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + dayOffset);
    for (const rule of rules.filter((item) => item.active)) {
      const local = partsInZone(date, rule.timezone);
      const weekday = new Date(
        Date.UTC(local.year, local.month - 1, local.day),
      ).getUTCDay();
      if (weekday !== rule.weekday) continue;
      const [startHour, startMinute] = rule.startTime.split(":").map(Number);
      const [endHour, endMinute] = rule.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      for (
        let minute = startTotal;
        minute + settings.appointmentDuration <= endTotal;
        minute += rule.slotInterval
      ) {
        const startsAt = localToUtc(
          local.year,
          local.month,
          local.day,
          Math.floor(minute / 60),
          minute % 60,
          rule.timezone,
        );
        const endsAt = new Date(
          startsAt.getTime() + settings.appointmentDuration * 60000,
        );
        if (startsAt.getTime() < now) continue;
        const unavailable =
          blocks.some(
            (block) => block.startsAt < endsAt && block.endsAt > startsAt,
          ) ||
          bookings.some(
            (booking) =>
              booking.startsAt < endsAt &&
              new Date(
                booking.startsAt.getTime() + booking.durationMinutes * 60000,
              ) > startsAt,
          );
        if (!unavailable)
          slots.push({
            startsAt: startsAt.toISOString(),
            timezone: rule.timezone,
          });
      }
    }
  }
  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
