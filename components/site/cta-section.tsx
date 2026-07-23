import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EmberField } from "@/components/site/ember-field";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="grain-overlay bg-forge-black relative overflow-hidden">
      <EmberField />
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
          Ready to find your constraint?
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed">
          Book a 60-minute growth audit. You'll leave with a ranked list of
          what's actually stalling growth — whether or not you ever work with
          us.
        </p>
        <Button size="lg" variant="ember" className="mt-8" asChild>
          <Link href="/contact">
            Book a Growth Audit <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
