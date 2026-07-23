import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { caseStudySeeds } from "../lib/case-study-seeds";
import {
  clientGrowth,
  monthlyRevenue,
  clients as seedClients,
  invoices as seedInvoices,
  projects as seedProjects,
  reports as seedReports,
} from "../lib/data";
import { db, pool } from "../lib/db";
import {
  account,
  clientMembers,
  clients,
  contentPosts,
  invoices,
  monthlyMetrics,
  projects,
  reports,
  studioSettings,
  user,
} from "../lib/db/schema";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function ensureUser(input: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client";
}) {
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, input.email.toLowerCase()))
    .limit(1);
  if (existing) {
    await db
      .update(user)
      .set({ role: input.role })
      .where(eq(user.id, existing.id));
    return existing.id;
  }

  const userId = randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(user).values({
      id: userId,
      name: input.name,
      email: input.email.toLowerCase(),
      role: input.role,
    });
    await tx.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: await hashPassword(input.password),
    });
  });
  return userId;
}

async function main() {
  await db
    .insert(studioSettings)
    .values({ id: "default" })
    .onConflictDoNothing();

  await db
    .insert(clients)
    .values(
      seedClients.map((client) => ({
        id: client.id,
        name: client.name,
        contact: client.contact,
        industry: client.industry,
        plan: client.plan,
        status: client.status,
        mrrCents: client.mrr * 100,
        currency: "USD",
        startDate: client.startDate,
        health: client.health,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(projects)
    .values(
      seedProjects.map((project) => ({
        id: project.id,
        clientId: project.clientId,
        name: project.name,
        phase: project.phase,
        progress: project.progress,
        owner: project.owner,
        dueDate: project.dueDate,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(invoices)
    .values(
      seedInvoices.map((invoice) => ({
        id: invoice.id,
        clientId: invoice.clientId,
        amountCents: invoice.amount * 100,
        currency: "USD",
        status: invoice.status,
        issued: invoice.issued,
        due: invoice.due,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(reports)
    .values(
      seedReports.map((report) => ({
        id: report.id,
        clientId: report.clientId,
        title: report.title,
        reportDate: report.date,
        type: report.type,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(monthlyMetrics)
    .values([
      ...monthlyRevenue.map((metric, index) => ({
        id: `studio-2026-${String(index + 2).padStart(2, "0")}`,
        month: `2026-${String(index + 2).padStart(2, "0")}-01`,
        mrrCents: metric.mrr * 100,
        addedRevenueCents: metric.addedRevenue * 100,
      })),
      ...clientGrowth.map((metric, index) => ({
        id: `onyx-2026-${String(index + 2).padStart(2, "0")}`,
        clientId: "c-onyx",
        month: `2026-${String(index + 2).padStart(2, "0")}-01`,
        leads: metric.leads,
        conversions: metric.conversions,
      })),
    ])
    .onConflictDoNothing();

  await db
    .insert(contentPosts)
    .values([
      {
        id: "content-acquisition-channel",
        title: "Why one acquisition channel always fails eventually",
        slug: "why-one-acquisition-channel-fails",
        kind: "article",
        status: "published",
        excerpt:
          "Build a resilient acquisition system before a single channel becomes a constraint.",
        body: "Use this editor to replace this starter copy with the complete article.",
        publishedAt: new Date("2026-07-10T00:00:00Z"),
      },
      {
        id: "content-value-pricing",
        title: "Pricing by value, not by hour: a framework",
        slug: "pricing-by-value-framework",
        kind: "article",
        status: "published",
        excerpt:
          "A practical framework for connecting price to outcomes instead of effort.",
        body: "Use this editor to replace this starter copy with the complete article.",
        publishedAt: new Date("2026-06-22T00:00:00Z"),
      },
      {
        id: "content-retention-system",
        title: "The retention system most agencies skip",
        slug: "retention-system-agencies-skip",
        kind: "article",
        status: "draft",
        excerpt:
          "A draft guide to building retention into delivery from day one.",
        body: "Continue drafting this article in the admin content editor.",
      },
      ...caseStudySeeds.map((caseStudy) => ({
        ...caseStudy,
        kind: "case-study",
        status: "published",
        publishedAt: new Date("2026-07-01T00:00:00Z"),
      })),
    ])
    .onConflictDoNothing();

  await ensureUser({
    name: required("BOOTSTRAP_ADMIN_NAME"),
    email: required("BOOTSTRAP_ADMIN_EMAIL"),
    password: required("BOOTSTRAP_ADMIN_PASSWORD"),
    role: "admin",
  });
  const clientUserId = await ensureUser({
    name: required("BOOTSTRAP_CLIENT_NAME"),
    email: required("BOOTSTRAP_CLIENT_EMAIL"),
    password: required("BOOTSTRAP_CLIENT_PASSWORD"),
    role: "client",
  });

  await db
    .insert(clientMembers)
    .values({
      clientId: "c-onyx",
      userId: clientUserId,
      title: "Managing Partner",
    })
    .onConflictDoNothing();

  console.info("Database bootstrap complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
