import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Building2,
  Dumbbell,
  Factory,
  HeartPulse,
  Landmark,
  ShoppingBag,
  Waypoints,
} from "lucide-react";

const industries: Array<{
  name: string;
  icon: LucideIcon;
  constraint: string;
}> = [
  {
    name: "Professional services",
    icon: BriefcaseBusiness,
    constraint: "Turn expertise into a repeatable growth engine.",
  },
  {
    name: "Construction & property",
    icon: Building2,
    constraint: "Create demand and systems that keep projects moving.",
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    constraint: "Make complex journeys clearer, faster and more trusted.",
  },
  {
    name: "Financial services",
    icon: Landmark,
    constraint: "Build confidence across every high-stakes decision.",
  },
  {
    name: "Retail & commerce",
    icon: ShoppingBag,
    constraint: "Connect customer experience to measurable revenue.",
  },
  {
    name: "Fitness & wellness",
    icon: Dumbbell,
    constraint: "Turn attention into retention and durable momentum.",
  },
  {
    name: "Industrial businesses",
    icon: Factory,
    constraint: "Modernise the operating layer without losing what works.",
  },
  {
    name: "Technology companies",
    icon: Waypoints,
    constraint: "Align product, positioning and pipeline for the next stage.",
  },
];

export function IndustriesWeServe() {
  return (
    <section className="border-border/50 border-b">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
            Best-fit buyers
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">
            Built for high-consideration service businesses.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            The common pattern is more important than the category: founder-led
            firms with long sales cycles, high-value contracts, referral
            dependence and leads leaking between marketing, sales and
            operations.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="group bg-card p-6 transition-colors hover:bg-secondary"
            >
              <industry.icon className="text-accent size-5 transition-transform group-hover:-translate-y-0.5" />
              <h3 className="mt-8 text-base font-semibold">{industry.name}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {industry.constraint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
