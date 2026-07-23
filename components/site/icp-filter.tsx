import { Check, X } from "lucide-react";

const fitFor = [
  "You're doing $500K–$10M in revenue and have hit a growth ceiling",
  "One channel is carrying the whole business, and you know it",
  "You want systems documented and owned by your team, not a black box",
  "You're ready to invest in a 6–10 week build, not a quick hack",
];

const notFor = [
  "You want a single tactic, not a system (we'll point you elsewhere)",
  "You're pre-revenue or still validating product-market fit",
  "You want to outsource growth thinking entirely and disappear",
  "You need results in two weeks with no room to build properly",
];

export function ICPFilter() {
  return (
    <section className="border-border border-t">
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
          <div className="border-border bg-card rounded-lg border p-8">
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

          <div className="border-border bg-card rounded-lg border p-8 opacity-80">
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
      </div>
    </section>
  );
}
