import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EmberField } from "@/components/site/ember-field";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="grain-overlay bg-forge-black relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-full opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
        <h2 className="font-display text-4xl sm:text-5xl">
          Ready to find the leak between demand and revenue?
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed">
          Start with a Growth Constraint Map. We will identify the bottleneck,
          agree the baseline and show what a measurable system should change.
        </p>
        <Button size="lg" variant="ember" className="mt-8" asChild>
          <Link href="/book">
            Get your Growth Constraint Map <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
      <EmberField />
    </section>
  );
}
