import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="border-border/50 grain-overlay bg-forge-black border-b pt-40 pb-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="font-mono-eyebrow text-accent mb-4 text-[11px] uppercase">
          {eyebrow}
        </div>
        <h1 className="font-display text-5xl sm:text-6xl">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
