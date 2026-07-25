import { logos } from "@/lib/data";

export function LogoTicker({ items = logos }: { items?: string[] }) {
  const displayItems = items.length ? items : logos;
  const doubled = [...displayItems, ...displayItems];

  return (
    <section className="border-border/50 bg-forge-black overflow-hidden border-y py-6">
      <div className="flex w-max animate-marquee items-center gap-12">
        {doubled.map((item, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list for seamless loop
            key={`${item}-${i}`}
            className="font-display text-muted-foreground/70 shrink-0 text-xl tracking-wide whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
