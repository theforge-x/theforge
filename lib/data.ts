export type ClientStatus = "active" | "onboarding" | "paused" | "churned";

export type Client = {
  id: string;
  name: string;
  contact: string;
  industry: string;
  plan: "Spark Audit" | "Forge Build" | "Temper Partner";
  status: ClientStatus;
  mrr: number;
  startDate: string;
  health: number; // 0-100
};

export const clients: Client[] = [
  {
    id: "c-onyx",
    name: "Onyx Legal Group",
    contact: "Priya Nandakumar",
    industry: "Legal Services",
    plan: "Temper Partner",
    status: "active",
    mrr: 4200,
    startDate: "2025-11-03",
    health: 92,
  },
  {
    id: "c-ferrous",
    name: "Ferrous & Kin Construction",
    contact: "Mateo Salgado",
    industry: "Contracting",
    plan: "Forge Build",
    status: "active",
    mrr: 2800,
    startDate: "2026-01-14",
    health: 78,
  },
  {
    id: "c-lumen",
    name: "Lumen Dental Collective",
    contact: "Grace Whitfield",
    industry: "Healthcare",
    plan: "Temper Partner",
    status: "active",
    mrr: 3600,
    startDate: "2025-08-22",
    health: 88,
  },
  {
    id: "c-brightwell",
    name: "Brightwell Realty Partners",
    contact: "Owen Casey",
    industry: "Real Estate",
    plan: "Forge Build",
    status: "onboarding",
    mrr: 0,
    startDate: "2026-07-01",
    health: 40,
  },
  {
    id: "c-north",
    name: "North Ridge Fitness",
    contact: "Dana Iwu",
    industry: "Fitness",
    plan: "Spark Audit",
    status: "paused",
    mrr: 0,
    startDate: "2026-03-10",
    health: 22,
  },
  {
    id: "c-marrow",
    name: "Marrow Coffee Roasters",
    contact: "Theo Lindqvist",
    industry: "Food & Beverage",
    plan: "Forge Build",
    status: "active",
    mrr: 2400,
    startDate: "2026-02-18",
    health: 81,
  },
  {
    id: "6fab7a09-a0ce-466a-81db-96d29791c23e",
    name: "Josren Fashion",
    contact: "Prince Joshua",
    industry: "Fashion",
    plan: "Spark Audit",
    status: "onboarding",
    mrr: 0,
    startDate: "2026-07-23",
    health: 40,
  },
  {
    id: "083126ea-aaa2-47a9-87e8-189e18079113",
    name: "Right Mind Homes",
    contact: "Samson Ocholi",
    industry: "Healthcare",
    plan: "Spark Audit",
    status: "onboarding",
    mrr: 0,
    startDate: "2026-07-23",
    health: 50,
  },
];

export type CaseStudy = {
  slug: string;
  projectId: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  featuredImage?: string | null;
  metric: { label: string; value: string };
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "onyx-legal-group",
    projectId: "p-1",
    title: "Q3 referral engine rebuild",
    client: "Onyx Legal Group",
    industry: "Legal Services",
    summary:
      "A single-partner referral pipeline was rebuilt into a four-channel intake system with a retention model for repeat corporate clients.",
    featuredImage: "/work/onyx-referral-dashboard.webp",
    metric: { label: "Qualified intake", value: "+164%" },
    tags: ["Acquisition", "Retention", "Pricing"],
  },
  {
    slug: "ferrous-kin-construction",
    projectId: "p-2",
    title: "Multi-channel bid pipeline",
    client: "Ferrous & Kin Construction",
    industry: "Contracting",
    summary:
      "Replaced a single lead-gen channel prone to seasonal collapse with a bid-and-referral engine, plus a repositioned commercial offer.",
    featuredImage: "/work/fabrica-bid-dashboard.webp",
    metric: { label: "Booked bids", value: "+118%" },
    tags: ["Acquisition", "Offer design"],
  },
  {
    slug: "lumen-dental-collective",
    projectId: "p-3",
    title: "Patient retention system v2",
    client: "Lumen Dental Collective",
    industry: "Healthcare",
    summary:
      "Fixed a leaky patient-retention system and layered a referral framework on top of a rebuilt local visibility engine.",
    featuredImage: "/work/lumen-retention-dashboard.webp",
    metric: { label: "12-month revenue", value: "+91%" },
    tags: ["Retention", "Referral system"],
  },
  {
    slug: "marrow-coffee-roasters",
    projectId: "p-5",
    title: "Wholesale growth system",
    client: "Marrow Coffee Roasters",
    industry: "Food & Beverage",
    summary:
      "Wholesale accounts were won by feel; we mapped a repeatable acquisition sequence and a margin-aware pricing structure.",
    featuredImage: "/work/marrow-wholesale-dashboard.webp",
    metric: { label: "Wholesale accounts", value: "+37 in 90 days" },
    tags: ["Acquisition", "Pricing"],
  },
];

export type Project = {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  phase: "Diagnose" | "Forge" | "Temper";
  progress: number;
  owner: string;
  dueDate: string;
};

export const projects: Project[] = [
  {
    id: "p-1",
    clientId: "c-onyx",
    clientName: "Onyx Legal Group",
    name: "Q3 referral engine rebuild",
    phase: "Temper",
    progress: 82,
    owner: "Priya N.",
    dueDate: "2026-08-14",
  },
  {
    id: "p-2",
    clientId: "c-ferrous",
    clientName: "Ferrous & Kin Construction",
    name: "Multi-channel bid pipeline",
    phase: "Forge",
    progress: 54,
    owner: "Mateo S.",
    dueDate: "2026-08-28",
  },
  {
    id: "p-3",
    clientId: "c-lumen",
    clientName: "Lumen Dental Collective",
    name: "Patient retention system v2",
    phase: "Temper",
    progress: 95,
    owner: "Grace W.",
    dueDate: "2026-07-30",
  },
  {
    id: "p-4",
    clientId: "c-brightwell",
    clientName: "Brightwell Realty Partners",
    name: "Growth audit",
    phase: "Diagnose",
    progress: 20,
    owner: "Owen C.",
    dueDate: "2026-08-05",
  },
  {
    id: "p-5",
    clientId: "c-marrow",
    clientName: "Marrow Coffee Roasters",
    name: "Wholesale acquisition build",
    phase: "Forge",
    progress: 61,
    owner: "Theo L.",
    dueDate: "2026-09-02",
  },
  {
    id: "p-josren-fashion",
    clientId: "6fab7a09-a0ce-466a-81db-96d29791c23e",
    clientName: "Josren Fashion",
    name: "Fashion commerce growth system",
    phase: "Forge",
    progress: 65,
    owner: "Prince Joshua",
    dueDate: "2026-09-30",
  },
  {
    id: "p-right-mind-homes",
    clientId: "083126ea-aaa2-47a9-87e8-189e18079113",
    clientName: "Right Mind Homes",
    name: "Enquiry and admissions growth system",
    phase: "Forge",
    progress: 60,
    owner: "Samson Ocholi",
    dueDate: "2026-10-15",
  },
];

export const monthlyRevenue = [
  { month: "Feb", mrr: 8200, addedRevenue: 41000 },
  { month: "Mar", mrr: 9600, addedRevenue: 58000 },
  { month: "Apr", mrr: 10400, addedRevenue: 62000 },
  { month: "May", mrr: 11800, addedRevenue: 74000 },
  { month: "Jun", mrr: 12600, addedRevenue: 89000 },
  { month: "Jul", mrr: 13000, addedRevenue: 97000 },
];

export const clientGrowth = [
  { month: "Feb", leads: 62, conversions: 11 },
  { month: "Mar", leads: 74, conversions: 15 },
  { month: "Apr", leads: 81, conversions: 19 },
  { month: "May", leads: 96, conversions: 24 },
  { month: "Jun", leads: 118, conversions: 31 },
  { month: "Jul", leads: 134, conversions: 38 },
];

export type Invoice = {
  id: string;
  clientId: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  issued: string;
  due: string;
};

export const invoices: Invoice[] = [
  {
    id: "INV-1042",
    clientId: "c-onyx",
    amount: 4200,
    status: "paid",
    issued: "2026-06-01",
    due: "2026-06-15",
  },
  {
    id: "INV-1043",
    clientId: "c-onyx",
    amount: 4200,
    status: "due",
    issued: "2026-07-01",
    due: "2026-07-15",
  },
  {
    id: "INV-1044",
    clientId: "c-lumen",
    amount: 3600,
    status: "paid",
    issued: "2026-07-01",
    due: "2026-07-15",
  },
  {
    id: "INV-1045",
    clientId: "c-ferrous",
    amount: 2800,
    status: "overdue",
    issued: "2026-06-01",
    due: "2026-06-20",
  },
];

export const reports = [
  {
    id: "r-1",
    clientId: "c-onyx",
    title: "Q2 growth audit — findings & roadmap",
    date: "2026-06-02",
    type: "Audit",
  },
  {
    id: "r-2",
    clientId: "c-onyx",
    title: "July channel performance review",
    date: "2026-07-05",
    type: "Performance",
  },
  {
    id: "r-3",
    clientId: "c-lumen",
    title: "Retention system — 90 day results",
    date: "2026-06-28",
    type: "Results",
  },
];

export const testimonials = [
  {
    quote:
      "The Forge didn't hand us a strategy deck. They rebuilt how clients find us, and the pipeline hasn't gone quiet since.",
    name: "Priya Nandakumar",
    role: "Managing Partner, Onyx Legal Group",
    metric: "+164% qualified intake",
  },
  {
    quote:
      "We'd hit the same ceiling for three years. Six weeks in, the bottleneck was gone — and it stayed gone.",
    name: "Mateo Salgado",
    role: "Owner, Ferrous & Kin Construction",
    metric: "+118% booked bids",
  },
  {
    quote:
      "Every recommendation came with the number attached. No guesswork, no vibes, just a system that compounds.",
    name: "Grace Whitfield",
    role: "Director, Lumen Dental Collective",
    metric: "+91% 12-month revenue",
  },
];

export const logos = [
  "Onyx Legal Group",
  "Ferrous & Kin",
  "Lumen Dental",
  "Brightwell Realty",
  "North Ridge Fitness",
  "Marrow Coffee",
  "Halden & Cole",
  "Wren Studio",
];
