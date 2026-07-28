import { Check, X } from "lucide-react";

const fitFor = [
  "You run a founder-led service firm with high-consideration, high-value sales.",
  "You have outgrown referrals but still depend on them for too much pipeline.",
  "You already have a website, leads and tools, but they do not work together.",
  "You seek fully documented, team-owned systems rather than a black box agency.",
  "You are ready to commit to a 6-10 week system build, not a superficial refresh.",
  "You want positioning, website, CRM, follow-up and reporting connected.",
];

const notFor = [
  "You want isolated tactics instead of a measurable revenue system.",
  "You are pre-revenue or still validating initial product-market fit.",
  "You look to completely outsource strategic thinking and walk away.",
  "You expect magic in less than a week.",
  "You are unwilling to challenge core assumptions or give up internal micromanagement.",
  "You are shopping for the lowest-cost website or marketing vendor.",
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
            Built for a specific buyer moment.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The best fit is not “we need more marketing.” It is “we have demand,
            tools and follow-up activity, but no reliable system for turning
            that activity into revenue.”
          </p>
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
          The economic buyer is usually the founder, CEO, managing partner, COO
          or head of growth responsible for revenue, delivery quality and
          operating discipline.
        </p>
      </div>
    </section>
  );
}
