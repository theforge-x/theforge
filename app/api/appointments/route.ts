import { and, gt, lt, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { listAvailableSlots } from "@/lib/availability";
import { getStudioSettings } from "@/lib/data-access";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";

const appointmentSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(5000).optional(),
  startsAt: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const value = appointmentSchema.parse(await request.json());
    const startsAt = new Date(value.startsAt);
    if (startsAt.getTime() < Date.now() + 60 * 60 * 1000) {
      return Response.json(
        { error: "Choose a time at least one hour from now." },
        { status: 400 },
      );
    }
    const available = await listAvailableSlots();
    if (!available.some((slot) => slot.startsAt === startsAt.toISOString())) {
      return Response.json(
        {
          error:
            "That time is outside current availability or has just been booked.",
        },
        { status: 409 },
      );
    }
    const settings = await getStudioSettings();
    const endsAt = new Date(
      startsAt.getTime() + settings.appointmentDuration * 60_000,
    );
    const appointment = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(843621)`);
      const possibleConflicts = await tx
        .select()
        .from(appointments)
        .where(
          and(
            ne(appointments.status, "cancelled"),
            lt(appointments.startsAt, endsAt),
            gt(
              appointments.startsAt,
              new Date(startsAt.getTime() - 240 * 60_000),
            ),
          ),
        );
      if (
        possibleConflicts.some(
          (item) =>
            item.startsAt.getTime() + item.durationMinutes * 60_000 >
            startsAt.getTime(),
        )
      )
        throw new Error("SLOT_CONFLICT");
      const [created] = await tx
        .insert(appointments)
        .values({
          ...value,
          startsAt,
          durationMinutes: settings.appointmentDuration,
        })
        .returning({ id: appointments.id });
      return created;
    });
    return Response.json({ ok: true, id: appointment.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid appointment" },
        { status: 400 },
      );
    const message = error instanceof Error ? error.message : "";
    if (
      /SLOT_CONFLICT|appointments_active_slot_idx|duplicate key/i.test(message)
    ) {
      return Response.json(
        { error: "That time is no longer available." },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Could not request the appointment." },
      { status: 500 },
    );
  }
}
