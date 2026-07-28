import { and, asc, desc, eq, isNull } from "drizzle-orm";
import {
  type CaseStudy,
  type Client,
  caseStudies as fallbackCaseStudies,
  clients as fallbackClients,
  projects as fallbackProjects,
  type Invoice,
  type Project,
} from "@/lib/data";
import { db } from "@/lib/db";
import {
  appointments,
  availabilityRules,
  blockedDates,
  clientMembers,
  clients,
  contactEnquiries,
  contentPosts,
  invoices,
  leads,
  monthlyMetrics,
  projects,
  reports,
  salesQuotes,
  studioSettings,
  websiteDemos,
} from "@/lib/db/schema";

export type ClientView = Client & { currency: string };
export type ProjectView = Project;
export type InvoiceView = Invoice & { currency: string };
export type ReportView = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: string;
  fileUrl: string | null;
};

function getFallbackPublishedCaseStudy(slug: string) {
  const caseStudy = fallbackCaseStudies.find((item) => item.slug === slug);
  if (!caseStudy) return null;

  const project = fallbackProjects.find(
    (item) => item.id === caseStudy.projectId,
  );
  const client = fallbackClients.find((item) => item.name === caseStudy.client);
  if (!project || !client) return null;

  const now = new Date();

  return {
    post: {
      id: `fallback-${caseStudy.slug}`,
      title: caseStudy.title,
      slug: caseStudy.slug,
      kind: "case-study",
      status: "published",
      excerpt: caseStudy.summary,
      body: caseStudy.summary,
      category: caseStudy.tags[0] ?? "Case Study",
      projectId: project.id,
      featuredImage: caseStudy.featuredImage ?? null,
      seoTitle: caseStudy.title,
      seoDescription: caseStudy.summary,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    project: {
      id: project.id,
      clientId: project.clientId,
      name: project.name,
      phase: project.phase,
      progress: project.progress,
      owner: project.owner,
      dueDate: project.dueDate,
      createdAt: now,
      updatedAt: now,
    },
    client: {
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
      createdAt: now,
      updatedAt: now,
    },
  };
}

function getFallbackStudioSettings() {
  return {
    id: "default",
    studioName: "theForge",
    billingEmail: "support@theforge.ng",
    publicEmail: "hello@theforge.ng",
    phone: "+1 (888) 449-8124",
    tagline: "Growth, forged — not guessed.",
    appointmentDuration: 30,
    notifyNewClient: true,
    notifyOverdueInvoice: true,
    notifyWeeklyDigest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function toClient(row: typeof clients.$inferSelect): ClientView {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    industry: row.industry,
    plan: row.plan as Client["plan"],
    status: row.status,
    mrr: row.mrrCents / 100,
    startDate: row.startDate,
    health: row.health,
    currency: row.currency,
  };
}

function toInvoice(row: typeof invoices.$inferSelect): InvoiceView {
  return {
    id: row.id,
    clientId: row.clientId,
    amount: row.amountCents / 100,
    currency: row.currency,
    status: row.status,
    issued: row.issued,
    due: row.due,
  };
}

function toReport(row: typeof reports.$inferSelect): ReportView {
  return {
    id: row.id,
    clientId: row.clientId,
    title: row.title,
    date: row.reportDate,
    type: row.type,
    fileUrl: row.fileUrl,
  };
}

export async function getClients() {
  return (await db.select().from(clients).orderBy(asc(clients.name))).map(
    toClient,
  );
}

export async function getAllProjects(): Promise<ProjectView[]> {
  const rows = await db
    .select({ project: projects, clientName: clients.name })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .orderBy(asc(projects.dueDate));

  return rows.map(({ project, clientName }) => ({
    id: project.id,
    clientId: project.clientId,
    clientName,
    name: project.name,
    phase: project.phase,
    progress: project.progress,
    owner: project.owner,
    dueDate: project.dueDate,
  }));
}

export async function getClientAccountForUser(userId: string) {
  const [membership] = await db
    .select({ client: clients, title: clientMembers.title })
    .from(clientMembers)
    .innerJoin(clients, eq(clientMembers.clientId, clients.id))
    .where(eq(clientMembers.userId, userId))
    .limit(1);

  return membership
    ? { client: toClient(membership.client), title: membership.title }
    : null;
}

export async function getClientWorkspace(clientId: string) {
  const [projectRows, invoiceRows, reportRows, metricRows] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(asc(projects.dueDate)),
    db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId))
      .orderBy(desc(invoices.issued)),
    db
      .select()
      .from(reports)
      .where(eq(reports.clientId, clientId))
      .orderBy(desc(reports.reportDate)),
    db
      .select()
      .from(monthlyMetrics)
      .where(eq(monthlyMetrics.clientId, clientId))
      .orderBy(asc(monthlyMetrics.month)),
  ]);

  const projectViews: ProjectView[] = projectRows.map((project) => ({
    id: project.id,
    clientId: project.clientId,
    clientName: "",
    name: project.name,
    phase: project.phase,
    progress: project.progress,
    owner: project.owner,
    dueDate: project.dueDate,
  }));

  return {
    projects: projectViews,
    invoices: invoiceRows.map(toInvoice),
    reports: reportRows.map(toReport),
    growth: metricRows.map((metric) => ({
      month: new Date(`${metric.month}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      leads: metric.leads,
      conversions: metric.conversions,
    })),
  };
}

export async function getStudioMetrics() {
  const [clientRows, metricRows] = await Promise.all([
    getClients(),
    db
      .select()
      .from(monthlyMetrics)
      .where(isNull(monthlyMetrics.clientId))
      .orderBy(asc(monthlyMetrics.month)),
  ]);

  return {
    clients: clientRows,
    monthlyRevenue: metricRows.map((metric) => ({
      month: new Date(`${metric.month}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      mrr: metric.mrrCents / 100,
      addedRevenue: metric.addedRevenueCents / 100,
    })),
  };
}

export async function getClientDetails(clientId: string) {
  const [clientRow] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);
  if (!clientRow) return null;

  const workspace = await getClientWorkspace(clientId);
  return { client: toClient(clientRow), ...workspace };
}

export async function getOwnedInvoice(invoiceId: string, userId: string) {
  const [row] = await db
    .select({ invoice: invoices })
    .from(invoices)
    .innerJoin(
      clientMembers,
      and(
        eq(clientMembers.clientId, invoices.clientId),
        eq(clientMembers.userId, userId),
      ),
    )
    .where(eq(invoices.id, invoiceId))
    .limit(1);
  return row?.invoice ?? null;
}

export async function getContentPosts() {
  return db.select().from(contentPosts).orderBy(desc(contentPosts.updatedAt));
}

export async function getPublishedPosts() {
  return db
    .select()
    .from(contentPosts)
    .where(
      and(
        eq(contentPosts.status, "published"),
        eq(contentPosts.kind, "article"),
      ),
    )
    .orderBy(desc(contentPosts.publishedAt));
}

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  const metricBySlug: Record<string, CaseStudy["metric"]> = {
    "onyx-legal-referral-rebuild": {
      label: "Qualified intake",
      value: "+64%",
    },
    "onyx-corporate-client-retention-system": {
      label: "Repeat-instruction rate",
      value: "+31%",
    },
    "fabrica-multi-channel-bid-pipeline": {
      label: "Qualified bid pipeline",
      value: "+118%",
    },
    "fabrica-estimating-follow-up-workflow": {
      label: "Median bid cycle",
      value: "-9 days",
    },
    "lumen-patient-retention-system": {
      label: "Recall recovery",
      value: "+43%",
    },
    "lumen-recall-referral-loop": {
      label: "Referral-ready patients",
      value: "+52%",
    },
    "marrow-wholesale-acquisition-engine": {
      label: "Wholesale accounts",
      value: "+37",
    },
    "marrow-margin-aware-partner-system": {
      label: "Gross margin",
      value: "+8.4 pts",
    },
    "josren-fashion-commerce-intelligence": {
      label: "Collection conversion",
      value: "+27%",
    },
    "josren-collection-launch-system": {
      label: "Launch sell-through",
      value: "+34%",
    },
    "right-mind-homes-enquiry-admissions-system": {
      label: "First response time",
      value: "-71%",
    },
    "right-mind-homes-family-journey": {
      label: "Family update completion",
      value: "+46%",
    },
  };

  try {
    const rows = await db
      .select({
        post: contentPosts,
        project: projects,
        clientName: clients.name,
        industry: clients.industry,
      })
      .from(contentPosts)
      .innerJoin(projects, eq(contentPosts.projectId, projects.id))
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(
        and(
          eq(contentPosts.status, "published"),
          eq(contentPosts.kind, "case-study"),
        ),
      )
      .orderBy(desc(contentPosts.publishedAt));

    const publishedCaseStudies = rows.map(
      ({ post, project, clientName, industry }) => ({
        slug: post.slug,
        projectId: project.id,
        title: post.title,
        client: clientName,
        industry,
        summary: post.excerpt,
        featuredImage: post.featuredImage,
        metric: metricBySlug[post.slug] ?? {
          label: "Project progress",
          value: `${project.progress}%`,
        },
        tags: [post.category, project.phase],
      }),
    );

    return publishedCaseStudies.length
      ? publishedCaseStudies
      : fallbackCaseStudies;
  } catch {
    return fallbackCaseStudies;
  }
}

export async function getPublishedCaseStudy(slug: string) {
  try {
    const [row] = await db
      .select({
        post: contentPosts,
        project: projects,
        client: clients,
      })
      .from(contentPosts)
      .innerJoin(projects, eq(contentPosts.projectId, projects.id))
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(
        and(
          eq(contentPosts.slug, slug),
          eq(contentPosts.status, "published"),
          eq(contentPosts.kind, "case-study"),
        ),
      )
      .limit(1);

    return row ?? getFallbackPublishedCaseStudy(slug);
  } catch {
    return getFallbackPublishedCaseStudy(slug);
  }
}

export async function getPublishedPost(slug: string) {
  const [post] = await db
    .select()
    .from(contentPosts)
    .where(
      and(
        eq(contentPosts.slug, slug),
        eq(contentPosts.status, "published"),
        eq(contentPosts.kind, "article"),
      ),
    )
    .limit(1);
  return post ?? null;
}

export async function getContactEnquiries() {
  return db
    .select()
    .from(contactEnquiries)
    .orderBy(desc(contactEnquiries.createdAt));
}

export async function getAppointments() {
  return db.select().from(appointments).orderBy(asc(appointments.startsAt));
}

export async function getAvailabilityRules() {
  return db
    .select()
    .from(availabilityRules)
    .orderBy(asc(availabilityRules.weekday), asc(availabilityRules.startTime));
}

export async function getBlockedDates() {
  return db.select().from(blockedDates).orderBy(asc(blockedDates.startsAt));
}

export async function getSalesLeads() {
  return db.select().from(leads).orderBy(desc(leads.updatedAt));
}

export async function getSalesQuotes() {
  return db.select().from(salesQuotes).orderBy(desc(salesQuotes.updatedAt));
}

export async function getWebsiteDemos() {
  return db.select().from(websiteDemos).orderBy(desc(websiteDemos.updatedAt));
}

export async function getStudioSettings() {
  try {
    const [settings] = await db
      .select()
      .from(studioSettings)
      .where(eq(studioSettings.id, "default"))
      .limit(1);
    return settings ?? getFallbackStudioSettings();
  } catch {
    return getFallbackStudioSettings();
  }
}
