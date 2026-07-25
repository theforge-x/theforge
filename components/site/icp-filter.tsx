import { Check, X } from "lucide-react";

const fitFor = [
  "You generate $100K–$10M in revenue, but hit a clear growth ceiling.",
  "You are single-channel dependent—and aware of the structural risk.",
  "You seek fully documented, team-owned systems rather than a black box agency.",
  "You are ready to commit to a 1–10 week architectural build, not a superficial hack.",
  "You scale operations faster than internal infrastructure can sustain.",
  "You are ready to replace founder-led guesswork with repeatable, data-backed processes."
];

const notFor = [
  "You seek isolated tactics instead of a scalable, end-to-end system.",
  "You are pre-revenue or still validating initial product-market fit.",
  "You look to completely outsource strategic thinking and walk away.",
  "You expect magic in less than a week, not giving systems room to be built right.",
  "You are unwilling to challenge core assumptions or give up internal micromanagement.",
  "You search for low-budget experiments rather than high-leverage infrastructure."
];

export function ICPFilter() {
  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
            Who this is for
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">
            We're deliberately not for everyone.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-border/50 bg-card rounded-lg border p-8">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <Check className="text-accent size-5" />
              This is for you if
            </h3>
            <ul className="flex flex-col gap-4">
              {fitFor.map((item) => (
                <li
                  key={item}
                  className="text-muted-foreground flex gap-3 text-sm leading-relaxed"
                >
                  <span className="bg-accent mt-2 size-1.5 shrink-0 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border/50 bg-card rounded-lg border p-8 opacity-80">
            <h3 className="text-muted-foreground mb-5 flex items-center gap-2 text-lg font-semibold">
              <X className="size-5" />
              Not for you if
            </h3>
            <ul className="flex flex-col gap-4">
              {notFor.map((item) => (
                <li
                  key={item}
                  className="text-muted-foreground flex gap-3 text-sm leading-relaxed"
                >
                  <span className="bg-muted-foreground/40 mt-2 size-1.5 shrink-0 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="border-accent mt-8 max-w-2xl border-l-2 pl-5 text-sm leading-relaxed text-foreground">
          This diagnostic process yields transformative clarity, but only for
          leaders willing to evaluate their operations without ego or defense.
          If that aligns with your mindset, let’s connect.
        </p>
      </div>
    </section>
  );
}
