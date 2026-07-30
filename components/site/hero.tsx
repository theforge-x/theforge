import { ArrowUpRight, Flame } from "lucide-react";
import Link from "next/link";
import { EmberCanvas } from "@/components/site/ember-field";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grain-overlay relative overflow-hidden bg-forge-black pt-40 pb-28">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[120%] opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <div className="font-mono-eyebrow border-border/40 text-muted-foreground mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase">
          <Flame className="text-accent size-3" />
          Revenue systems for founder-led firms
        </div>

        <h1 className="font-display uppercase animate-ignite bg-[linear-gradient(90deg,var(--gold)_0%,var(--ember)_55%,var(--gold)_100%)] bg-[length:220%_100%] bg-clip-text text-[13vw] leading-[0.95] text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
          Turn referrals to predictable revenue.
        </h1>

        <p className="text-muted-foreground mt-8 max-w-3xl text-balance text-base leading-relaxed sm:text-lg">
          theForge connects your positioning, website, CRM, automation and sales
          follow-up into one growth engine. Built in less than 10 weeks, measured
          against tangible commercial outcomes, and fully owned by your team.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" variant="ember" asChild>
            <Link href="/book">
              Get your Growth Constraint Map <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/work">See verified client results</Link>
          </Button>
        </div>

        <dl className="mt-16 grid w-full max-w-3xl grid-cols-4 gap-6 border-t border-border/40 pt-8">
          <div>
            <dt className="sr-only">Clients onboarded</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              20+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              client relationships
            </dd>
          </div>
          <div>
            <dt className="sr-only">Projects forged</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              120+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              systems and assets built
            </dd>
          </div>
          <div>
            <dt className="sr-only">Revenue added</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              $1.2M+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              reported client revenue influence
            </dd>
          </div>
          <div>
            <dt className="sr-only">Weeks to breakthrough</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              10
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              week sprint window
            </dd>
          </div>
        </dl>
      </div>
      <EmberCanvas />
    </section>
  );
}
