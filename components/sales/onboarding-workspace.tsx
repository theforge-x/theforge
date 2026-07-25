"use client";

import {
  Award,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSignature,
  Library,
  Lock,
  type LucideIcon,
  MessageSquareText,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theforge-sales-certification-v1";

const legalDocuments = [
  "Independent Contractor Agreement",
  "NDA",
  "Confidentiality Agreement",
  "Non-solicitation Agreement",
  "Data Protection Policy",
  "Commission Policy",
  "Payment Terms",
  "Code of Ethics",
  "Anti-Bribery Policy",
  "Conflict of Interest Policy",
];

const phases = [
  {
    id: "welcome",
    title: "Welcome",
    description:
      "theForge story, mission, values, conduct, compensation, and performance expectations.",
    lessons: ["Studio philosophy", "Culture and standards", "Career path"],
    score: 92,
  },
  {
    id: "compliance",
    title: "Legal & compliance",
    description:
      "Digitally sign required documents before client-facing training opens.",
    lessons: ["Contracting basics", "Ethics", "Data protection"],
    score: 100,
  },
  {
    id: "product",
    title: "Product mastery",
    description:
      "Understand each service unit, business impact, delivery model, pricing, and fit.",
    lessons: ["Service architecture", "Unit economics", "Bundles"],
    score: 88,
  },
  {
    id: "sales",
    title: "Consultative selling",
    description:
      "Discovery, qualification, value selling, objection handling, negotiation, and closing.",
    lessons: ["Discovery", "MEDDICC + SPIN", "Closing"],
    score: 86,
  },
  {
    id: "simulation",
    title: "Practical simulations",
    description:
      "Role-play buyer scenarios across SMEs and enterprise industries.",
    lessons: ["Healthcare buyer", "SaaS buyer", "Manufacturing buyer"],
    score: 84,
  },
  {
    id: "certification",
    title: "Certification",
    description:
      "Final exam, role-play review, remediation, and readiness approval.",
    lessons: ["Final assessment", "Manager review", "Certification"],
    score: 0,
  },
];

const serviceUnits = [
  {
    name: "Growth Audit",
    category: "Strategy",
    basePrice: 900,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Identifies the growth constraint, revenue leaks, and priority system fixes.",
    deliverables:
      "Diagnostic report, opportunity map, action roadmap, executive walkthrough.",
    objections: "We already know the problem; we just need execution.",
    response:
      "Execution compounds only when the constraint is correctly diagnosed. The audit prevents wasted build spend.",
    bundles: ["CRM Setup", "Landing Page", "Revenue Dashboard"],
  },
  {
    name: "Positioning",
    category: "Brand",
    basePrice: 1200,
    duration: "1–2 weeks",
    complexity: 3,
    impact: "Clarifies who the offer is for, why it matters, and why now.",
    deliverables:
      "Audience map, positioning statement, offer narrative, messaging hierarchy.",
    objections: "We need leads, not brand work.",
    response:
      "Lead flow without a clear buying reason creates poor conversion. Positioning improves every downstream channel.",
    bundles: ["Brand Messaging", "Landing Page", "Sales Deck"],
  },
  {
    name: "Logo Design",
    category: "Brand",
    basePrice: 650,
    duration: "1 week",
    complexity: 2,
    impact:
      "Creates a credible, memorable mark for early trust and consistency.",
    deliverables: "Primary logo, alternate mark, export pack, usage notes.",
    objections: "Can we get a cheaper logo online?",
    response:
      "Yes, but this is tied to positioning and commercial use, not just decoration.",
    bundles: ["Brand Identity", "Social Assets", "Brand Guidelines"],
  },
  {
    name: "Brand Identity",
    category: "Brand",
    basePrice: 2200,
    duration: "2–3 weeks",
    complexity: 4,
    impact:
      "Builds a complete visual system that makes the business easier to trust and remember.",
    deliverables:
      "Logo system, color, typography, visual language, brand applications.",
    objections: "We only need a website.",
    response:
      "The website will perform better when the underlying trust system is coherent.",
    bundles: ["Brand Messaging", "Website Design", "Sales Deck"],
  },
  {
    name: "Website Design",
    category: "Design",
    basePrice: 1800,
    duration: "2 weeks",
    complexity: 3,
    impact:
      "Turns attention into confidence, qualified enquiries, and clearer next steps.",
    deliverables:
      "Responsive UI, page layouts, conversion copy structure, design system.",
    objections: "Our current site is good enough.",
    response:
      "Good enough should be measured by trust, conversion, sales enablement, and speed to decision.",
    bundles: ["Website Development", "Technical SEO", "Analytics Setup"],
  },
  {
    name: "Website Development",
    category: "Technology",
    basePrice: 3000,
    duration: "2–5 weeks",
    complexity: 4,
    impact:
      "Ships a fast, durable, editable web platform connected to business goals.",
    deliverables:
      "Production website, CMS/content model, analytics, deployment, QA.",
    objections: "Why not use a template?",
    response:
      "Templates save setup time; they rarely solve positioning, conversion, workflow, and measurement together.",
    bundles: ["Website Design", "Technical SEO", "CRM Setup"],
  },
  {
    name: "CRM Setup",
    category: "Revenue Operations",
    basePrice: 1500,
    duration: "1–3 weeks",
    complexity: 3,
    impact:
      "Creates pipeline visibility, follow-up discipline, and cleaner forecasting.",
    deliverables:
      "Pipeline stages, fields, automations, reporting, team handoff guide.",
    objections: "We can track leads in spreadsheets.",
    response:
      "Spreadsheets track history. A CRM operating system drives next actions and accountability.",
    bundles: [
      "Lead Capture Automation",
      "Revenue Dashboard",
      "Email Sequences",
    ],
  },
  {
    name: "Lead Capture Automation",
    category: "Automation",
    basePrice: 1200,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Reduces response delays and ensures every qualified enquiry enters the right workflow.",
    deliverables:
      "Forms, routing, notifications, CRM sync, follow-up triggers.",
    objections: "Manual follow-up works for us.",
    response:
      "Manual follow-up works until volume, handoffs, or timing create invisible leakage.",
    bundles: ["CRM Setup", "Email Sequences", "Website Development"],
  },
  {
    name: "Technical SEO",
    category: "Marketing",
    basePrice: 950,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Improves discoverability, crawl quality, metadata, performance, and search readiness.",
    deliverables:
      "SEO audit, fixes, metadata, sitemap, structured recommendations.",
    objections: "SEO takes too long.",
    response:
      "Technical SEO is the foundation that helps every future content and acquisition effort compound.",
    bundles: ["Website Development", "Content Strategy", "Analytics Setup"],
  },
  {
    name: "AI Workflow Assistant",
    category: "AI",
    basePrice: 2500,
    duration: "2–4 weeks",
    complexity: 5,
    impact:
      "Automates high-friction internal work while keeping human review and control.",
    deliverables:
      "Workflow map, AI assistant, guardrails, reporting, training.",
    objections: "AI feels risky for our team.",
    response:
      "We start with contained workflows, clear permissions, human approval, and measurable time savings.",
    bundles: ["CRM Setup", "Revenue Dashboard", "Knowledge Base"],
  },
  {
    name: "Brand Messaging",
    category: "Brand",
    basePrice: 850,
    duration: "1 week",
    complexity: 2,
    impact:
      "Gives sales, marketing, and leadership a clearer language system for explaining value.",
    deliverables:
      "Core message, proof points, objections, tagline routes, sales narrative.",
    objections: "We already know what we do.",
    response:
      "The question is not whether the team knows. The question is whether buyers understand quickly enough to act.",
    bundles: ["Positioning", "Website Design", "Sales Deck"],
  },
  {
    name: "Tone of Voice",
    category: "Brand",
    basePrice: 700,
    duration: "1 week",
    complexity: 2,
    impact:
      "Creates consistency across sales conversations, emails, website copy, and social presence.",
    deliverables:
      "Voice principles, vocabulary, do/don't examples, channel adaptations.",
    objections: "This feels subjective.",
    response:
      "Voice becomes practical when it reduces confusion and makes every buyer touchpoint feel intentional.",
    bundles: ["Brand Messaging", "Social Assets", "Email Sequences"],
  },
  {
    name: "Brand Guidelines",
    category: "Brand",
    basePrice: 1100,
    duration: "1–2 weeks",
    complexity: 2,
    impact:
      "Protects consistency as internal teams, vendors, and campaigns scale.",
    deliverables:
      "Logo rules, color, typography, layouts, examples, usage principles.",
    objections: "We will remember how to use the brand.",
    response:
      "Guidelines prevent brand quality from depending on memory or individual taste.",
    bundles: ["Brand Identity", "Social Assets", "Sales Deck"],
  },
  {
    name: "Social Assets",
    category: "Marketing",
    basePrice: 750,
    duration: "1 week",
    complexity: 2,
    impact:
      "Makes social selling, campaigns, hiring, and founder-led content more consistent.",
    deliverables:
      "Post templates, story formats, banners, profile assets, campaign graphics.",
    objections: "Canva templates are enough.",
    response:
      "Templates help production; a branded asset system improves recognition and trust.",
    bundles: ["Brand Guidelines", "Content Strategy", "Social Selling Setup"],
  },
  {
    name: "Landing Page",
    category: "Design",
    basePrice: 1250,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Focuses one offer, campaign, or audience segment into a measurable conversion path.",
    deliverables:
      "Page structure, copy guidance, UI, form/CTA plan, analytics events.",
    objections: "Can this just be part of the website?",
    response:
      "A landing page is built around one decision. That focus usually makes it convert better than a general page.",
    bundles: ["Positioning", "Lead Capture Automation", "Analytics Setup"],
  },
  {
    name: "Sales Deck",
    category: "Sales Enablement",
    basePrice: 950,
    duration: "1 week",
    complexity: 2,
    impact:
      "Gives consultants a sharper way to present the problem, proof, recommendation, and price.",
    deliverables:
      "Narrative deck, discovery recap format, solution slides, pricing slides.",
    objections: "We can explain this live.",
    response:
      "A strong deck makes the recommendation easier to retell when stakeholders review internally.",
    bundles: ["Brand Messaging", "Case Study System", "Proposal Template"],
  },
  {
    name: "Email Sequences",
    category: "Marketing",
    basePrice: 900,
    duration: "1–2 weeks",
    complexity: 2,
    impact:
      "Turns first interest, follow-up, proposal delivery, and reactivation into managed journeys.",
    deliverables:
      "Outreach sequence, follow-up sequence, proposal sequence, win-back sequence.",
    objections: "Email does not work in our industry.",
    response:
      "Generic email often fails. Timely, specific, buyer-aware follow-up still moves deals.",
    bundles: ["CRM Setup", "Lead Capture Automation", "Content Strategy"],
  },
  {
    name: "Analytics Setup",
    category: "Revenue Operations",
    basePrice: 800,
    duration: "1 week",
    complexity: 2,
    impact:
      "Connects website, campaign, and sales activity to measurable business signals.",
    deliverables:
      "Events, goals, dashboards, source tracking, reporting definitions.",
    objections: "We already have Google Analytics.",
    response:
      "Installed analytics is not the same as decision-ready measurement.",
    bundles: ["Website Development", "Technical SEO", "Revenue Dashboard"],
  },
  {
    name: "Revenue Dashboard",
    category: "Revenue Operations",
    basePrice: 1400,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Shows leaders where leads, pipeline, conversion, and revenue are actually moving.",
    deliverables: "KPI model, CRM views, revenue dashboard, reporting cadence.",
    objections: "We do not have clean data yet.",
    response:
      "The dashboard defines what clean enough means and exposes the data gaps worth fixing.",
    bundles: ["CRM Setup", "Analytics Setup", "Growth Audit"],
  },
  {
    name: "Content Strategy",
    category: "Marketing",
    basePrice: 1300,
    duration: "1–2 weeks",
    complexity: 3,
    impact:
      "Turns expertise into demand creation, trust assets, and sales enablement.",
    deliverables:
      "Content pillars, buyer questions, publishing roadmap, repurposing plan.",
    objections: "We do not have time to create content.",
    response:
      "The strategy prioritizes high-leverage assets that support sales, not content volume for its own sake.",
    bundles: ["Technical SEO", "Email Sequences", "Social Assets"],
  },
  {
    name: "Proposal Template",
    category: "Sales Enablement",
    basePrice: 700,
    duration: "1 week",
    complexity: 2,
    impact:
      "Standardizes how consultants connect diagnosis, recommendation, ROI, pricing, and next steps.",
    deliverables:
      "Proposal structure, pricing options, ROI language, scope boundaries.",
    objections: "Every client is different.",
    response:
      "The template standardizes the thinking while still allowing the recommendation to be tailored.",
    bundles: ["Sales Deck", "Pricing Strategy", "CRM Setup"],
  },
  {
    name: "Social Selling Setup",
    category: "Sales Enablement",
    basePrice: 850,
    duration: "1 week",
    complexity: 2,
    impact:
      "Gives reps clear profile positioning, outreach paths, and conversation flows.",
    deliverables:
      "Profile rewrite, connection scripts, DM flows, follow-up rules.",
    objections: "Social selling feels spammy.",
    response:
      "The process is built around relevance, diagnosis, and permission—not volume spam.",
    bundles: ["Social Assets", "Email Sequences", "Brand Messaging"],
  },
];

const scripts = [
  {
    type: "Cold call",
    title: "First outreach",
    body: "I’m calling because we help teams find the constraint slowing growth, then build the system to remove it. If you had to name one area where revenue is leaking right now, what would it be?",
  },
  {
    type: "Zoom",
    title: "Discovery agenda",
    body: "Today I’d like to understand the goal, what has been tried, where the handoffs break, and what a commercially meaningful improvement would be. Then I’ll outline the right next step.",
  },
  {
    type: "Email",
    title: "Proposal delivery",
    body: "Attached is the recommended Forge Build. I structured it around the constraint we uncovered: the gap between qualified interest and consistent conversion.",
  },
  {
    type: "Social",
    title: "LinkedIn first message",
    body: "Noticed your team is growing. Curious: are you already seeing clear attribution between your marketing activity and qualified sales conversations?",
  },
  {
    type: "WhatsApp",
    title: "Meeting reminder",
    body: "Quick reminder for our strategy call today. I’ll focus on your growth goal, current bottlenecks, and the clearest next move.",
  },
  {
    type: "Cold call",
    title: "Gatekeeper navigation",
    body: "I’m trying to reach the person responsible for improving lead flow and sales conversion. Who owns that conversation internally?",
  },
  {
    type: "Cold call",
    title: "Voicemail",
    body: "This is theForge. We help teams identify the constraint slowing growth and build the system to remove it. I’ll send a short note with context, then follow up once.",
  },
  {
    type: "Zoom",
    title: "Pricing walkthrough",
    body: "The investment is structured around three outcomes: diagnosing the constraint, building the highest-leverage system, and giving your team the operating rhythm to keep it compounding.",
  },
  {
    type: "Zoom",
    title: "Close with next step",
    body: "If this direction is aligned, the next step is approval of the Forge Build scope, stakeholder kickoff, and access to the systems we need to audit in week one.",
  },
  {
    type: "Email",
    title: "First outreach",
    body: "I noticed your team is investing in growth. We help businesses find the constraint between attention, conversion, and retention, then build the system that removes it. Worth a short diagnostic call?",
  },
  {
    type: "Email",
    title: "Follow-up one",
    body: "Following up with a practical angle: most teams do not need more activity first. They need to know which part of the growth system is leaking. Happy to share how we diagnose that.",
  },
  {
    type: "Email",
    title: "Re-engagement",
    body: "Circling back because timing may have changed. If growth is still being limited by inconsistent leads, unclear conversion, or manual follow-up, we can help map the next move.",
  },
  {
    type: "Social",
    title: "Connection request",
    body: "I work with teams trying to turn growth from scattered activity into an owned system. Your work caught my attention—open to connecting?",
  },
  {
    type: "Social",
    title: "Discovery DM",
    body: "When new enquiries come in, what tends to create the biggest drop-off: lead quality, speed to follow-up, unclear offer, or internal handoff?",
  },
  {
    type: "WhatsApp",
    title: "Post-call recap",
    body: "Good speaking today. The key constraint I heard was not demand alone, but converting qualified interest into a consistent pipeline. I’ll send the recommendation next.",
  },
];

const simulations = [
  {
    industry: "Healthcare",
    persona: "Operations Director",
    budget: "$8k–$18k",
    objection: "We cannot risk disrupting patient communication.",
    goal: "Improve enquiries, recall, and follow-up without losing trust.",
  },
  {
    industry: "SaaS",
    persona: "Founder",
    budget: "$12k–$35k",
    objection: "We already have a product team.",
    goal: "Improve activation, conversion, and pipeline clarity.",
  },
  {
    industry: "Manufacturing",
    persona: "Commercial Manager",
    budget: "$10k–$28k",
    objection: "Our sales process is relationship-led.",
    goal: "Turn offline demand into trackable opportunities and repeatable follow-up.",
  },
  {
    industry: "Professional Services",
    persona: "Managing Partner",
    budget: "$6k–$20k",
    objection: "Our clients come from referrals.",
    goal: "Build a credible digital trust path that strengthens referrals.",
  },
];

const salesFrameworks = [
  {
    name: "BANT",
    useCase: "Fast qualification for SMEs and inbound enquiries.",
    prompts: [
      "Budget: what range has been allocated?",
      "Authority: who signs?",
      "Need: what breaks if nothing changes?",
      "Timeline: why now?",
    ],
    warning:
      "Do not treat budget as a yes/no gate too early; value can expand budget.",
  },
  {
    name: "MEDDICC",
    useCase: "Enterprise and multi-stakeholder deals.",
    prompts: [
      "Metrics: what economic outcome matters?",
      "Economic buyer: who owns the business case?",
      "Decision criteria: how will options be judged?",
      "Champion: who wants this internally?",
    ],
    warning:
      "A friendly contact is not a champion unless they can influence internal movement.",
  },
  {
    name: "SPIN",
    useCase:
      "Deep discovery where the buyer has symptoms but no clear diagnosis.",
    prompts: [
      "Situation: what is happening now?",
      "Problem: where is friction showing up?",
      "Implication: what does this cost?",
      "Need-payoff: what improves if fixed?",
    ],
    warning: "Do not jump from problem to pitch before implication is clear.",
  },
  {
    name: "Challenger",
    useCase:
      "Clients stuck in old assumptions or underestimating the constraint.",
    prompts: [
      "Teach a commercial insight.",
      "Tailor it to the buyer's world.",
      "Take control of next steps.",
    ],
    warning: "Challenge the assumption, not the person.",
  },
];

const leadWorkflows = [
  {
    name: "Social media lead",
    steps: [
      "Message",
      "Discovery",
      "Qualification",
      "CRM entry",
      "Meeting booking",
      "Zoom call",
      "Proposal",
      "Follow-up",
      "Closed won/lost",
    ],
    qualityGate:
      "No proposal before pain, authority, timeline, and value are documented.",
  },
  {
    name: "Cold calling",
    steps: [
      "Prospecting",
      "Dial",
      "Permission opener",
      "Discovery",
      "Qualification",
      "CRM",
      "Meeting",
      "Proposal",
      "Follow-up",
    ],
    qualityGate:
      "Every call ends with a clear next action or a clean disqualification reason.",
  },
  {
    name: "Email outreach",
    steps: [
      "Prospect",
      "Personalize",
      "Send",
      "Reply handling",
      "Meeting",
      "Proposal",
      "Follow-up",
      "Close",
    ],
    qualityGate:
      "Personalization must reference a business signal, not a generic compliment.",
  },
  {
    name: "Referral lead",
    steps: [
      "Referrer context",
      "Warm introduction",
      "Trust transfer",
      "Discovery",
      "Stakeholder map",
      "Recommendation",
      "Decision support",
    ],
    qualityGate: "Do not over-rely on the referrer; still run full discovery.",
  },
];

const objections = [
  {
    objection: "Your price is too high.",
    principle: "Re-anchor to cost of inaction and expected value.",
    response:
      "I understand. Before we reduce scope, let’s compare the investment to the revenue leakage we identified and decide which outcome is most important to protect.",
  },
  {
    objection: "We need to think about it.",
    principle: "Clarify the unresolved risk.",
    response:
      "That makes sense. What part needs the most thought: the timing, the investment, the recommendation, or internal approval?",
  },
  {
    objection: "We already have a provider.",
    principle: "Avoid attacking the incumbent; diagnose the gap.",
    response:
      "If the current provider is covering the full constraint, staying with them may be right. Where are you still seeing friction despite that relationship?",
  },
  {
    objection: "We do not have budget.",
    principle: "Explore priority and business impact before discounting.",
    response:
      "Is the issue no budget at all, or that this problem has not been tied to a business case strong enough to fund?",
  },
  {
    objection: "Send me information.",
    principle: "Earn context before sending assets.",
    response:
      "I can. To send the right material, what are you trying to evaluate: credibility, pricing, timeline, or whether this fits your current goal?",
  },
];

type SavedState = {
  completed: string[];
  signed: string[];
  selectedServices: string[];
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SalesOnboardingWorkspace() {
  const [state, setState] = useState<SavedState>({
    completed: ["welcome"],
    signed: [],
    selectedServices: ["Growth Audit", "Website Development", "CRM Setup"],
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setState(JSON.parse(saved) as SavedState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const signedPercent = Math.round(
    (state.signed.length / legalDocuments.length) * 100,
  );
  const trainingPercent = Math.round(
    (state.completed.length / phases.length) * 100,
  );
  const certificationReady =
    signedPercent === 100 && phases.every((phase) => phase.score >= 85);
  const selectedUnits = serviceUnits.filter((unit) =>
    state.selectedServices.includes(unit.name),
  );
  const proposalTotal = selectedUnits.reduce(
    (total, unit) => total + unit.basePrice,
    0,
  );
  const filteredScripts = scripts.filter((script) =>
    `${script.type} ${script.title} ${script.body}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const readinessScore = Math.round(
    (signedPercent + trainingPercent + Math.min(100, proposalTotal / 90)) / 3,
  );

  function toggleCompleted(id: string) {
    setState((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id],
    }));
  }

  function toggleSigned(document: string) {
    setState((current) => ({
      ...current,
      signed: current.signed.includes(document)
        ? current.signed.filter((item) => item !== document)
        : [...current.signed, document],
    }));
  }

  function toggleService(name: string) {
    setState((current) => ({
      ...current,
      selectedServices: current.selectedServices.includes(name)
        ? current.selectedServices.filter((item) => item !== name)
        : [...current.selectedServices, name],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-border/50 bg-forge-black text-white">
        <div className="relative p-6 sm:p-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(55% 70% at 85% 20%, color-mix(in oklab, var(--primary) 24%, transparent), transparent 72%)",
            }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <Badge className="bg-primary/15 text-primary">
                Sales Onboarding & Certification
              </Badge>
              <h1 className="font-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl">
                Train consultants to diagnose constraints, build Forge Builds,
                and sell outcomes.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                A self-paced LMS, sales playbook, service catalog, compliance
                gate, and practical certification workspace for theForge sales
                recruits.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white/70">Readiness score</span>
                <Trophy className="size-5 text-accent" />
              </div>
              <div className="font-display mt-4 text-5xl">
                {readinessScore}%
              </div>
              <Progress
                value={readinessScore}
                className="mt-5 bg-white/10"
                indicatorClassName="bg-primary"
              />
              <p className="mt-4 text-xs leading-5 text-white/60">
                Requires signed documents, 85%+ assessment performance, and
                completed practical simulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={ShieldCheck}
          label="Legal completion"
          value={`${signedPercent}%`}
        />
        <MetricCard
          icon={BookOpen}
          label="Training progress"
          value={`${trainingPercent}%`}
        />
        <MetricCard
          icon={Calculator}
          label="Sample Forge Build"
          value={currency(proposalTotal)}
        />
        <MetricCard
          icon={Award}
          label="Certification"
          value={certificationReady ? "Ready" : "Locked"}
        />
      </div>

      <Tabs defaultValue="journey" className="gap-4">
        <div className="overflow-x-auto">
          <TabsList className="h-auto min-w-max flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="journey"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Journey
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Legal
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Product mastery
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Pricing engine
            </TabsTrigger>
            <TabsTrigger
              value="playbook"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Playbook
            </TabsTrigger>
            <TabsTrigger
              value="scripts"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Scripts
            </TabsTrigger>
            <TabsTrigger
              value="simulations"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Simulations
            </TabsTrigger>
            <TabsTrigger
              value="manager"
              className="h-9 flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              Manager
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="journey">
          <div className="grid gap-4 lg:grid-cols-3">
            {phases.map((phase, index) => {
              const locked = phase.id !== "welcome" && signedPercent < 100;
              const complete = state.completed.includes(phase.id);
              return (
                <Card
                  key={phase.id}
                  className={cn(
                    "transition-colors",
                    complete && "border-primary/60",
                    locked && "opacity-60",
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span>{phase.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {phase.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.lessons.map((lesson) => (
                        <Badge key={lesson} variant="secondary">
                          {lesson}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <Badge
                        variant={phase.score >= 85 ? "success" : "outline"}
                      >
                        {phase.score ? `${phase.score}%` : "Not started"}
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant={complete ? "secondary" : "default"}
                        disabled={locked}
                        onClick={() => toggleCompleted(phase.id)}
                      >
                        {locked ? (
                          <Lock />
                        ) : complete ? (
                          <CheckCircle2 />
                        ) : (
                          <PlayCircle />
                        )}
                        {locked ? "Locked" : complete ? "Complete" : "Start"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Compliance gate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-5 rounded-lg border border-border/50 bg-secondary/30 p-4 text-sm text-muted-foreground">
                Training unlocks after all required documents are signed.
                Download/PDF generation can be connected to the document service
                later; signing status is already tracked in this workspace.
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {legalDocuments.map((document) => {
                  const signed = state.signed.includes(document);
                  return (
                    <div
                      key={document}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50"
                    >
                      <span className="flex items-center gap-3">
                        <FileSignature className="size-4 text-primary" />
                        <span className="text-sm font-medium">{document}</span>
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        {signed ? "Signed" : "Pending"}
                        <Checkbox
                          checked={signed}
                          onCheckedChange={() => toggleSigned(document)}
                          aria-label={`Mark ${document} as signed`}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid gap-4 xl:grid-cols-2">
            {serviceUnits.map((unit) => (
              <Card key={unit.name}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                    <span>{unit.name}</span>
                    <Badge variant="ember">{unit.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {unit.impact}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <MiniStat
                      label="Base price"
                      value={currency(unit.basePrice)}
                    />
                    <MiniStat label="Duration" value={unit.duration} />
                    <MiniStat
                      label="Complexity"
                      value={`${unit.complexity}/5`}
                    />
                  </div>
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    <InfoBlock title="Deliverables" body={unit.deliverables} />
                    <InfoBlock
                      title="Objection response"
                      body={unit.response}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {unit.bundles.map((bundle) => (
                      <Badge key={bundle} variant="outline">
                        {bundle}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Forge Build assembler</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {serviceUnits.map((unit) => (
                  <div
                    key={unit.name}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-4 hover:border-primary/50"
                  >
                    <Checkbox
                      checked={state.selectedServices.includes(unit.name)}
                      onCheckedChange={() => toggleService(unit.name)}
                      aria-label={`Include ${unit.name} in the Forge Build`}
                    />
                    <span>
                      <span className="block text-sm font-medium">
                        {unit.name}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {currency(unit.basePrice)} · {unit.duration} ·
                        complexity {unit.complexity}/5
                      </span>
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Proposal snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div>
                  <div className="text-muted-foreground text-xs">
                    Recommended investment
                  </div>
                  <div className="font-display mt-1 text-4xl">
                    {currency(proposalTotal)}
                  </div>
                </div>
                <div className="grid gap-2">
                  {selectedUnits.map((unit) => (
                    <div
                      key={unit.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span>{unit.name}</span>
                      <span className="text-muted-foreground">
                        {currency(unit.basePrice)}
                      </span>
                    </div>
                  ))}
                </div>
                <Button type="button" className="w-full">
                  Practice ROI explanation <ChevronRight />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="playbook">
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="size-5 text-primary" />
                  Qualification frameworks
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {salesFrameworks.map((framework) => (
                  <div
                    key={framework.name}
                    className="rounded-lg border border-border/50 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display text-2xl">
                        {framework.name}
                      </h3>
                      <Badge variant="secondary">{framework.useCase}</Badge>
                    </div>
                    <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      {framework.prompts.map((prompt) => (
                        <li key={prompt} className="flex gap-2">
                          <Target className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 rounded-md bg-secondary/40 p-3 text-xs leading-5 text-muted-foreground">
                      Watchout: {framework.warning}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareText className="size-5 text-primary" />
                  Objection handling drills
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {objections.map((item) => (
                  <div
                    key={item.objection}
                    className="rounded-lg border border-border/50 p-5"
                  >
                    <Badge variant="outline">{item.objection}</Badge>
                    <h3 className="mt-4 text-sm font-semibold text-primary">
                      {item.principle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      “{item.response}”
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="size-5 text-primary" />
                  Lead capture workflows
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {leadWorkflows.map((workflow) => (
                  <div
                    key={workflow.name}
                    className="rounded-lg border border-border/50 p-5"
                  >
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workflow.steps.map((step, index) => (
                        <span
                          key={`${workflow.name}-${step}`}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs"
                        >
                          <span className="font-mono text-primary">
                            {index + 1}
                          </span>
                          {step}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-5 text-muted-foreground">
                      Quality gate: {workflow.qualityGate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <span>Searchable sales scripts</span>
                <div className="relative w-full md:w-80">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search calls, emails, social..."
                    className="pl-9"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {filteredScripts.map((script) => (
                <div
                  key={`${script.type}-${script.title}`}
                  className="rounded-lg border border-border/50 p-5"
                >
                  <Badge variant="secondary">{script.type}</Badge>
                  <h3 className="mt-3 font-semibold">{script.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {script.body}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulations">
          <div className="grid gap-4 lg:grid-cols-2">
            {simulations.map((simulation) => (
              <Card key={simulation.industry}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>{simulation.industry}</span>
                    <Badge variant="outline">{simulation.budget}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <InfoBlock title="Buyer persona" body={simulation.persona} />
                  <InfoBlock title="Client goal" body={simulation.goal} />
                  <InfoBlock
                    title="Likely objection"
                    body={simulation.objection}
                  />
                  <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 font-medium text-primary">
                      <Brain className="size-4" />
                      AI role-play evaluator
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Placeholder for later: score discovery depth, objection
                      response, ROI framing, and close quality.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manager">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Sales readiness indicators</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <Readiness label="Legal readiness" value={signedPercent} />
                <Readiness
                  label="Training completion"
                  value={trainingPercent}
                />
                <Readiness label="Assessment floor" value={85} />
                <Readiness label="Simulation performance" value={84} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Coaching recommendations</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  "Repeat simulation practice until every buyer scenario scores at least 85%.",
                  "Review pricing confidence and discount-control drills before live enterprise calls.",
                  "Assign a manager-led role-play focused on authority, budget, and internal approval.",
                  "Unlock AI coaching after the OpenAI evaluation workflow is connected.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-lg border border-border/50 p-4 text-sm"
                  >
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <div className="text-muted-foreground text-xs">{label}</div>
          <div className="font-display mt-2 text-2xl">{value}</div>
        </div>
        <Icon className="size-5 text-primary" />
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/25 p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </div>
      <p className="mt-2 leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function Readiness({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
