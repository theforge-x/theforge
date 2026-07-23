import { logos } from "@/lib/data";

export function LogoTicker() {
  const doubled = [...logos, ...logos];

  return (
    <section className="border-border bg-forge-black overflow-hidden border-y py-6">
      <div className="flex w-max animate-marquee items-center gap-12">
        {doubled.map((logo, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list for seamless loop
            key={`${logo}-${i}`}
            className="font-display text-muted-foreground/70 shrink-0 text-xl tracking-wide whitespace-nowrap"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
