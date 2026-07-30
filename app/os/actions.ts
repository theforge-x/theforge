"use server";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAnyRole, requireRole } from "@/lib/auth-session";
import { db } from "@/lib/db";
import {
  osActivityLog,
  osDeals,
  osDiagnostics,
  osEngagements,
  osPodAssignments,
  osRolePermissions,
  osScopeLines,
  osSpecialists,
  osWorkspaceRoles,
} from "@/lib/db/schema";
import { featureFlags } from "@/lib/feature-flags";
import { osPodBench, osServiceModules } from "@/lib/theforge-os";

const WORKSPACE_ID = "theforge-internal";

const stageOrder = [
  "target",
  "contacted",
  "fit_conversation",
  "diagnostic",
  "proposal",
  "closed_won",
  "pod_finalized",
  "kickoff",
] as const;

type DealStage = (typeof stageOrder)[number];

export type OsConstraintPayload = {
  id: string;
  title: string;
  impact: number;
  urgency: number;
  evidence: string;
};

export type OsScopeLinePayload = {
  id: string;
  moduleId: string;
  moduleName: string;
  quantity: number;
  price: number;
  cost: number;
};

export type OsPodAssignmentPayload = {
  id: string;
  specialistId: string | null;
  memberName: string;
  role: string;
  capacity: number;
};

export type OsDealPayload = {
  id: string;
  engagementId: string;
  client: string;
  contact: string;
  owner: string;
  type: "new_business" | "renewal" | "expansion";
  source: string;
  value: number;
  stage: DealStage;
  nextStep: string;
  decisionMaker: string;
  sponsor: string;
  fitNotes: string;
  businessContext: string;
  desiredResult: string;
  currentSystems: string;
  budgetRange: string;
  timeline: string;
  dependencies: string;
  risks: string;
  successMeasures: string;
  acceptanceCriteria: string;
  sowGenerated: boolean;
  podCapacityChecked: boolean;
  projectCreated: boolean;
  lostReason: string;
  constraints: OsConstraintPayload[];
  scopeLines: OsScopeLinePayload[];
  podAssignments: OsPodAssignmentPayload[];
};

export type OsSpecialistPayload = {
  id: string;
  name: string;
  type: string;
  skills: string[];
  rate: string;
  availability: string;
  timezone: string;
  status: string;
};

export type OsAuditEventPayload = {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
};

export type OsWorkspacePayload = {
  workspaceId: string;
  deals: OsDealPayload[];
  specialists: OsSpecialistPayload[];
  audit: OsAuditEventPayload[];
};

type DealUpdate = Partial<
  Pick<
    OsDealPayload,
    | "client"
    | "contact"
    | "source"
    | "value"
    | "nextStep"
    | "decisionMaker"
    | "sponsor"
    | "fitNotes"
    | "businessContext"
    | "desiredResult"
    | "currentSystems"
    | "budgetRange"
    | "timeline"
    | "dependencies"
    | "risks"
    | "successMeasures"
    | "acceptanceCriteria"
  >
>;

function cents(value: number) {
  return Math.round(value * 100);
}

function dollars(value: number) {
  return Math.round(value / 100);
}

function constraintsFromJson(value: unknown): OsConstraintPayload[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        id: String(record.id ?? crypto.randomUUID()),
        title: String(record.title ?? ""),
        impact: Number(record.impact ?? 0),
        urgency: Number(record.urgency ?? 0),
        evidence: String(record.evidence ?? ""),
      };
    })
    .filter((item): item is OsConstraintPayload => Boolean(item?.title));
}

function stringsFromJson(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function nextStage(stage: DealStage): DealStage {
  return (
    stageOrder[
      Math.min(stageOrder.indexOf(stage) + 1, stageOrder.length - 1)
    ] ?? stage
  );
}

function engagementStatusForStage(stage: string) {
  if (stage === "kickoff") return "forging";
  if (stage === "pod_finalized" || stage === "closed_won") return "pod_ready";
  if (stage === "proposal") return "scoped";
  if (stage === "diagnostic") return "diagnosed";
  return "unassessed";
}

function gateStatus(deal: OsDealPayload) {
  const missing: string[] = [];
  if (deal.stage === "target") {
    if (!deal.contact) missing.push("contact");
    if (!deal.source) missing.push("source");
  }
  if (deal.stage === "contacted") {
    if (!deal.nextStep) missing.push("next step");
    if (!deal.decisionMaker) missing.push("decision-maker");
  }
  if (deal.stage === "fit_conversation") {
    if (!deal.sponsor) missing.push("sponsor");
    if (!deal.fitNotes) missing.push("fit notes");
  }
  if (deal.stage === "diagnostic") {
    if (!deal.budgetRange) missing.push("budget range");
    if (!deal.timeline) missing.push("timeline");
    if (!deal.constraints.length) missing.push("Constraint Map");
    if (!deal.successMeasures) missing.push("success measures");
  }
  if (deal.stage === "proposal") {
    if (!deal.scopeLines.length) missing.push("scope lines");
    if (!deal.sowGenerated) missing.push("SOW");
    if (!deal.podCapacityChecked) missing.push("capacity check");
  }
  if (deal.stage === "closed_won") {
    if (!deal.podAssignments.length) missing.push("pod assignments");
    if (deal.podAssignments.length < 2) missing.push("required pod depth");
  }
  return { clear: missing.length === 0, missing };
}

async function authorize() {
  return featureFlags.forgeOsAdminOnly
    ? requireRole("admin")
    : requireAnyRole(["admin", "sales"]);
}

async function logActivity(input: {
  actorId?: string;
  actorName?: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  targetLabel?: string;
  detail?: string;
  before?: unknown;
  after?: unknown;
}) {
  await db.insert(osActivityLog).values({
    workspaceId: WORKSPACE_ID,
    actorId: input.actorId,
    actorName: input.actorName ?? "System",
    action: input.action,
    targetEntity: input.targetEntity,
    targetId: input.targetId ?? "",
    targetLabel: input.targetLabel ?? "",
    detail: input.detail ?? "",
    before: input.before ?? {},
    after: input.after ?? {},
  });
}

async function seedOsWorkspace() {
  const [existing] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(osEngagements)
    .where(eq(osEngagements.workspaceId, WORKSPACE_ID));

  if ((existing?.value ?? 0) > 0) return;

  await db.transaction(async (tx) => {
    const roleIds = {
      admin: "os-role-admin",
      sales: "os-role-sales",
      deliveryLead: "os-role-delivery-lead",
      specialist: "os-role-specialist",
    };
    const specialistSeeds = osPodBench.map((member, index) => ({
      id: `os-specialist-${index + 1}`,
      member,
    }));

    await tx.insert(osWorkspaceRoles).values([
      {
        id: roleIds.admin,
        workspaceId: WORKSPACE_ID,
        name: "Admin",
        description: "Manages workspaces, roles, settings and auditability.",
      },
      {
        id: roleIds.sales,
        workspaceId: WORKSPACE_ID,
        name: "Sales",
        description: "Owns deals from target through proposal.",
      },
      {
        id: roleIds.deliveryLead,
        workspaceId: WORKSPACE_ID,
        name: "Delivery Lead",
        description: "Owns pod assembly, kickoff, delivery and margin control.",
      },
      {
        id: roleIds.specialist,
        workspaceId: WORKSPACE_ID,
        name: "Specialist",
        description: "Assigned-scope access for external contributors.",
      },
    ]);

    await tx.insert(osRolePermissions).values([
      {
        roleId: roleIds.admin,
        module: "settings",
        action: "manage",
        scope: "workspace",
      },
      {
        roleId: roleIds.admin,
        module: "activity",
        action: "view",
        scope: "workspace",
      },
      { roleId: roleIds.sales, module: "deals", action: "edit", scope: "own" },
      {
        roleId: roleIds.sales,
        module: "diagnostics",
        action: "edit",
        scope: "own",
      },
      {
        roleId: roleIds.deliveryLead,
        module: "pod",
        action: "manage",
        scope: "workspace",
      },
      {
        roleId: roleIds.deliveryLead,
        module: "finance",
        action: "view_margin",
        scope: "own",
      },
      {
        roleId: roleIds.specialist,
        module: "projects",
        action: "view",
        scope: "assigned",
      },
      {
        roleId: roleIds.specialist,
        module: "tasks",
        action: "edit",
        scope: "assigned",
      },
    ]);

    await tx.insert(osSpecialists).values(
      specialistSeeds.map(({ id, member }) => ({
        id,
        workspaceId: WORKSPACE_ID,
        name: member.name,
        type: member.type,
        skills: member.skills,
        rateCard: member.rate,
        availability: member.availability,
        timezone: member.timezone,
        contractOnFile: member.status !== "Needs contract",
        ndaOnFile: member.status !== "Needs contract",
        portfolioEvidence: "Portfolio evidence to be attached in Foundry.",
        performanceScorecard: { status: member.status },
        active: true,
      })),
    );

    await tx.insert(osEngagements).values([
      {
        id: "os-eng-onyx-intake",
        workspaceId: WORKSPACE_ID,
        clientName: "Onyx Legal Group",
        title: "Referral intake revenue system",
        status: "scoped",
        currentDealId: "os-deal-onyx-intake",
      },
      {
        id: "os-eng-ferrous-bid",
        workspaceId: WORKSPACE_ID,
        clientName: "Ferrous & Kin Construction",
        title: "Commercial bid pipeline system",
        status: "diagnosed",
        currentDealId: "os-deal-ferrous-bid",
      },
    ]);

    await tx.insert(osDeals).values([
      {
        id: "os-deal-onyx-intake",
        workspaceId: WORKSPACE_ID,
        engagementId: "os-eng-onyx-intake",
        ownerName: "John Christopher",
        clientName: "Onyx Legal Group",
        contactName: "Priya Nandakumar",
        type: "new_business",
        source: "Referral",
        valueCents: cents(28_000),
        stage: "proposal",
        nextStep: "Review SOW with managing partner",
        decisionMaker: "Priya Nandakumar",
        sponsor: "Managing partner",
        fitNotes:
          "Strong fit: referral-led firm with intake leakage and no shared source visibility.",
        dependencies:
          "CRM access, partner source list, intake team availability",
        risks: "Partner adoption and source attribution discipline",
        acceptanceCriteria:
          "Referral source dashboard, triage workflow, partner view and handover SOP accepted.",
        sowGenerated: true,
        podCapacityChecked: true,
      },
      {
        id: "os-deal-ferrous-bid",
        workspaceId: WORKSPACE_ID,
        engagementId: "os-eng-ferrous-bid",
        ownerName: "John Christopher",
        clientName: "Ferrous & Kin Construction",
        contactName: "Mateo Salgado",
        type: "new_business",
        source: "Outbound",
        valueCents: cents(34_000),
        stage: "diagnostic",
        nextStep: "Complete bid/no-bid constraint evidence",
        decisionMaker: "Mateo Salgado",
        sponsor: "Owner",
        fitNotes:
          "Good fit: high-value commercial bids, seasonal channel dependence, estimating bottleneck.",
        dependencies: "Pipeline export, estimator interviews, bid history",
        risks: "Historical data quality",
      },
    ]);

    await tx.insert(osDiagnostics).values([
      {
        dealId: "os-deal-onyx-intake",
        businessContext:
          "Corporate legal firm with strong partner network and inconsistent intake visibility.",
        desiredResult:
          "Turn warm introductions into a measurable qualified-matter pipeline.",
        currentSystems: "Website, shared inbox, spreadsheet, partner notes",
        budgetRange: "$20K-$35K",
        timeline: "8 weeks",
        existingAccessAndDependencies:
          "CRM access, partner source list, intake team availability",
        successMeasures:
          "Qualified intake, first response time, attribution coverage",
        constraintMap: [
          {
            id: "os-constraint-onyx-1",
            title: "Warm introductions lose context before qualification",
            impact: 9,
            urgency: 8,
            evidence: "11 qualified introductions older than 14 days",
          },
          {
            id: "os-constraint-onyx-2",
            title: "Referral source attribution is incomplete",
            impact: 7,
            urgency: 7,
            evidence: "Only 41% of matters have usable source data",
          },
        ],
        completedAt: new Date(),
      },
      {
        dealId: "os-deal-ferrous-bid",
        businessContext:
          "Construction firm with uneven bid flow and weak channel visibility.",
        desiredResult:
          "Build a qualified bid pipeline and protect estimating capacity.",
        currentSystems: "Tender portals, email, spreadsheet, estimator notes",
        budgetRange: "$25K-$40K",
        timeline: "10 weeks",
        existingAccessAndDependencies:
          "Pipeline export, estimator interviews, bid history",
        successMeasures:
          "Qualified bid value, forecast variance, bid cycle time",
        constraintMap: [
          {
            id: "os-constraint-ferrous-1",
            title: "Estimating time is spent before commercial fit is clear",
            impact: 8,
            urgency: 9,
            evidence: "Bid/no-bid documented on 28% of recent opportunities",
          },
        ],
        completedAt: new Date(),
      },
    ]);

    await tx.insert(osScopeLines).values([
      {
        dealId: "os-deal-onyx-intake",
        moduleId: "revenue-operations",
        moduleName: "Revenue operations",
        quantity: 1,
        priceCents: cents(12_500),
        projectedCostCents: cents(4_800),
      },
      {
        dealId: "os-deal-onyx-intake",
        moduleId: "digital-products",
        moduleName: "Digital products",
        quantity: 1,
        priceCents: cents(15_500),
        projectedCostCents: cents(7_600),
      },
    ]);

    const lead = specialistSeeds.find(
      (item) => item.member.name === "Kelechi Egbuta",
    );
    await tx.insert(osPodAssignments).values({
      workspaceId: WORKSPACE_ID,
      engagementId: "os-eng-onyx-intake",
      dealId: "os-deal-onyx-intake",
      specialistId: lead?.id,
      memberName: "Kelechi Egbuta",
      role: "System architect",
      capacityPercent: 35,
      primaryAssignment: true,
      contractChecked: true,
      ndaChecked: true,
    });

    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorName: "System",
      action: "Workspace initialized",
      targetEntity: "workspace",
      targetId: WORKSPACE_ID,
      targetLabel: "theForge OS",
      detail:
        "Seeded role templates, module library, specialists and operating gates.",
    });
  });
}

export async function getOsWorkspaceData(): Promise<OsWorkspacePayload> {
  await seedOsWorkspace();

  const [deals, diagnostics, scopeLines, assignments, specialists, audit] =
    await Promise.all([
      db
        .select()
        .from(osDeals)
        .where(eq(osDeals.workspaceId, WORKSPACE_ID))
        .orderBy(asc(osDeals.createdAt)),
      db.select().from(osDiagnostics),
      db.select().from(osScopeLines),
      db
        .select()
        .from(osPodAssignments)
        .where(eq(osPodAssignments.workspaceId, WORKSPACE_ID)),
      db
        .select()
        .from(osSpecialists)
        .where(eq(osSpecialists.workspaceId, WORKSPACE_ID))
        .orderBy(asc(osSpecialists.name)),
      db
        .select()
        .from(osActivityLog)
        .where(eq(osActivityLog.workspaceId, WORKSPACE_ID))
        .orderBy(desc(osActivityLog.createdAt))
        .limit(25),
    ]);

  return {
    workspaceId: WORKSPACE_ID,
    deals: deals.map((deal) => {
      const diagnostic = diagnostics.find((item) => item.dealId === deal.id);
      return {
        id: deal.id,
        engagementId: deal.engagementId,
        client: deal.clientName,
        contact: deal.contactName,
        owner: deal.ownerName,
        type: deal.type,
        source: deal.source,
        value: dollars(deal.valueCents),
        stage: deal.stage === "closed_lost" ? "target" : deal.stage,
        nextStep: deal.nextStep,
        decisionMaker: deal.decisionMaker,
        sponsor: deal.sponsor,
        fitNotes: deal.fitNotes,
        businessContext: diagnostic?.businessContext ?? "",
        desiredResult: diagnostic?.desiredResult ?? "",
        currentSystems: diagnostic?.currentSystems ?? "",
        budgetRange: diagnostic?.budgetRange ?? "",
        timeline: diagnostic?.timeline ?? "",
        dependencies: deal.dependencies,
        risks: deal.risks,
        successMeasures: diagnostic?.successMeasures ?? "",
        acceptanceCriteria: deal.acceptanceCriteria,
        sowGenerated: deal.sowGenerated,
        podCapacityChecked: deal.podCapacityChecked,
        projectCreated: deal.projectCreated,
        lostReason: deal.lostReason,
        constraints: constraintsFromJson(diagnostic?.constraintMap),
        scopeLines: scopeLines
          .filter((line) => line.dealId === deal.id)
          .map((line) => ({
            id: line.id,
            moduleId: line.moduleId,
            moduleName: line.moduleName,
            quantity: line.quantity,
            price: dollars(line.priceCents),
            cost: dollars(line.projectedCostCents),
          })),
        podAssignments: assignments
          .filter((assignment) => assignment.dealId === deal.id)
          .map((assignment) => ({
            id: assignment.id,
            specialistId: assignment.specialistId,
            memberName: assignment.memberName,
            role: assignment.role,
            capacity: assignment.capacityPercent,
          })),
      };
    }),
    specialists: specialists.map((specialist) => ({
      id: specialist.id,
      name: specialist.name,
      type: specialist.type,
      skills: stringsFromJson(specialist.skills),
      rate: specialist.rateCard,
      availability: specialist.availability,
      timezone: specialist.timezone,
      status:
        specialist.contractOnFile && specialist.ndaOnFile
          ? "Ready"
          : "Needs contract",
    })),
    audit: audit.map((event) => ({
      id: event.id,
      time: event.createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actor: event.actorName,
      action: event.action,
      target: event.targetLabel || event.targetEntity,
      detail: event.detail,
    })),
  };
}

async function reload() {
  revalidatePath("/os");
  return getOsWorkspaceData();
}

export async function updateOsDeal(
  dealId: string,
  update: DealUpdate,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const [deal] = await db.select().from(osDeals).where(eq(osDeals.id, dealId));
  if (!deal) throw new Error("Deal not found.");

  await db.transaction(async (tx) => {
    await tx
      .update(osDeals)
      .set({
        clientName: update.client,
        contactName: update.contact,
        source: update.source,
        valueCents:
          typeof update.value === "number" ? cents(update.value) : undefined,
        nextStep: update.nextStep,
        decisionMaker: update.decisionMaker,
        sponsor: update.sponsor,
        fitNotes: update.fitNotes,
        dependencies: update.dependencies,
        risks: update.risks,
        acceptanceCriteria: update.acceptanceCriteria,
      })
      .where(
        and(eq(osDeals.id, dealId), eq(osDeals.workspaceId, WORKSPACE_ID)),
      );

    await tx
      .update(osDiagnostics)
      .set({
        businessContext: update.businessContext,
        desiredResult: update.desiredResult,
        currentSystems: update.currentSystems,
        budgetRange: update.budgetRange,
        timeline: update.timeline,
        existingAccessAndDependencies: update.dependencies,
        successMeasures: update.successMeasures,
      })
      .where(eq(osDiagnostics.dealId, dealId));

    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Deal updated",
      targetEntity: "deal",
      targetId: dealId,
      targetLabel: update.client ?? deal.clientName,
      detail: "Saved opportunity and diagnostic fields.",
      before: deal,
      after: update,
    });
  });

  return reload();
}

export async function advanceOsDeal(
  dealId: string,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const data = await getOsWorkspaceData();
  const deal = data.deals.find((item) => item.id === dealId);
  if (!deal) throw new Error("Deal not found.");

  const gate = gateStatus(deal);
  if (!gate.clear) {
    await logActivity({
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Stage advance blocked",
      targetEntity: "deal",
      targetId: deal.id,
      targetLabel: deal.client,
      detail: `Missing: ${gate.missing.join(", ")}`,
    });
    return reload();
  }

  const stage = nextStage(deal.stage);
  await db.transaction(async (tx) => {
    await tx
      .update(osDeals)
      .set({
        stage,
        projectCreated: stage === "kickoff" ? true : deal.projectCreated,
        stageEnteredAt: new Date(),
      })
      .where(eq(osDeals.id, deal.id));
    await tx
      .update(osEngagements)
      .set({ status: engagementStatusForStage(stage) })
      .where(eq(osEngagements.id, deal.engagementId));
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Stage advanced",
      targetEntity: "deal",
      targetId: deal.id,
      targetLabel: deal.client,
      detail: `${deal.stage} -> ${stage}`,
      before: { stage: deal.stage },
      after: { stage },
    });
  });

  return reload();
}

export async function addOsConstraint(
  dealId: string,
  constraint: Omit<OsConstraintPayload, "id">,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const [diagnostic] = await db
    .select()
    .from(osDiagnostics)
    .where(eq(osDiagnostics.dealId, dealId));
  if (!diagnostic) throw new Error("Diagnostic not found.");

  const nextMap = [
    ...constraintsFromJson(diagnostic.constraintMap),
    { id: crypto.randomUUID(), ...constraint },
  ].sort((a, b) => b.impact + b.urgency - (a.impact + a.urgency));

  await db.transaction(async (tx) => {
    await tx
      .update(osDiagnostics)
      .set({ constraintMap: nextMap, completedAt: new Date() })
      .where(eq(osDiagnostics.id, diagnostic.id));
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Constraint added",
      targetEntity: "diagnostic",
      targetId: diagnostic.id,
      targetLabel: dealId,
      detail: constraint.title,
      after: nextMap,
    });
  });

  return reload();
}

export async function addOsScopeLine(
  dealId: string,
  moduleId: string,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const module = osServiceModules.find((item) => item.id === moduleId);
  if (!module) throw new Error("Service module not found.");
  const economics: Record<string, { price: number; cost: number }> = {
    "digital-products": { price: 15_000, cost: 7_200 },
    "experience-brand": { price: 9_500, cost: 3_600 },
    "demand-growth": { price: 11_000, cost: 5_600 },
    "ai-automation": { price: 12_000, cost: 5_900 },
    "revenue-operations": { price: 12_500, cost: 4_800 },
    "platforms-advisory": { price: 8_500, cost: 3_800 },
  };
  const values = economics[moduleId] ?? { price: 10_000, cost: 5_000 };

  await db.transaction(async (tx) => {
    await tx.insert(osScopeLines).values({
      dealId,
      moduleId,
      moduleName: module.name,
      priceCents: cents(values.price),
      projectedCostCents: cents(values.cost),
      quantity: 1,
    });
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Scope line added",
      targetEntity: "deal",
      targetId: dealId,
      targetLabel: module.name,
      detail: "Added module to scope and margin model.",
    });
  });

  return reload();
}

export async function updateOsScopeLine(
  lineId: string,
  update: Partial<Pick<OsScopeLinePayload, "quantity" | "price" | "cost">>,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const [line] = await db
    .select()
    .from(osScopeLines)
    .where(eq(osScopeLines.id, lineId));
  if (!line) throw new Error("Scope line not found.");

  await db.transaction(async (tx) => {
    await tx
      .update(osScopeLines)
      .set({
        quantity: update.quantity,
        priceCents:
          typeof update.price === "number" ? cents(update.price) : undefined,
        projectedCostCents:
          typeof update.cost === "number" ? cents(update.cost) : undefined,
      })
      .where(eq(osScopeLines.id, lineId));
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Scope line updated",
      targetEntity: "scope_line",
      targetId: lineId,
      targetLabel: line.moduleName,
      detail: "Updated quantity, price or projected cost.",
      before: line,
      after: update,
    });
  });

  return reload();
}

export async function addOsPodAssignment(input: {
  dealId: string;
  engagementId: string;
  specialistId: string;
  role: string;
}): Promise<OsWorkspacePayload> {
  const session = await authorize();
  const [specialist] = await db
    .select()
    .from(osSpecialists)
    .where(eq(osSpecialists.id, input.specialistId));
  if (!specialist) throw new Error("Specialist not found.");

  await db.transaction(async (tx) => {
    await tx.insert(osPodAssignments).values({
      workspaceId: WORKSPACE_ID,
      engagementId: input.engagementId,
      dealId: input.dealId,
      specialistId: specialist.id,
      memberName: specialist.name,
      role: input.role || "Contributor",
      capacityPercent: 20,
      contractChecked: specialist.contractOnFile,
      ndaChecked: specialist.ndaOnFile,
    });
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Pod assignment added",
      targetEntity: "pod_assignment",
      targetId: input.dealId,
      targetLabel: specialist.name,
      detail: input.role || "Contributor",
    });
  });

  return reload();
}

export async function generateOsSow(
  dealId: string,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  await db.transaction(async (tx) => {
    await tx
      .update(osDeals)
      .set({ sowGenerated: true })
      .where(eq(osDeals.id, dealId));
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "SOW generated",
      targetEntity: "deal",
      targetId: dealId,
      targetLabel: dealId,
      detail: "Generated proposal package from diagnostic and scope lines.",
    });
  });
  return reload();
}

export async function runOsCapacityCheck(
  dealId: string,
): Promise<OsWorkspacePayload> {
  const session = await authorize();
  await db.transaction(async (tx) => {
    await tx
      .update(osDeals)
      .set({ podCapacityChecked: true })
      .where(eq(osDeals.id, dealId));
    await tx.insert(osActivityLog).values({
      workspaceId: WORKSPACE_ID,
      actorId: session.user.id,
      actorName: session.user.name,
      action: "Capacity checked",
      targetEntity: "deal",
      targetId: dealId,
      targetLabel: dealId,
      detail: "Provisional pod reviewed against scope and margin.",
    });
  });
  return reload();
}
