const phases = [
  {
    number: "01",
    name: "Diagnose the ore",
    duration: "60-minute audit",
    description:
      "We map every constraint across acquisition, conversion, retention, and pricing. Not a general review — a ranked diagnosis with an estimated growth impact attached to each finding.",
    output: "A written growth audit with a prioritized action plan.",
  },
  {
    number: "02",
    name: "Forge the system",
    duration: "6–10 week build",
    description:
      "We engineer the fix for every constraint the audit surfaced: multi-channel acquisition, offer repositioning, pricing restructure, retention model, referral framework. Nothing templated.",
    output: "A live, documented growth system running in your business.",
  },
  {
    number: "03",
    name: "Temper & compound",
    duration: "Ongoing partnership",
    description:
      "Systems drift without maintenance. Monthly strategy sessions, channel review, and new-build iteration keep the system compounding as you scale past each new ceiling.",
    output: "A growth partner, not a report you read once.",
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
          Three passes through the fire.
        </h2>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          Growth isn't engineered in one sitting. Ore gets diagnosed, forged
          into shape, then tempered until it holds under load.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
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
            <p className="border-border mt-auto border-t pt-4 text-xs font-medium">
              {phase.output}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
