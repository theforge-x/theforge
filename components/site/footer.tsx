import Link from "next/link";
import { connection } from "next/server";
import { BrandMark } from "@/components/brand-mark";
import { getStudioSettings } from "@/lib/data-access";

const columns = [
  {
    heading: "Services",
    links: [
      { href: "/services#audit", label: "Growth Audit" },
      { href: "/services#build", label: "Growth System Build" },
      { href: "/services#partner", label: "Temper Partner" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Access",
    links: [
      { href: "/login", label: "Client Portal" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export async function Footer() {
  await connection();
  const settings = await getStudioSettings();
  return (
    <footer className="border-border border-t">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="size-7" />
              <span className="font-display font-semibold text-lg tracking-wide">
                {settings.studioName}
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              A growth systems studio. We diagnose the structural constraint
              stalling growth, forge the acquisition and retention systems to
              fix it, then temper the result until it compounds on its own.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="font-mono-eyebrow text-muted-foreground text-[11px] uppercase">
                {col.heading}
              </div>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="border-border mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © 2026 The Forge Studio. All rights reserved.
          </p>
          <p className="text-muted-foreground font-mono-eyebrow uppercase">
            {settings.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
