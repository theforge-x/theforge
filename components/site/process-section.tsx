const phases = [
  {
    number: "01",
    name: "Growth Constraint Map",
    duration: "1-2 week diagnostic",
    description:
      "We identify where revenue is leaking across positioning, lead response, follow-up, CRM data, pipeline stages and reporting.",
    output:
      "System map, KPI baseline, prioritized roadmap and implementation proposal.",
  },
  {
    number: "02",
    name: "Revenue System Sprint",
    duration: "6–10 week build",
    description:
      "We run the Forge Build inside the sprint, combining only the modules needed: digital products, experience and brand, demand, AI automation, revenue operations, and platform advisory.",
    output:
      "One functioning revenue system your team can run, measure and improve.",
  },
  {
    number: "03",
    name: "Temper Growth Partner",
    duration: "Ongoing optimization",
    description:
      "We improve conversion rate, speed to lead, lead-to-opportunity rate, sales-cycle length, win rate, retention and referrals.",
    output: "A commercial scorecard and senior team accountable for momentum.",
  },
];

export function ProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 max-w-2xl">
        <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
          How it's forged
        </div>
        <h2 className="font-display text-4xl sm:text-5xl">
          Three products. One connected revenue system.
        </h2>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          The buyer does not buy isolated web design, SEO, automation or CRM
          consulting. The six build capabilities sit inside the Revenue System
          Sprint, which sits between diagnosis and ongoing optimization.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border md:grid-cols-3">
        {phases.map((phase) => (
          <div key={phase.number} className="bg-card flex flex-col gap-4 p-8">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-accent text-3xl">
                {phase.number}
              </span>
              <span className="font-mono-eyebrow text-muted-foreground text-[10px] uppercase">
                {phase.duration}
              </span>
            </div>
            <h3 className="font-display text-2xl">{phase.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {phase.description}
            </p>
            <p className="border-border/50 mt-auto border-t pt-4 text-xs font-medium">
              {phase.output}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
