import { Activity, ArrowRight, Gauge, Repeat2 } from "lucide-react";

const signals = [
  {
    icon: Activity,
    number: "01",
    title: "See the signal",
    description:
      "Know which channel, handoff or offer is actually moving the business—and which one is quietly holding it back.",
  },
  {
    icon: Gauge,
    number: "02",
    title: "Make the decision",
    description:
      "Turn scattered observations into a ranked operating plan with owners, measures and a next best move.",
  },
  {
    icon: Repeat2,
    number: "03",
    title: "Compound the advantage",
    description:
      "Build the loops that keep learning, converting and improving after the initial breakthrough.",
  },
];

export function PredictableGrowthSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(45% 65% at 85% 50%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="font-mono-eyebrow mb-4 text-[11px] uppercase text-accent">
              From signal to system
            </div>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              When growth stops being guesswork, it becomes predictable—and then
              inevitable.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              Predictability is not a lucky streak. It is what happens when the
              right signals are visible, the next decision is clear, and every
              useful win is engineered to make the next one easier.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border/80 bg-card/70 p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Growth curve
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Compounding
              </span>
            </div>
            <div className="relative h-36 overflow-hidden rounded-lg border border-border/60 bg-background/60">
              <div className="absolute inset-x-6 bottom-6 h-px bg-border" />
              <div className="absolute bottom-6 left-6 top-6 w-px bg-border" />
              <svg
                aria-hidden
                viewBox="0 0 500 150"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <title>Compounding growth trajectory</title>
                <path
                  d="M 25 125 C 85 123, 120 118, 160 112 S 225 103, 260 89 S 315 80, 345 60 S 405 43, 475 12"
                  fill="none"
                  stroke="var(--accent)"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <circle cx="25" cy="125" r="4" fill="var(--muted-foreground)" />
                <circle cx="260" cy="89" r="4" fill="var(--accent)" />
                <circle cx="475" cy="12" r="5" fill="var(--accent)" />
              </svg>
              <div className="absolute bottom-2 left-7 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                signal
              </div>
              <div className="absolute right-3 top-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                momentum
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid size-7 place-items-center rounded-full border border-accent/40 text-accent">
                <ArrowRight className="size-3.5" />
              </span>
              The system gets stronger as it learns.
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {signals.map((signal) => (
            <article
              key={signal.number}
              className="bg-card flex flex-col gap-5 p-7 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <signal.icon className="size-5 text-accent" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  {signal.number}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl">{signal.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {signal.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
