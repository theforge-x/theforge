import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ConstraintCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="animate-flicker pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 12% 120%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), radial-gradient(ellipse at 88% -20%, color-mix(in oklab, var(--ember) 14%, transparent), transparent 50%)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
            Bring us the constraint
          </div>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            Let&apos;s build the system that makes the next stage possible.
          </h2>
        </div>
        <Button variant="secondary" size="lg" asChild className="shrink-0">
          <Link href="/contact">
            Start a conversation
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
