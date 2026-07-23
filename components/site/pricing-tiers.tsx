import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "audit",
    name: "The Spark",
    subtitle: "The diagnostic entry point",
    price: "From $0",
    period: "60-minute audit",
    description:
      "A structured session that maps every constraint across your growth system. You leave with a ranked action plan.",
    features: [
      "Full growth-constraint diagnostic",
      "Acquisition & conversion gap analysis",
      "Retention and referral infrastructure review",
      "Ranked action plan with impact estimate",
    ],
    cta: "Book the audit",
    featured: false,
  },
  {
    id: "build",
    name: "The Forge Build",
    subtitle: "The complete growth transformation",
    price: "From $4,500",
    period: "6–10 week build",
    description:
      "Every constraint from the audit gets an engineered fix — acquisition, offer, pricing, retention, referral.",
    features: [
      "Multi-channel acquisition system, built",
      "Offer repositioning & pricing restructure",
      "Retention model & referral framework",
      "Full documentation and handover",
    ],
    cta: "Enquire about a build",
    featured: true,
  },
  {
    id: "partner",
    name: "The Temper",
    subtitle: "Monthly growth partnership",
    price: "From $1,800/mo",
    period: "ongoing",
    description:
      "The systems are live. This keeps them compounding — new channels, iteration, and priority access.",
    features: [
      "Monthly growth architecture review",
      "New channel development",
      "Priority access throughout the month",
      "Quarterly structural performance audit",
    ],
    cta: "Talk to a strategist",
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
          Start where you are.
        </h2>
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
                : "border-border bg-card",
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
              <Link href="/contact">{tier.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
