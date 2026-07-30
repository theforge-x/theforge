import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role").default("client").notNull(),
    theme: text("theme").default("dark").notNull(),
    notifyReports: boolean("notify_reports").default(true).notNull(),
    notifyInvoices: boolean("notify_invoices").default(true).notNull(),
    notifyProjects: boolean("notify_projects").default(true).notNull(),
    notifyMonthly: boolean("notify_monthly").default(false).notNull(),
    banned: boolean("banned").default(false).notNull(),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("session_token_idx").on(table.token),
    index("session_user_id_idx").on(table.userId),
  ],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const clientStatus = pgEnum("client_status", [
  "active",
  "onboarding",
  "paused",
  "churned",
]);
export const projectPhase = pgEnum("project_phase", [
  "Diagnose",
  "Forge",
  "Temper",
]);
export const invoiceStatus = pgEnum("invoice_status", [
  "paid",
  "due",
  "overdue",
]);
export const paymentProvider = pgEnum("payment_provider", [
  "stripe",
  "paystack",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
]);
export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "qualified",
  "closed",
]);
export const appointmentStatus = pgEnum("appointment_status", [
  "pending",
  "approved",
  "cancelled",
]);
export const leadStatus = pgEnum("lead_status", [
  "new",
  "qualified",
  "proposal",
  "won",
  "lost",
]);
export const quoteStatus = pgEnum("quote_status", [
  "draft",
  "sent",
  "accepted",
  "declined",
]);
export const osEngagementStatus = pgEnum("os_engagement_status", [
  "unassessed",
  "diagnosed",
  "scoped",
  "pod_ready",
  "forging",
  "client_review",
  "tempering",
  "proven",
]);
export const osDealStage = pgEnum("os_deal_stage", [
  "target",
  "contacted",
  "fit_conversation",
  "diagnostic",
  "proposal",
  "closed_won",
  "closed_lost",
  "pod_finalized",
  "kickoff",
]);
export const osDealType = pgEnum("os_deal_type", [
  "new_business",
  "renewal",
  "expansion",
]);

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  industry: text("industry").notNull(),
  plan: text("plan").notNull(),
  status: clientStatus("status").default("onboarding").notNull(),
  mrrCents: integer("mrr_cents").default(0).notNull(),
  currency: text("currency").default("USD").notNull(),
  startDate: date("start_date").notNull(),
  health: integer("health").default(0).notNull(),
  ...timestamps,
});

export const clientMembers = pgTable(
  "client_members",
  {
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").default("Member").notNull(),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.clientId, table.userId] }),
    index("client_members_user_id_idx").on(table.userId),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phase: projectPhase("phase").notNull(),
    progress: integer("progress").default(0).notNull(),
    owner: text("owner").notNull(),
    dueDate: date("due_date").notNull(),
    ...timestamps,
  },
  (table) => [index("projects_client_id_idx").on(table.clientId)],
);

export const invoices = pgTable(
  "invoices",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").default("USD").notNull(),
    status: invoiceStatus("status").default("due").notNull(),
    issued: date("issued").notNull(),
    due: date("due").notNull(),
    ...timestamps,
  },
  (table) => [index("invoices_client_id_idx").on(table.clientId)],
);

export const reports = pgTable(
  "reports",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    reportDate: date("report_date").notNull(),
    type: text("type").notNull(),
    fileUrl: text("file_url"),
    ...timestamps,
  },
  (table) => [index("reports_client_id_idx").on(table.clientId)],
);

export const contentPosts = pgTable(
  "content_posts",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    kind: text("kind").default("article").notNull(),
    status: text("status").default("draft").notNull(),
    excerpt: text("excerpt").default("").notNull(),
    body: text("body").default("").notNull(),
    category: text("category").default("Strategy").notNull(),
    projectId: text("project_id").references(() => projects.id),
    featuredImage: text("featured_image"),
    seoTitle: text("seo_title").default("").notNull(),
    seoDescription: text("seo_description").default("").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("content_posts_slug_idx").on(table.slug),
    index("content_posts_project_id_idx").on(table.projectId),
    check(
      "case_study_requires_project",
      sql`${table.kind} <> 'case-study' OR ${table.projectId} IS NOT NULL`,
    ),
  ],
);

export const studioSettings = pgTable("studio_settings", {
  id: text("id").primaryKey().default("default"),
  studioName: text("studio_name").default("The Forge").notNull(),
  billingEmail: text("billing_email")
    .default("billing@theforge.studio")
    .notNull(),
  publicEmail: text("public_email").default("hello@theforge.ng").notNull(),
  phone: text("phone").default("+1 (888) 449-8124").notNull(),
  tagline: text("tagline").default("Growth, forged — not guessed.").notNull(),
  appointmentDuration: integer("appointment_duration").default(30).notNull(),
  notifyNewClient: boolean("notify_new_client").default(true).notNull(),
  notifyOverdueInvoice: boolean("notify_overdue_invoice")
    .default(true)
    .notNull(),
  notifyWeeklyDigest: boolean("notify_weekly_digest").default(false).notNull(),
  ...timestamps,
});

export const contactEnquiries = pgTable(
  "contact_enquiries",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    service: text("service"),
    budget: text("budget"),
    message: text("message").notNull(),
    status: enquiryStatus("status").default("new").notNull(),
    notes: text("notes").default("").notNull(),
    ...timestamps,
  },
  (table) => [index("contact_enquiries_status_idx").on(table.status)],
);

export const appointments = pgTable(
  "appointments",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    notes: text("notes").default("").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").default(30).notNull(),
    status: appointmentStatus("status").default("pending").notNull(),
    meetingProvider: text("meeting_provider").default("zoom").notNull(),
    meetingUrl: text("meeting_url"),
    providerMeetingId: text("provider_meeting_id"),
    ...timestamps,
  },
  (table) => [
    index("appointments_starts_at_idx").on(table.startsAt),
    uniqueIndex("appointments_active_slot_idx")
      .on(table.startsAt)
      .where(sql`${table.status} <> 'cancelled'`),
  ],
);

export const availabilityRules = pgTable(
  "availability_rules",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    weekday: integer("weekday").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    timezone: text("timezone").default("Africa/Lagos").notNull(),
    slotInterval: integer("slot_interval").default(30).notNull(),
    active: boolean("active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [index("availability_rules_weekday_idx").on(table.weekday)],
);

export const blockedDates = pgTable(
  "blocked_dates",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    reason: text("reason").default("").notNull(),
    ...timestamps,
  },
  (table) => [index("blocked_dates_starts_at_idx").on(table.startsAt)],
);

export const leads = pgTable(
  "sales_leads",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company").notNull(),
    phone: text("phone"),
    status: leadStatus("status").default("new").notNull(),
    source: text("source").default("quote-builder").notNull(),
    notes: text("notes").default("").notNull(),
    ...timestamps,
  },
  (table) => [index("sales_leads_owner_idx").on(table.ownerId)],
);

export const salesQuotes = pgTable(
  "sales_quotes",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    leadId: text("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    quoteNumber: text("quote_number").notNull(),
    title: text("title").notNull(),
    status: quoteStatus("status").default("draft").notNull(),
    currency: text("currency").default("USD").notNull(),
    items: jsonb("items").notNull(),
    discovery: jsonb("discovery").default(sql`'{}'::jsonb`).notNull(),
    discountPercent: integer("discount_percent").default(0).notNull(),
    depositPercent: integer("deposit_percent").default(50).notNull(),
    estimatedTimeline: text("estimated_timeline")
      .default("4–6 weeks")
      .notNull(),
    paymentTerms: text("payment_terms")
      .default("50% upfront, 50% on delivery")
      .notNull(),
    notes: text("notes").default("").notNull(),
    validUntil: date("valid_until").notNull(),
    shareToken: text("share_token").notNull(),
    trainingMode: boolean("training_mode").default(false).notNull(),
    scenario: text("scenario"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("sales_quotes_number_idx").on(table.quoteNumber),
    uniqueIndex("sales_quotes_share_token_idx").on(table.shareToken),
    index("sales_quotes_owner_idx").on(table.ownerId),
  ],
);

export const websiteDemos = pgTable(
  "website_demos",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    leadId: text("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    prospectName: text("prospect_name").notNull(),
    template: text("template").default("launch").notNull(),
    status: text("status").default("draft").notNull(),
    shareToken: text("share_token").notNull(),
    brand: jsonb("brand").notNull(),
    blocks: jsonb("blocks").notNull(),
    reusable: boolean("reusable").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("website_demos_share_token_idx").on(table.shareToken),
    index("website_demos_owner_idx").on(table.ownerId),
  ],
);

export const monthlyMetrics = pgTable(
  "monthly_metrics",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    clientId: text("client_id").references(() => clients.id, {
      onDelete: "cascade",
    }),
    month: date("month").notNull(),
    mrrCents: integer("mrr_cents").default(0).notNull(),
    addedRevenueCents: integer("added_revenue_cents").default(0).notNull(),
    leads: integer("leads").default(0).notNull(),
    conversions: integer("conversions").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("monthly_metrics_client_month_idx").on(
      table.clientId,
      table.month,
    ),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    provider: paymentProvider("provider").notNull(),
    providerReference: text("provider_reference").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(),
    status: paymentStatus("status").default("pending").notNull(),
    checkoutUrl: text("checkout_url"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    providerPayload: jsonb("provider_payload"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("payments_provider_reference_idx").on(
      table.provider,
      table.providerReference,
    ),
    index("payments_invoice_id_idx").on(table.invoiceId),
  ],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    provider: paymentProvider("provider").notNull(),
    eventId: text("event_id").notNull(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_idx").on(
      table.provider,
      table.eventId,
    ),
  ],
);

export const osWorkspaceRoles = pgTable(
  "os_workspace_roles",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    name: text("name").notNull(),
    description: text("description").default("").notNull(),
    active: boolean("active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("os_workspace_roles_workspace_name_idx").on(
      table.workspaceId,
      table.name,
    ),
    index("os_workspace_roles_workspace_idx").on(table.workspaceId),
  ],
);

export const osRolePermissions = pgTable(
  "os_role_permissions",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    roleId: text("role_id")
      .notNull()
      .references(() => osWorkspaceRoles.id, { onDelete: "cascade" }),
    module: text("module").notNull(),
    action: text("action").notNull(),
    scope: text("scope").default("none").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("os_role_permissions_role_rule_idx").on(
      table.roleId,
      table.module,
      table.action,
    ),
    index("os_role_permissions_role_idx").on(table.roleId),
  ],
);

export const osEngagements = pgTable(
  "os_engagements",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    clientName: text("client_name").notNull(),
    title: text("title").notNull(),
    status: osEngagementStatus("status").default("unassessed").notNull(),
    currentDealId: text("current_deal_id"),
    currentProjectId: text("current_project_id"),
    ...timestamps,
  },
  (table) => [
    index("os_engagements_workspace_idx").on(table.workspaceId),
    index("os_engagements_status_idx").on(table.status),
  ],
);

export const osDeals = pgTable(
  "os_deals",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    engagementId: text("engagement_id")
      .notNull()
      .references(() => osEngagements.id, { onDelete: "cascade" }),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ownerName: text("owner_name").default("Sales").notNull(),
    clientName: text("client_name").notNull(),
    contactName: text("contact_name").default("").notNull(),
    type: osDealType("type").default("new_business").notNull(),
    source: text("source").default("").notNull(),
    valueCents: integer("value_cents").default(0).notNull(),
    stage: osDealStage("stage").default("target").notNull(),
    nextStep: text("next_step").default("").notNull(),
    decisionMaker: text("decision_maker").default("").notNull(),
    sponsor: text("sponsor").default("").notNull(),
    fitNotes: text("fit_notes").default("").notNull(),
    dependencies: text("dependencies").default("").notNull(),
    risks: text("risks").default("").notNull(),
    acceptanceCriteria: text("acceptance_criteria").default("").notNull(),
    sowGenerated: boolean("sow_generated").default(false).notNull(),
    podCapacityChecked: boolean("pod_capacity_checked")
      .default(false)
      .notNull(),
    projectCreated: boolean("project_created").default(false).notNull(),
    lostReason: text("lost_reason").default("").notNull(),
    stageEnteredAt: timestamp("stage_entered_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index("os_deals_workspace_idx").on(table.workspaceId),
    index("os_deals_engagement_idx").on(table.engagementId),
    index("os_deals_owner_idx").on(table.ownerId),
    index("os_deals_stage_idx").on(table.stage),
  ],
);

export const osDiagnostics = pgTable(
  "os_diagnostics",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    dealId: text("deal_id")
      .notNull()
      .references(() => osDeals.id, { onDelete: "cascade" }),
    businessContext: text("business_context").default("").notNull(),
    desiredResult: text("desired_result").default("").notNull(),
    currentSystems: text("current_systems").default("").notNull(),
    knownConstraints: text("known_constraints").default("").notNull(),
    budgetRange: text("budget_range").default("").notNull(),
    timeline: text("timeline").default("").notNull(),
    decisionMakers: text("decision_makers").default("").notNull(),
    existingAccessAndDependencies: text("existing_access_and_dependencies")
      .default("")
      .notNull(),
    successMeasures: text("success_measures").default("").notNull(),
    constraintMap: jsonb("constraint_map").default(sql`'[]'::jsonb`).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("os_diagnostics_deal_idx").on(table.dealId),
    index("os_diagnostics_completed_idx").on(table.completedAt),
  ],
);

export const osScopeLines = pgTable(
  "os_scope_lines",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    dealId: text("deal_id")
      .notNull()
      .references(() => osDeals.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    moduleName: text("module_name").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    priceCents: integer("price_cents").default(0).notNull(),
    projectedCostCents: integer("projected_cost_cents").default(0).notNull(),
    notes: text("notes").default("").notNull(),
    ...timestamps,
  },
  (table) => [index("os_scope_lines_deal_idx").on(table.dealId)],
);

export const osSpecialists = pgTable(
  "os_specialists",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    linkedUserId: text("linked_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    type: text("type").default("specialist").notNull(),
    skills: jsonb("skills").default(sql`'[]'::jsonb`).notNull(),
    rateCard: text("rate_card").default("").notNull(),
    availability: text("availability").default("").notNull(),
    location: text("location").default("").notNull(),
    timezone: text("timezone").default("Africa/Lagos").notNull(),
    contractOnFile: boolean("contract_on_file").default(false).notNull(),
    ndaOnFile: boolean("nda_on_file").default(false).notNull(),
    portfolioEvidence: text("portfolio_evidence").default("").notNull(),
    performanceScorecard: jsonb("performance_scorecard")
      .default(sql`'{}'::jsonb`)
      .notNull(),
    partnerOrganization: text("partner_organization").default("").notNull(),
    active: boolean("active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    index("os_specialists_workspace_idx").on(table.workspaceId),
    index("os_specialists_linked_user_idx").on(table.linkedUserId),
  ],
);

export const osPodAssignments = pgTable(
  "os_pod_assignments",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    engagementId: text("engagement_id")
      .notNull()
      .references(() => osEngagements.id, { onDelete: "cascade" }),
    dealId: text("deal_id").references(() => osDeals.id, {
      onDelete: "cascade",
    }),
    specialistId: text("specialist_id").references(() => osSpecialists.id, {
      onDelete: "set null",
    }),
    internalUserId: text("internal_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    memberName: text("member_name").notNull(),
    role: text("role").notNull(),
    capacityPercent: integer("capacity_percent").default(20).notNull(),
    primaryAssignment: boolean("primary_assignment").default(false).notNull(),
    backupAssignment: boolean("backup_assignment").default(false).notNull(),
    contractChecked: boolean("contract_checked").default(false).notNull(),
    ndaChecked: boolean("nda_checked").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index("os_pod_assignments_workspace_idx").on(table.workspaceId),
    index("os_pod_assignments_engagement_idx").on(table.engagementId),
    index("os_pod_assignments_deal_idx").on(table.dealId),
  ],
);

export const osHandoffRecords = pgTable(
  "os_handoff_records",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    engagementId: text("engagement_id")
      .notNull()
      .references(() => osEngagements.id, { onDelete: "cascade" }),
    checklistCompletedAt: timestamp("checklist_completed_at", {
      withTimezone: true,
    }),
    clientSignoffBy: text("client_signoff_by").default("").notNull(),
    clientSignoffAt: timestamp("client_signoff_at", { withTimezone: true }),
    systemsInventory: jsonb("systems_inventory")
      .default(sql`'[]'::jsonb`)
      .notNull(),
    stabilizationEndsAt: timestamp("stabilization_ends_at", {
      withTimezone: true,
    }),
    ...timestamps,
  },
  (table) => [
    index("os_handoff_records_engagement_idx").on(table.engagementId),
  ],
);

export const osEvidence = pgTable(
  "os_evidence",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    engagementId: text("engagement_id")
      .notNull()
      .references(() => osEngagements.id, { onDelete: "cascade" }),
    baselineMetrics: jsonb("baseline_metrics")
      .default(sql`'{}'::jsonb`)
      .notNull(),
    targetMetrics: jsonb("target_metrics").default(sql`'{}'::jsonb`).notNull(),
    resultMetrics: jsonb("result_metrics").default(sql`'{}'::jsonb`).notNull(),
    measurementPeriod: text("measurement_period").default("").notNull(),
    testimonial: text("testimonial").default("").notNull(),
    caseStudyExport: text("case_study_export").default("").notNull(),
    referralLogged: boolean("referral_logged").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("os_evidence_engagement_idx").on(table.engagementId)],
);

export const osActivityLog = pgTable(
  "os_activity_log",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    workspaceId: text("workspace_id").default("theforge-internal").notNull(),
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    actorName: text("actor_name").default("System").notNull(),
    action: text("action").notNull(),
    targetEntity: text("target_entity").notNull(),
    targetId: text("target_id").default("").notNull(),
    targetLabel: text("target_label").default("").notNull(),
    detail: text("detail").default("").notNull(),
    before: jsonb("before").default(sql`'{}'::jsonb`).notNull(),
    after: jsonb("after").default(sql`'{}'::jsonb`).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("os_activity_log_workspace_idx").on(table.workspaceId),
    index("os_activity_log_actor_idx").on(table.actorId),
    index("os_activity_log_target_idx").on(table.targetEntity, table.targetId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  memberships: many(clientMembers),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const clientRelations = relations(clients, ({ many }) => ({
  members: many(clientMembers),
  projects: many(projects),
  invoices: many(invoices),
  reports: many(reports),
  metrics: many(monthlyMetrics),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  caseStudies: many(contentPosts),
}));

export const contentPostRelations = relations(contentPosts, ({ one }) => ({
  project: one(projects, {
    fields: [contentPosts.projectId],
    references: [projects.id],
  }),
}));

export const clientMemberRelations = relations(clientMembers, ({ one }) => ({
  client: one(clients, {
    fields: [clientMembers.clientId],
    references: [clients.id],
  }),
  user: one(user, { fields: [clientMembers.userId], references: [user.id] }),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  payments: many(payments),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  clients,
  clientMembers,
  projects,
  invoices,
  reports,
  contentPosts,
  studioSettings,
  contactEnquiries,
  appointments,
  availabilityRules,
  blockedDates,
  leads,
  salesQuotes,
  websiteDemos,
  monthlyMetrics,
  payments,
  webhookEvents,
  osWorkspaceRoles,
  osRolePermissions,
  osEngagements,
  osDeals,
  osDiagnostics,
  osScopeLines,
  osSpecialists,
  osPodAssignments,
  osHandoffRecords,
  osEvidence,
  osActivityLog,
  userRelations,
  sessionRelations,
  accountRelations,
  clientRelations,
  clientMemberRelations,
  projectRelations,
  contentPostRelations,
  invoiceRelations,
  paymentRelations,
};
