import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  FileCheck2,
  Gauge,
  Megaphone,
  Palette,
  Settings2,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";
import type { ComponentType } from "react";

export type OsTone = "brand" | "success" | "warning" | "danger" | "muted";

export type OsStage = {
  id: string;
  plain: string;
  area: string;
  brand: string;
  status: string;
  owner: string;
  gate: string;
  exitCriteria: string[];
  records: number;
  blocked: number;
};

export type OsServiceModule = {
  id: string;
  name: string;
  category: string;
  icon: ComponentType<{ className?: string }>;
  requiredRoles: string[];
  duration: string;
  effort: string;
  deliverables: string[];
  marginBand: string;
};

export type OsPodMember = {
  name: string;
  type: "Internal" | "Specialist" | "Partner";
  skills: string[];
  timezone: string;
  rate: string;
  availability: string;
  status: string;
};

export type OsScorecardMetric = {
  category: string;
  metric: string;
  value: string;
  signal: string;
  tone: OsTone;
};

export const osStages: OsStage[] = [
  {
    id: "target",
    plain: "Target",
    area: "Diagnose",
    brand: "Ore",
    status: "Unassessed",
    owner: "Sales",
    gate: "Contact identified and source logged",
    exitCriteria: ["Client/contact", "Owner", "Type", "Source"],
    records: 7,
    blocked: 1,
  },
  {
    id: "fit",
    plain: "Contacted -> Fit conversation",
    area: "Diagnose",
    brand: "Ore",
    status: "Unassessed -> Diagnosed",
    owner: "Sales",
    gate: "Decision-maker, sponsor and fit notes confirmed",
    exitCriteria: ["Next step", "Decision-maker", "Sponsor", "Fit notes"],
    records: 5,
    blocked: 2,
  },
  {
    id: "diagnostic",
    plain: "Diagnostic",
    area: "Diagnose",
    brand: "Ore",
    status: "Diagnosed",
    owner: "Sales",
    gate: "Constraint Map completed with evidence",
    exitCriteria: [
      "Business context",
      "Current systems",
      "Budget/timeline",
      "Ranked constraints",
    ],
    records: 3,
    blocked: 0,
  },
  {
    id: "proposal",
    plain: "Proposal",
    area: "Scope",
    brand: "Blueprint",
    status: "Scoped",
    owner: "Sales + Finance",
    gate: "SOW generated, margin safe, provisional pod checked",
    exitCriteria: ["Scope lines", "Price/cost/margin", "SOW", "Pod check"],
    records: 4,
    blocked: 1,
  },
  {
    id: "foundry",
    plain: "Pod finalized",
    area: "Staff",
    brand: "Foundry",
    status: "Pod ready",
    owner: "Delivery Lead",
    gate: "Every required role staffed with no cost/capacity conflict",
    exitCriteria: ["Assignments", "Availability", "Contracts", "Backups"],
    records: 2,
    blocked: 1,
  },
  {
    id: "delivery",
    plain: "Kickoff -> Delivery",
    area: "Deliver",
    brand: "Forge",
    status: "Forging -> Client review",
    owner: "Delivery Lead",
    gate: "Definition of done, baseline metrics and approvals controlled",
    exitCriteria: ["DoD", "Baselines", "Tasks", "Internal approvals"],
    records: 6,
    blocked: 1,
  },
  {
    id: "handoff",
    plain: "Handoff -> Stabilization",
    area: "Improve",
    brand: "Temper",
    status: "Tempering",
    owner: "Delivery Lead -> Account Manager",
    gate: "Signed handoff record and systems inventory snapshot",
    exitCriteria: [
      "Checklist",
      "Sign-off",
      "Systems inventory",
      "Stabilization end",
    ],
    records: 3,
    blocked: 0,
  },
  {
    id: "prove",
    plain: "Outcome capture",
    area: "Prove",
    brand: "Compound",
    status: "Proven",
    owner: "Account Manager",
    gate: "Baseline, target and result metrics complete enough for evidence",
    exitCriteria: [
      "Results",
      "Measurement period",
      "Case-study export",
      "Referral/testimonial",
    ],
    records: 4,
    blocked: 1,
  },
];

export const osServiceModules: OsServiceModule[] = [
  {
    id: "digital-products",
    name: "Digital products",
    category: "Forge Build module",
    icon: Code2,
    requiredRoles: ["Product engineer", "UX designer", "QA"],
    duration: "2-6 weeks",
    effort: "60-180 hrs",
    marginBand: "52-68%",
    deliverables: ["Website or portal", "Integration map", "Analytics events"],
  },
  {
    id: "experience-brand",
    name: "Experience & brand",
    category: "Forge Build module",
    icon: Palette,
    requiredRoles: ["Strategist", "Designer", "Copy lead"],
    duration: "1-4 weeks",
    effort: "35-120 hrs",
    marginBand: "58-72%",
    deliverables: ["Positioning", "Messaging system", "Conversion experience"],
  },
  {
    id: "demand-growth",
    name: "Demand & growth",
    category: "Forge Build module",
    icon: Megaphone,
    requiredRoles: ["Growth lead", "Content lead", "Analyst"],
    duration: "2-8 weeks",
    effort: "50-160 hrs",
    marginBand: "48-64%",
    deliverables: ["Channel plan", "Campaign assets", "Pipeline attribution"],
  },
  {
    id: "ai-automation",
    name: "AI & automation",
    category: "Forge Build module",
    icon: Bot,
    requiredRoles: ["Automation engineer", "Ops lead", "Reviewer"],
    duration: "1-5 weeks",
    effort: "40-140 hrs",
    marginBand: "50-66%",
    deliverables: ["Routing rules", "Human review paths", "Workflow assists"],
  },
  {
    id: "revenue-operations",
    name: "Revenue operations",
    category: "Forge Build module",
    icon: Settings2,
    requiredRoles: ["RevOps lead", "CRM admin", "Analyst"],
    duration: "2-6 weeks",
    effort: "60-180 hrs",
    marginBand: "55-70%",
    deliverables: ["CRM stages", "Dashboards", "SOPs and handover"],
  },
  {
    id: "platforms-advisory",
    name: "Platforms & advisory",
    category: "Forge Build module",
    icon: Cloud,
    requiredRoles: ["Technical architect", "Engineer", "Security reviewer"],
    duration: "1-6 weeks",
    effort: "30-160 hrs",
    marginBand: "50-65%",
    deliverables: [
      "Architecture decision",
      "Platform setup",
      "Access registry",
    ],
  },
];

export const osPodBench: OsPodMember[] = [
  {
    name: "Kelechi Egbuta",
    type: "Internal",
    skills: ["Diagnostic", "Architecture", "Commercial scope"],
    timezone: "Africa/Lagos",
    rate: "Internal",
    availability: "60%",
    status: "Primary",
  },
  {
    name: "Marvelous Miracle",
    type: "Internal",
    skills: ["Experience", "Brand", "Conversion"],
    timezone: "Africa/Lagos",
    rate: "Internal",
    availability: "45%",
    status: "Primary",
  },
  {
    name: "CRM implementation partner",
    type: "Partner",
    skills: ["CRM", "Automation", "Reporting"],
    timezone: "Europe/London",
    rate: "$95/hr",
    availability: "30 hrs/wk",
    status: "Contract on file",
  },
  {
    name: "Senior product engineer",
    type: "Specialist",
    skills: ["Next.js", "Integrations", "QA"],
    timezone: "Europe/London",
    rate: "$80/hr",
    availability: "20 hrs/wk",
    status: "NDA on file",
  },
  {
    name: "Growth analytics specialist",
    type: "Specialist",
    skills: ["Attribution", "Dashboards", "Experiment design"],
    timezone: "America/New_York",
    rate: "$70/hr",
    availability: "12 hrs/wk",
    status: "Backup",
  },
];

export const osScorecard: OsScorecardMetric[] = [
  {
    category: "Pipeline",
    metric: "Weighted pipeline",
    value: "$184K",
    signal: "4 proposals, 1 stalled",
    tone: "brand",
  },
  {
    category: "Delivery",
    metric: "On-time projects",
    value: "83%",
    signal: "1 project needs mitigation",
    tone: "warning",
  },
  {
    category: "Capacity",
    metric: "Pod utilization",
    value: "71%",
    signal: "2 capacity conflicts",
    tone: "warning",
  },
  {
    category: "Client health",
    metric: "At-risk accounts",
    value: "2",
    signal: "No contact in 30+ days",
    tone: "danger",
  },
  {
    category: "Margin",
    metric: "Blended margin",
    value: "61%",
    signal: "1 scope creep flag",
    tone: "success",
  },
  {
    category: "Risk",
    metric: "Open escalations",
    value: "3",
    signal: "Friday review required",
    tone: "warning",
  },
];

export const osPrinciples = [
  {
    icon: Users,
    title: "One accountable owner",
    body: "Every client, deal and project has exactly one named owner at a time. Reassignment is explicit and logged.",
  },
  {
    icon: CheckCircle2,
    title: "Stages have exit criteria",
    body: "Advancing without required fields, artifacts or approvals is blocked or flagged, never silent.",
  },
  {
    icon: FileCheck2,
    title: "Handoff is a deliverable",
    body: "Delivery closes with a signed artifact, client-owned systems inventory and stabilization window.",
  },
  {
    icon: ShieldCheck,
    title: "Access follows role",
    body: "Permissions are workspace-scoped, auditable and granted by role or assigned pod membership.",
  },
];

export const osAutomations = [
  "Stalled proposal reminder",
  "Forecast cost threshold flag",
  "Overdue client approval reminder",
  "Specialist offboarding access review",
  "Post-completion review, testimonial and case-study workflow",
];

export const osTraceability = [
  [
    "Growth constraint",
    "Diagnostic.constraint_map",
    "Impact, urgency, evidence",
    "A4",
  ],
  ["Approved scope", "ScopeLine", "Price, cost, margin, approvals", "A5"],
  ["Delivery pod", "PodAssignment", "Roles, availability, cost, backups", "B1"],
  ["Quality gate", "Approval", "Reviewer, criteria, result", "C3"],
  [
    "Handoff artifact",
    "HandoffRecord",
    "Checklist, sign-off, systems snapshot",
    "C4",
  ],
  [
    "Access grant",
    "ClientSystem",
    "Level, review date, MFA, offboarding notes",
    "F3",
  ],
  ["Outcome proof", "Evidence", "Baseline, target, result, case study", "E1"],
];

export const osActivationSteps = [
  { label: "Workspace created", icon: BriefcaseBusiness },
  { label: "Service module added", icon: ClipboardCheck },
  { label: "Diagnostic completed", icon: Gauge },
  { label: "Scope produced", icon: Waypoints },
  { label: "Specialist added", icon: Users },
  { label: "Pod created", icon: Settings2 },
  { label: "Engagement launched", icon: CheckCircle2 },
];
