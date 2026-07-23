import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="border-border bg-forge-black border-t">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
            From the clients
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">
            Said by them, not us.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="border-border flex flex-col gap-6 rounded-lg border p-8"
            >
              <blockquote className="text-foreground text-[15px] leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center justify-between gap-4 pt-2">
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
                <div className="font-display text-accent shrink-0 text-lg">
                  {t.metric}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
