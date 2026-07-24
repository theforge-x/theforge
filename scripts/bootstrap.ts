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

  for (const client of seedClients) {
    const value = {
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
    };
    await db
      .insert(clients)
      .values(value)
      .onConflictDoUpdate({
        target: clients.id,
        set: {
          name: value.name,
          contact: value.contact,
          industry: value.industry,
          plan: value.plan,
          status: value.status,
          mrrCents: value.mrrCents,
          currency: value.currency,
          startDate: value.startDate,
          health: value.health,
        },
      });
  }

  for (const project of seedProjects) {
    const value = {
      id: project.id,
      clientId: project.clientId,
      name: project.name,
      phase: project.phase,
      progress: project.progress,
      owner: project.owner,
      dueDate: project.dueDate,
    };
    await db
      .insert(projects)
      .values(value)
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          clientId: value.clientId,
          name: value.name,
          phase: value.phase,
          progress: value.progress,
          owner: value.owner,
          dueDate: value.dueDate,
        },
      });
  }

  for (const invoice of seedInvoices) {
    const value = {
      id: invoice.id,
      clientId: invoice.clientId,
      amountCents: invoice.amount * 100,
      currency: "USD",
      status: invoice.status,
      issued: invoice.issued,
      due: invoice.due,
    };
    await db
      .insert(invoices)
      .values(value)
      .onConflictDoUpdate({
        target: invoices.id,
        set: {
          clientId: value.clientId,
          amountCents: value.amountCents,
          currency: value.currency,
          status: value.status,
          issued: value.issued,
          due: value.due,
        },
      });
  }

  for (const report of seedReports) {
    const value = {
      id: report.id,
      clientId: report.clientId,
      title: report.title,
      reportDate: report.date,
      type: report.type,
    };
    await db
      .insert(reports)
      .values(value)
      .onConflictDoUpdate({
        target: reports.id,
        set: {
          clientId: value.clientId,
          title: value.title,
          reportDate: value.reportDate,
          type: value.type,
        },
      });
  }

  const metricValues: Array<{
    id: string;
    clientId: string | null;
    month: string;
    mrrCents: number;
    addedRevenueCents: number;
    leads: number;
    conversions: number;
  }> = [
    ...monthlyRevenue.map((metric, index) => ({
      id: `studio-2026-${String(index + 2).padStart(2, "0")}`,
      clientId: null,
      month: `2026-${String(index + 2).padStart(2, "0")}-01`,
      mrrCents: metric.mrr * 100,
      addedRevenueCents: metric.addedRevenue * 100,
      leads: 0,
      conversions: 0,
    })),
    ...clientGrowth.map((metric, index) => ({
      id: `onyx-2026-${String(index + 2).padStart(2, "0")}`,
      clientId: "c-onyx",
      month: `2026-${String(index + 2).padStart(2, "0")}-01`,
      mrrCents: 0,
      addedRevenueCents: 0,
      leads: metric.leads,
      conversions: metric.conversions,
    })),
  ];
  for (const value of metricValues) {
    await db
      .insert(monthlyMetrics)
      .values(value)
      .onConflictDoUpdate({
        target: monthlyMetrics.id,
        set: {
          clientId: value.clientId,
          month: value.month,
          mrrCents: value.mrrCents,
          addedRevenueCents: value.addedRevenueCents,
          leads: value.leads,
          conversions: value.conversions,
        },
      });
  }

  const contentValues: Array<{
    id: string;
    title: string;
    slug: string;
    kind: string;
    status: string;
    excerpt: string;
    body: string;
    category: string;
    projectId: string | null;
    featuredImage: string | null;
    seoTitle: string;
    seoDescription: string;
    publishedAt?: Date;
  }> = [
    {
      id: "content-acquisition-channel",
      title: "Why one acquisition channel always fails eventually",
      slug: "why-one-acquisition-channel-fails",
      kind: "article",
      status: "published",
      excerpt:
        "Build a resilient acquisition system before a single channel becomes a constraint.",
      body: "Use this editor to replace this starter copy with the complete article.",
      category: "Strategy",
      projectId: null,
      featuredImage: null,
      seoTitle: "",
      seoDescription: "",
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
      category: "Strategy",
      projectId: null,
      featuredImage: null,
      seoTitle: "",
      seoDescription: "",
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
      category: "Strategy",
      projectId: null,
      featuredImage: null,
      seoTitle: "",
      seoDescription: "",
    },
    ...caseStudySeeds.map((caseStudy) => ({
      ...caseStudy,
      kind: "case-study",
      status: "published",
      publishedAt: new Date("2026-07-01T00:00:00Z"),
    })),
  ];
  for (const value of contentValues) {
    await db
      .insert(contentPosts)
      .values(value)
      .onConflictDoUpdate({
        target: contentPosts.slug,
        set: {
          title: value.title,
          slug: value.slug,
          kind: value.kind,
          status: value.status,
          excerpt: value.excerpt,
          body: value.body,
          category: value.category,
          projectId: value.projectId,
          featuredImage: value.featuredImage,
          seoTitle: value.seoTitle,
          seoDescription: value.seoDescription,
          publishedAt: value.publishedAt,
        },
      });
  }

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
