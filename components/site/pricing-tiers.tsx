import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "audit",
    name: "Growth Constraint Map",
    subtitle: "Paid diagnostic",
    price: "$1.5K-$3K",
    period: "1-2 weeks",
    description:
      "A structured diagnostic that finds where revenue is leaking and defines the highest-leverage 90-day intervention.",
    features: [
      "Revenue leak and handoff analysis",
      "Lead response, CRM and data review",
      "KPI baseline and measurement plan",
      "Prioritized roadmap and build proposal",
    ],
    cta: "Book the diagnostic",
    featured: false,
  },
  {
    id: "build",
    name: "Revenue System Sprint",
    subtitle: "Fixed-scope implementation",
    price: "$8K-$35K",
    period: "6-10 week build",
    description:
      "A focused Forge Build sprint that connects the modules needed to turn demand into a measurable revenue system.",
    features: [
      "Digital products and conversion experience",
      "Experience, brand, demand and growth modules",
      "AI automation, RevOps and platform advisory",
      "Dashboard, SOPs, training and handover",
    ],
    cta: "Discuss a sprint",
    featured: true,
  },
  {
    id: "partner",
    name: "Temper Growth Partner",
    subtitle: "Continuous optimization",
    price: "$2.5K-$7.5K/mo",
    period: "ongoing",
    description:
      "An accountable optimization engagement for teams that want their revenue system measured, improved and extended.",
    features: [
      "Weekly commercial scorecard",
      "Conversion and speed-to-lead improvement",
      "Pipeline, win-rate and retention experiments",
      "30- or 60-day stabilization options",
    ],
    cta: "Plan optimization",
    featured: false,
  },
];

export function PricingTiers() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 max-w-2xl">
        <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
          The right entry point
        </div>
        <h2 className="font-display text-4xl sm:text-5xl">
          Pricing that matches the problem.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Ranges are starting points for US and UK-facing engagements. Some or
          all of the diagnostic fee can be credited toward implementation when
          the fit is clear.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            id={tier.id}
            className={cn(
              "flex flex-col gap-6 rounded-lg border p-8",
              tier.featured
                ? "border-accent bg-card shadow-accent/10 relative shadow-lg lg:-translate-y-3"
                : "border-border/50 bg-card",
            )}
          >
            {tier.featured && (
              <span className="font-mono-eyebrow bg-accent text-accent-foreground absolute -top-3 left-8 rounded-full px-3 py-1 text-[10px] uppercase">
                Most forged
              </span>
            )}
            <div>
              <div className="font-mono-eyebrow text-muted-foreground text-[11px] uppercase">
                {tier.subtitle}
              </div>
              <h3 className="font-display mt-1 text-2xl">{tier.name}</h3>
            </div>

            <div>
              <div className="font-display text-3xl">{tier.price}</div>
              <div className="text-muted-foreground text-xs">{tier.period}</div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {tier.description}
            </p>

            <ul className="flex flex-col gap-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="text-accent mt-0.5 size-4 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={tier.featured ? "ember" : "outline"}
              className="mt-auto"
              asChild
            >
              <Link href={tier.id === "audit" ? "/book" : "/contact"}>
                {tier.cta}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
