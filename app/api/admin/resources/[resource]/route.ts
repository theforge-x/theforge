import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import {
  appointments,
  clients,
  contactEnquiries,
  contentPosts,
  invoices,
  projects,
  reports,
  studioSettings,
} from "@/lib/db/schema";
import { createZoomMeeting } from "@/lib/zoom";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const optionalUrl = z
  .union([z.literal(""), z.string().url()])
  .transform((v) => v || null);

const schemas = {
  clients: z.object({
    id: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).max(160),
    contact: z.string().trim().min(1).max(160),
    industry: z.string().trim().min(1).max(120),
    plan: z.string().trim().min(1).max(120),
    status: z.enum(["active", "onboarding", "paused", "churned"]),
    mrr: z.coerce.number().min(0),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((v) => v.toUpperCase()),
    startDate: dateString,
    health: z.coerce.number().int().min(0).max(100),
  }),
  projects: z.object({
    id: z.string().trim().min(1).optional(),
    clientId: z.string().trim().min(1),
    name: z.string().trim().min(1).max(200),
    phase: z.enum(["Diagnose", "Forge", "Temper"]),
    progress: z.coerce.number().int().min(0).max(100),
    owner: z.string().trim().min(1).max(160),
    dueDate: dateString,
  }),
  invoices: z.object({
    id: z.string().trim().min(1).max(80),
    clientId: z.string().trim().min(1),
    amount: z.coerce.number().positive(),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((v) => v.toUpperCase()),
    status: z.enum(["paid", "due", "overdue"]),
    issued: dateString,
    due: dateString,
  }),
  reports: z.object({
    id: z.string().trim().min(1).optional(),
    clientId: z.string().trim().min(1),
    title: z.string().trim().min(1).max(200),
    date: dateString,
    type: z.string().trim().min(1).max(80),
    fileUrl: optionalUrl,
  }),
  content: z
    .object({
      id: z.string().trim().min(1).optional(),
      title: z.string().trim().min(1).max(220),
      slug: z
        .string()
        .trim()
        .min(1)
        .max(220)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      kind: z.enum(["article", "case-study"]),
      projectId: z.preprocess(
        (value) => (value === "" ? null : value),
        z.string().trim().min(1).nullable().optional(),
      ),
      status: z.enum(["draft", "published"]),
      excerpt: z.string().trim().max(500),
      body: z.string().trim(),
      category: z.string().trim().min(1).max(100),
      featuredImage: z
        .union([z.literal(""), z.string().max(2_000_000)])
        .transform((v) => v || null),
      seoTitle: z.string().trim().max(70),
      seoDescription: z.string().trim().max(170),
    })
    .superRefine((value, ctx) => {
      if (value.kind === "case-study" && !value.projectId) {
        ctx.addIssue({
          code: "custom",
          path: ["projectId"],
          message: "Case studies must be associated with a project",
        });
      }
    }),
  enquiries: z.object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1).max(160),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(60).nullable().optional(),
    company: z.string().trim().max(160).nullable().optional(),
    service: z.string().trim().max(160).nullable().optional(),
    budget: z.string().trim().max(80).nullable().optional(),
    message: z.string().trim().min(1).max(5000),
    status: z.enum(["new", "contacted", "qualified", "closed"]),
    notes: z.string().trim().max(5000),
  }),
  appointments: z.object({
    id: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).max(160),
    email: z.string().trim().email().max(200),
    company: z.string().trim().max(160).nullable().optional(),
    notes: z.string().trim().max(5000),
    startsAt: z.string().datetime(),
    durationMinutes: z.coerce.number().int().min(15).max(240),
    status: z.enum(["pending", "approved", "cancelled"]),
  }),
  settings: z.object({
    studioName: z.string().trim().min(1).max(160),
    billingEmail: z.string().trim().email().max(200),
    publicEmail: z.string().trim().email().max(200),
    phone: z.string().trim().min(1).max(80),
    tagline: z.string().trim().min(1).max(220),
    appointmentDuration: z.coerce.number().int().min(15).max(240),
    notifyNewClient: z.boolean(),
    notifyOverdueInvoice: z.boolean(),
    notifyWeeklyDigest: z.boolean(),
  }),
};

type Resource = keyof typeof schemas;

async function authorize(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return Boolean(session && hasRole(session.user.role, "admin"));
}

function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const message = error instanceof Error ? error.message : "Request failed";
  const conflict = /duplicate key|foreign key|violates/i.test(message);
  return Response.json(
    {
      error: conflict
        ? "This record is referenced elsewhere or uses a value that already exists."
        : "Could not save this record.",
    },
    { status: conflict ? 409 : 500 },
  );
}

function refreshAdmin() {
  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
  revalidatePath("/", "layout");
}

async function context(
  request: Request,
  params: Promise<{ resource: string }>,
) {
  if (!(await authorize(request)))
    return { response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  const { resource } = await params;
  if (!(resource in schemas))
    return {
      response: Response.json({ error: "Unknown resource" }, { status: 404 }),
    };
  return { resource: resource as Resource };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const ctx = await context(request, params);
  if ("response" in ctx) return ctx.response;
  try {
    const body = schemas[ctx.resource].parse(await request.json());
    switch (ctx.resource) {
      case "clients": {
        const value = body as z.infer<typeof schemas.clients>;
        await db.insert(clients).values({
          id: value.id ?? randomUUID(),
          name: value.name,
          contact: value.contact,
          industry: value.industry,
          plan: value.plan,
          status: value.status,
          mrrCents: Math.round(value.mrr * 100),
          currency: value.currency,
          startDate: value.startDate,
          health: value.health,
        });
        break;
      }
      case "projects": {
        const value = body as z.infer<typeof schemas.projects>;
        await db
          .insert(projects)
          .values({ ...value, id: value.id ?? randomUUID() });
        break;
      }
      case "invoices": {
        const value = body as z.infer<typeof schemas.invoices>;
        await db.insert(invoices).values({
          id: value.id,
          clientId: value.clientId,
          amountCents: Math.round(value.amount * 100),
          currency: value.currency,
          status: value.status,
          issued: value.issued,
          due: value.due,
        });
        break;
      }
      case "reports": {
        const value = body as z.infer<typeof schemas.reports>;
        await db.insert(reports).values({
          id: value.id ?? randomUUID(),
          clientId: value.clientId,
          title: value.title,
          reportDate: value.date,
          type: value.type,
          fileUrl: value.fileUrl,
        });
        break;
      }
      case "content": {
        const value = body as z.infer<typeof schemas.content>;
        await db.insert(contentPosts).values({
          ...value,
          projectId: value.kind === "case-study" ? value.projectId : null,
          id: value.id ?? randomUUID(),
          publishedAt: value.status === "published" ? new Date() : null,
        });
        break;
      }
      case "enquiries":
        return Response.json(
          { error: "Use the public form to create this resource" },
          { status: 405 },
        );
      case "appointments": {
        const value = body as z.infer<typeof schemas.appointments>;
        if (value.status !== "cancelled") {
          const startsAt = new Date(value.startsAt);
          const endsAt = new Date(
            startsAt.getTime() + value.durationMinutes * 60_000,
          );
          const conflicts = await db.execute(
            sql`select id from appointments where status <> 'cancelled' and starts_at < ${endsAt} and starts_at + (duration_minutes * interval '1 minute') > ${startsAt} limit 1`,
          );
          if (conflicts.rows.length)
            return Response.json(
              { error: "That time overlaps another appointment." },
              { status: 409 },
            );
        }
        let meeting: { url: string | null; id: string | null } = {
          url: null,
          id: null,
        };
        if (value.status === "approved")
          meeting = await createZoomMeeting({
            topic: `The Forge consultation with ${value.name}`,
            startsAt: new Date(value.startsAt),
            durationMinutes: value.durationMinutes,
          });
        await db.insert(appointments).values({
          id: value.id ?? randomUUID(),
          name: value.name,
          email: value.email,
          company: value.company,
          notes: value.notes,
          startsAt: new Date(value.startsAt),
          durationMinutes: value.durationMinutes,
          status: value.status,
          meetingUrl: meeting.url,
          providerMeetingId: meeting.id,
        });
        break;
      }
      case "settings":
        return Response.json(
          { error: "Use PUT for settings" },
          { status: 405 },
        );
    }
    refreshAdmin();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const ctx = await context(request, params);
  if ("response" in ctx) return ctx.response;
  try {
    const json = await request.json();
    const body = schemas[ctx.resource].parse(json);
    switch (ctx.resource) {
      case "clients": {
        const value = body as z.infer<typeof schemas.clients>;
        if (!value.id) throw new Error("Missing id");
        await db
          .update(clients)
          .set({
            name: value.name,
            contact: value.contact,
            industry: value.industry,
            plan: value.plan,
            status: value.status,
            mrrCents: Math.round(value.mrr * 100),
            currency: value.currency,
            startDate: value.startDate,
            health: value.health,
          })
          .where(eq(clients.id, value.id));
        break;
      }
      case "projects": {
        const value = body as z.infer<typeof schemas.projects>;
        if (!value.id) throw new Error("Missing id");
        await db.update(projects).set(value).where(eq(projects.id, value.id));
        break;
      }
      case "invoices": {
        const value = body as z.infer<typeof schemas.invoices>;
        await db
          .update(invoices)
          .set({
            clientId: value.clientId,
            amountCents: Math.round(value.amount * 100),
            currency: value.currency,
            status: value.status,
            issued: value.issued,
            due: value.due,
          })
          .where(eq(invoices.id, value.id));
        break;
      }
      case "reports": {
        const value = body as z.infer<typeof schemas.reports>;
        if (!value.id) throw new Error("Missing id");
        await db
          .update(reports)
          .set({
            clientId: value.clientId,
            title: value.title,
            reportDate: value.date,
            type: value.type,
            fileUrl: value.fileUrl,
          })
          .where(eq(reports.id, value.id));
        break;
      }
      case "content": {
        const value = body as z.infer<typeof schemas.content>;
        if (!value.id) throw new Error("Missing id");
        const [current] = await db
          .select({ publishedAt: contentPosts.publishedAt })
          .from(contentPosts)
          .where(eq(contentPosts.id, value.id))
          .limit(1);
        await db
          .update(contentPosts)
          .set({
            title: value.title,
            slug: value.slug,
            kind: value.kind,
            status: value.status,
            excerpt: value.excerpt,
            body: value.body,
            category: value.category,
            projectId: value.kind === "case-study" ? value.projectId : null,
            featuredImage: value.featuredImage,
            seoTitle: value.seoTitle,
            seoDescription: value.seoDescription,
            publishedAt:
              value.status === "published"
                ? (current?.publishedAt ?? new Date())
                : null,
          })
          .where(eq(contentPosts.id, value.id));
        break;
      }
      case "enquiries": {
        const value = body as z.infer<typeof schemas.enquiries>;
        await db
          .update(contactEnquiries)
          .set({
            name: value.name,
            email: value.email,
            phone: value.phone,
            company: value.company,
            service: value.service,
            budget: value.budget,
            message: value.message,
            status: value.status,
            notes: value.notes,
          })
          .where(eq(contactEnquiries.id, value.id));
        break;
      }
      case "appointments": {
        const value = body as z.infer<typeof schemas.appointments>;
        if (!value.id) throw new Error("Missing id");
        const [current] = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, value.id))
          .limit(1);
        if (!current)
          return Response.json(
            { error: "Appointment not found" },
            { status: 404 },
          );
        if (value.status !== "cancelled") {
          const end = new Date(
            new Date(value.startsAt).getTime() + value.durationMinutes * 60_000,
          );
          const conflicts = await db.execute(
            sql`select id from appointments where id <> ${value.id} and status <> 'cancelled' and starts_at < ${end} and starts_at + (duration_minutes * interval '1 minute') > ${new Date(value.startsAt)} limit 1`,
          );
          if (conflicts.rows.length)
            return Response.json(
              { error: "That time overlaps another appointment." },
              { status: 409 },
            );
        }
        let meeting = {
          url: current.meetingUrl,
          id: current.providerMeetingId,
        };
        if (
          value.status === "approved" &&
          (!current.meetingUrl ||
            current.startsAt.toISOString() !== value.startsAt)
        ) {
          meeting = await createZoomMeeting({
            topic: `The Forge consultation with ${value.name}`,
            startsAt: new Date(value.startsAt),
            durationMinutes: value.durationMinutes,
          });
        }
        await db
          .update(appointments)
          .set({
            name: value.name,
            email: value.email,
            company: value.company,
            notes: value.notes,
            startsAt: new Date(value.startsAt),
            durationMinutes: value.durationMinutes,
            status: value.status,
            meetingUrl: value.status === "approved" ? meeting.url : null,
            providerMeetingId: value.status === "approved" ? meeting.id : null,
          })
          .where(eq(appointments.id, value.id));
        break;
      }
      case "settings": {
        const value = body as z.infer<typeof schemas.settings>;
        await db
          .insert(studioSettings)
          .values({ id: "default", ...value })
          .onConflictDoUpdate({ target: studioSettings.id, set: value });
        break;
      }
    }
    refreshAdmin();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const ctx = await context(request, params);
  if ("response" in ctx) return ctx.response;
  if (ctx.resource === "settings")
    return Response.json(
      { error: "Settings cannot be deleted" },
      { status: 405 },
    );
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const table = {
      clients,
      projects,
      invoices,
      reports,
      content: contentPosts,
      enquiries: contactEnquiries,
      appointments,
    }[ctx.resource];
    await db.delete(table).where(eq(table.id, id));
    refreshAdmin();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
