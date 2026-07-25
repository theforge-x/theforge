import { ArrowUpRight, Flame } from "lucide-react";
import Link from "next/link";
import { EmberField } from "@/components/site/ember-field";
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
      <EmberField />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <div className="font-mono-eyebrow border-border/40 text-muted-foreground mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase">
          <Flame className="text-primary size-3" />
          Technology for inevitable growth
        </div>

        <h1 className="font-display animate-ignite bg-[linear-gradient(90deg,var(--gold)_0%,var(--ember)_55%,var(--gold)_100%)] bg-[length:220%_100%] bg-clip-text text-[13vw] leading-[0.95] text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
          WE FORGE SYSTEMS
          <br />
          THAT COMPOUND GROWTH.
        </h1>

        <p className="text-muted-foreground mt-8 max-w-3xl text-balance text-base leading-relaxed sm:text-lg">
          We turn technology — digital assets, intelligent workflows, CRM, AI analytics — into lasting enterprise value. Cut the friction. Surface the signal. Replace guesswork with a system engineered for scalable, sustained growth.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" variant="ember" asChild>
            <Link href="/book">
              Book a Growth Audit <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">Explore our services</Link>
          </Button>
        </div>

        <dl className="mt-16 grid w-full max-w-3xl grid-cols-4 gap-6 border-t border-border/40 pt-8">
          <div>
            <dt className="sr-only">Clients onboarded</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              20+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              clients onboarded
            </dd>
          </div>
          <div>
            <dt className="sr-only">Projects forged</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              120+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              projects forged
            </dd>
          </div>
          <div>
            <dt className="sr-only">Revenue added</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              $1.2M+
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              added to client revenue
            </dd>
          </div>
          <div>
            <dt className="sr-only">Weeks to breakthrough</dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">
              10
            </dd>
            <dd className="text-muted-foreground mt-1 text-xs">
              avg. weeks to breakthrough
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
