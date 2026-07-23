"use client";

import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  Check,
  Cloud,
  Code2,
  Megaphone,
  Palette,
  Settings2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type CapabilityVisual =
  | "product"
  | "brand"
  | "demand"
  | "ai"
  | "revenue"
  | "platform";

type Capability = {
  icon: ComponentType<{ className?: string }>;
  name: string;
  kicker: string;
  description: string;
  overview: string;
  visual: CapabilityVisual;
  services: string[];
  outcomes: string[];
  idealFor: string;
  approach: string;
};

const groups: Capability[] = [
  {
    icon: Code2,
    name: "Digital products",
    kicker: "Strategy → interface → infrastructure",
    description:
      "Fast, durable customer experiences built around a measurable business outcome.",
    overview:
      "We turn a commercial idea into a product people can understand, trust and use. Product strategy, experience design and engineering stay in one room, so the thing we ship is as viable as it is polished.",
    visual: "product",
    services: [
      "Custom Web Development",
      "Mobile App Development",
      "E-commerce Solutions",
      "API Development & Integrations",
      "Maintenance & Support",
    ],
    outcomes: [
      "A faster path from concept to a production-ready release",
      "A modular foundation that can evolve without a rebuild",
      "Clear product analytics tied to real customer behaviour",
    ],
    idealFor:
      "Teams launching a new digital product, modernising a fragile platform or turning a high-friction customer journey into a competitive advantage.",
    approach:
      "We prototype the riskiest assumptions first, establish the product system, then ship in measured releases with quality, performance and ownership built in.",
  },
  {
    icon: Palette,
    name: "Experience & brand",
    kicker: "Position → express → convert",
    description:
      "Clear positioning and interfaces that make complex offers easier to understand and buy.",
    overview:
      "A strong brand is not a coat of paint. It is a decision system that makes every message, screen and interaction feel unmistakably yours. We build the strategy and the expression together.",
    visual: "brand",
    services: [
      "UI/UX Design",
      "Brand Strategy & Identity",
      "Product Strategy",
      "Conversion Design",
    ],
    outcomes: [
      "A sharper position customers can repeat and remember",
      "A flexible visual and verbal system for every touchpoint",
      "Journeys designed to reduce doubt and move decisions forward",
    ],
    idealFor:
      "Businesses whose offer has outgrown its identity, products that feel harder to use than they should, or teams preparing for a high-stakes launch or repositioning.",
    approach:
      "We find the central idea, pressure-test it with real audience context and translate it into a reusable system—from narrative and identity to the decisive moments in the interface.",
  },
  {
    icon: Megaphone,
    name: "Demand & growth",
    kicker: "Attention → intent → revenue",
    description:
      "An acquisition system that connects discoverability, campaigns, leads, and revenue.",
    overview:
      "We build demand engines, not channel dependencies. Search, campaigns, content and sales activation work from one commercial thesis and share one measurement model.",
    visual: "demand",
    services: [
      "Search Engine Optimization (SEO)",
      "Search Engine Marketing (SEM)",
      "Digital Marketing",
      "Lead Generation",
      "Sales Enablement",
      "Growth Strategy",
    ],
    outcomes: [
      "A balanced acquisition portfolio instead of one fragile channel",
      "Campaigns built around buying signals, not vanity engagement",
      "A visible line between marketing activity and commercial impact",
    ],
    idealFor:
      "Teams with inconsistent pipeline, rising acquisition costs, unclear attribution or a strong offer that is still too dependent on referrals and founder-led selling.",
    approach:
      "We diagnose the demand constraint, define the signal and message, then run a disciplined test-and-learn system that compounds what works and retires what does not.",
  },
  {
    icon: Bot,
    name: "AI & automation",
    kicker: "Observe → decide → assist",
    description:
      "Practical automation for high-friction work—designed with human control and useful reporting.",
    overview:
      "We apply AI where it creates leverage, not theatre. The goal is a dependable operating advantage: less repetitive work, faster decisions and better service without surrendering human judgment.",
    visual: "ai",
    services: [
      "AI Solutions & Integrations",
      "AI Agents & Chatbots",
      "Marketing Automation",
      "Business Process Automation",
    ],
    outcomes: [
      "High-volume work handled consistently and around the clock",
      "Faster access to the knowledge buried across your business",
      "Human approvals, audit trails and escalation designed from day one",
    ],
    idealFor:
      "Teams losing hours to repetitive coordination, fragmented knowledge, slow response times or manual processes that have become the ceiling on growth.",
    approach:
      "We map the workflow before choosing the model, design the guardrails and human handoffs, then integrate the automation into the tools your team already uses.",
  },
  {
    icon: Settings2,
    name: "Revenue operations",
    kicker: "Signal → handoff → decision",
    description:
      "A connected operating layer for customer data, workflows, handoffs, and decisions.",
    overview:
      "Revenue leaks in the spaces between teams. We connect the data, stages, ownership and automation so marketing, sales and customer success can operate from one version of the truth.",
    visual: "revenue",
    services: [
      "CRM Implementation",
      "Analytics & Reporting",
      "Customer Journey Automation",
      "Data & Systems Audits",
    ],
    outcomes: [
      "A CRM the team trusts because it reflects how they really sell",
      "Cleaner handoffs and fewer opportunities lost between stages",
      "Live visibility into pipeline quality, velocity and next actions",
    ],
    idealFor:
      "Growing teams managing revenue in spreadsheets, fighting unreliable reporting, or watching good leads disappear between marketing, sales and delivery.",
    approach:
      "We audit the current motion, define the revenue architecture and implement the minimum useful operating layer before adding automation and advanced reporting.",
  },
  {
    icon: Cloud,
    name: "Platforms & advisory",
    kicker: "Assess → architect → enable",
    description:
      "Technical foundations and senior guidance for teams navigating growth or change.",
    overview:
      "When the next decision carries technical weight, we bring senior product and engineering judgment to the table. We help teams modernise responsibly and build foundations that keep future options open.",
    visual: "platform",
    services: [
      "Cloud Solutions",
      "Technical Consulting",
      "Architecture & Modernization",
      "Fractional Product Leadership",
    ],
    outcomes: [
      "A pragmatic technical roadmap aligned to business priorities",
      "More resilient infrastructure without unnecessary complexity",
      "Stronger internal decisions, documentation and delivery confidence",
    ],
    idealFor:
      "Leaders facing architecture debt, scaling pressure, a major migration or a product roadmap that needs experienced technical direction without a full-time executive hire.",
    approach:
      "We establish the decision context, make trade-offs explicit and work alongside your team—from architecture and sequencing through implementation standards and knowledge transfer.",
  },
];

function ProductVisual() {
  return (
    <div className="relative mx-auto h-72 w-full max-w-md [perspective:900px]">
      <div className="capability-product absolute inset-x-7 top-7 h-48 rounded-xl border border-white/15 bg-black/35 p-3 shadow-2xl backdrop-blur">
        <div className="flex gap-1.5 border-b border-white/10 pb-3">
          <span className="size-1.5 rounded-full bg-ember" />
          <span className="size-1.5 rounded-full bg-gold" />
          <span className="size-1.5 rounded-full bg-white/30" />
        </div>
        <div className="grid h-32 grid-cols-[0.65fr_1.35fr] gap-3 pt-3">
          <div className="space-y-2 rounded-md bg-white/5 p-2">
            {[60, 85, 45, 70].map((width) => (
              <span
                key={width}
                className="block h-1 rounded-full bg-white/15"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-gold/25 to-ember/10">
            <div className="capability-scan absolute inset-x-0 h-px bg-gold shadow-[0_0_14px_var(--gold)]" />
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
              <span className="h-8 rounded bg-black/25" />
              <span className="h-12 -translate-y-4 rounded bg-gold/30" />
              <span className="h-10 -translate-y-2 rounded bg-ember/30" />
            </div>
          </div>
        </div>
      </div>
      <div className="capability-float-delayed absolute bottom-4 right-3 h-36 w-20 rounded-[1.25rem] border border-white/20 bg-black/60 p-2 shadow-xl backdrop-blur">
        <div className="mx-auto mb-3 h-1 w-5 rounded-full bg-white/20" />
        <div className="h-16 rounded-lg bg-gradient-to-b from-gold/25 to-transparent" />
        <div className="mt-2 h-1.5 w-full rounded bg-white/10" />
        <div className="mt-1.5 h-1.5 w-2/3 rounded bg-white/10" />
      </div>
      <div className="absolute bottom-9 left-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gold backdrop-blur">
        One product system
      </div>
    </div>
  );
}

function BrandVisual() {
  return (
    <div className="relative mx-auto grid h-72 w-full max-w-md place-items-center overflow-hidden">
      <div className="capability-orbit absolute size-56 rounded-full border border-dashed border-white/15" />
      <div className="absolute left-[14%] top-[18%] size-28 rotate-12 rounded-[2.5rem_1rem_2.5rem_1rem] bg-ember/75 shadow-[0_20px_60px_-20px_var(--ember)]" />
      <div className="capability-float absolute right-[14%] top-[25%] size-32 rounded-full bg-gold/75 mix-blend-screen shadow-[0_20px_60px_-20px_var(--gold)]" />
      <div className="capability-float-delayed absolute bottom-[16%] left-[28%] h-24 w-40 -rotate-6 rounded-2xl border border-white/20 bg-black/45 p-4 backdrop-blur-xl">
        <span className="font-display text-5xl font-semibold tracking-tighter text-white">
          Aa
        </span>
        <div className="mt-2 flex gap-1">
          <span className="h-1 w-14 rounded bg-white/60" />
          <span className="h-1 w-8 rounded bg-gold" />
        </div>
      </div>
      <Sparkles className="capability-pulse absolute right-[20%] top-[13%] size-5 text-gold" />
    </div>
  );
}

function DemandVisual() {
  const bars = [34, 48, 42, 68, 61, 82, 96];
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-md items-end gap-3 px-5 pb-10">
      <div className="absolute inset-x-5 bottom-9 top-8 rounded-2xl border border-white/10 bg-white/[0.025]" />
      {bars.map((height, index) => (
        <div key={height} className="relative z-10 flex h-48 flex-1 items-end">
          <div
            className="capability-bar w-full rounded-t-md bg-gradient-to-t from-ember/25 to-gold shadow-[0_0_22px_-9px_var(--gold)]"
            style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }}
          />
        </div>
      ))}
      <svg
        className="pointer-events-none absolute inset-x-5 bottom-9 top-8 z-20 h-[calc(100%-4.25rem)] w-[calc(100%-2.5rem)] overflow-visible"
        viewBox="0 0 360 190"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 160 C 82 145, 92 128, 138 134 S 210 91, 245 96 S 302 48, 348 30"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          className="capability-draw"
        />
        <circle
          cx="348"
          cy="30"
          r="5"
          fill="var(--gold)"
          className="capability-pulse"
        />
      </svg>
      <div className="absolute left-6 top-5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        Demand signal
      </div>
      <div className="absolute bottom-1 right-5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
        Compounding →
      </div>
    </div>
  );
}

function AiVisual() {
  const nodes = [
    "left-[8%] top-[22%]",
    "right-[8%] top-[18%]",
    "left-[12%] bottom-[18%]",
    "right-[11%] bottom-[16%]",
  ];
  return (
    <div className="relative mx-auto grid h-72 w-full max-w-md place-items-center">
      <div className="capability-orbit absolute size-56 rounded-full border border-dashed border-gold/25" />
      <div className="capability-orbit-reverse absolute size-40 rounded-full border border-white/10" />
      <div className="relative z-10 grid size-24 place-items-center rounded-3xl border border-gold/40 bg-gold/10 shadow-[0_0_65px_-18px_var(--gold)] backdrop-blur">
        <Bot className="size-10 text-gold" />
        <span className="capability-pulse absolute -right-1 -top-1 size-3 rounded-full border-2 border-black bg-ember" />
      </div>
      {nodes.map((position, index) => (
        <div key={position} className={cn("absolute z-10", position)}>
          <div
            className="capability-pulse grid size-12 place-items-center rounded-xl border border-white/15 bg-black/45 backdrop-blur"
            style={{ animationDelay: `${index * 260}ms` }}
          >
            {index === 0 && <Megaphone className="size-4 text-white/70" />}
            {index === 1 && (
              <ChartNoAxesCombined className="size-4 text-white/70" />
            )}
            {index === 2 && <Settings2 className="size-4 text-white/70" />}
            {index === 3 && <Code2 className="size-4 text-white/70" />}
          </div>
        </div>
      ))}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 288"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M80 75 L200 144 L320 65 M200 144 L78 225 M200 144 L322 225"
          stroke="rgba(255,255,255,.16)"
          strokeDasharray="5 7"
        />
      </svg>
    </div>
  );
}

function RevenueVisual() {
  const stages = [
    { name: "Signal", width: "100%" },
    { name: "Qualified", width: "82%" },
    { name: "Proposal", width: "64%" },
    { name: "Won", width: "46%" },
  ];
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-md flex-col justify-center gap-3 px-6">
      <div className="absolute left-10 top-6 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        Live revenue flow
      </div>
      {stages.map((stage, index) => (
        <div
          key={stage.name}
          className="relative mx-auto"
          style={{ width: stage.width }}
        >
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div
              className="capability-flow absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
              style={{ animationDelay: `${index * 350}ms` }}
            />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-medium text-white/80">
                {stage.name}
              </span>
              <span className="font-mono text-[9px] text-gold">
                0{index + 1}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 right-7 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
        <span className="capability-pulse size-1.5 rounded-full bg-emerald-300" />
        Systems synced
      </div>
    </div>
  );
}

function PlatformVisual() {
  const layers = [
    {
      label: "Experience",
      top: "top-7",
      width: "w-[64%]",
      opacity: "bg-gold/25",
    },
    {
      label: "Services",
      top: "top-[5.8rem]",
      width: "w-[76%]",
      opacity: "bg-ember/20",
    },
    {
      label: "Data",
      top: "top-[9.9rem]",
      width: "w-[88%]",
      opacity: "bg-white/10",
    },
  ];
  return (
    <div className="relative mx-auto h-72 w-full max-w-md [perspective:900px]">
      {layers.map((layer, index) => (
        <div
          key={layer.label}
          className={cn(
            "capability-layer absolute left-1/2 h-20 rounded-xl border border-white/15 backdrop-blur",
            layer.top,
            layer.width,
            layer.opacity,
          )}
          style={{ animationDelay: `${index * 500}ms` }}
        >
          <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.16em] text-white/55">
            {layer.label}
          </span>
          <span className="absolute bottom-3 right-3 size-2 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
        </div>
      ))}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/55 backdrop-blur">
        <Cloud className="size-3.5 text-gold" /> Resilient by design
      </div>
    </div>
  );
}

function CapabilityGraphic({ type }: { type: CapabilityVisual }) {
  return (
    <div className="relative min-h-80 overflow-hidden bg-[#090a0c] p-6 lg:min-h-full lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--gold)_15%,transparent),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative flex min-h-64 items-center lg:min-h-full">
        {type === "product" && <ProductVisual />}
        {type === "brand" && <BrandVisual />}
        {type === "demand" && <DemandVisual />}
        {type === "ai" && <AiVisual />}
        {type === "revenue" && <RevenueVisual />}
        {type === "platform" && <PlatformVisual />}
      </div>
    </div>
  );
}

function CapabilityModal({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  const Icon = capability.icon;

  return (
    <Dialog>
      <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-38px_var(--primary)] motion-reduce:transform-none">
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-md bg-secondary transition-colors duration-300 group-hover:bg-primary/15">
            <Icon className="size-5 text-accent" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
            0{index + 1}
          </span>
        </div>
        <h3 className="mt-5 font-display text-xl">{capability.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {capability.description}
        </p>
        <div className="mt-5 space-y-2 border-t border-border pt-5">
          {capability.services.map((service) => (
            <div key={service} className="flex gap-2 text-sm">
              <ChartNoAxesCombined className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {service}
            </div>
          ))}
        </div>
        <DialogTrigger asChild>
          <button
            type="button"
            className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary outline-none transition-[gap,color] hover:gap-3 focus-visible:underline"
          >
            Explore capability <ArrowRight className="size-4" />
          </button>
        </DialogTrigger>
      </article>

      <DialogContent
        className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-6xl gap-0 overflow-hidden rounded-2xl p-0 sm:w-[calc(100%-3rem)]"
        aria-describedby={`capability-${index}-description`}
      >
        <div className="grid max-h-[92dvh] overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
          <CapabilityGraphic type={capability.visual} />

          <div className="p-6 sm:p-9 lg:p-12">
            <DialogHeader>
              <div className="mb-5 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Capability 0{index + 1}
                </span>
              </div>
              <DialogTitle className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                {capability.name}
              </DialogTitle>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {capability.kicker}
              </div>
              <DialogDescription
                id={`capability-${index}-description`}
                className="pt-4 text-base leading-7"
              >
                {capability.overview}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  What changes
                </h4>
                <div className="mt-4 space-y-3">
                  {capability.outcomes.map((outcome) => (
                    <div key={outcome} className="flex gap-3 text-sm leading-6">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10">
                        <Check className="size-3 text-primary" />
                      </span>
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  What we can build
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {capability.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              <div className="bg-card p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                  Best fit
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {capability.idealFor}
                </p>
              </div>
              <div className="bg-card p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                  How we work
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {capability.approach}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                Not sure this is the constraint? Start with a diagnostic growth
                audit and we&apos;ll map the right system together.
              </p>
              <Button asChild className="shrink-0">
                <Link href="/contact">
                  Discuss this capability <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ServicesGrid() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <div className="font-mono-eyebrow mb-3 text-[11px] uppercase text-accent">
              Capabilities
            </div>
            <h2 className="font-display text-4xl sm:text-5xl">
              Specialists where it matters. One system where it counts.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Engage one capability to solve a focused problem, or combine them
            into a connected growth platform. Every recommendation starts with
            the constraint—not a predetermined package.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => (
            <CapabilityModal
              key={group.name}
              capability={group}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
