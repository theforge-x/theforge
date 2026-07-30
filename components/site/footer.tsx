import Link from "next/link";
import { connection } from "next/server";
import { BrandMark } from "@/components/brand-mark";
import { getStudioSettings } from "@/lib/data-access";

const socialLinks = [
  {
    href: "https://www.linkedin.com/theforge_x",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
  {
    href: "https://www.facebook.com/theforge_x",
    label: "Facebook",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.685 4.533-4.685 1.312 0 2.686.236 2.686.236v2.973h-1.514c-1.491 0-1.956.93-1.956 1.886v2.26h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  {
    href: "https://x.com/theforge_x",
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  },
];

const columns = [
  {
    heading: "Services",
    links: [
      { href: "/services#audit", label: "Growth Constraint Map" },
      { href: "/services#build", label: "Revenue System Sprint" },
      { href: "/services#partner", label: "Temper Growth Partner" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    heading: "Access",
    links: [{ href: "/login", label: "Client Portal" },
      { href: "/contact", label: "Contact" },],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/data-processing", label: "Data & AI" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
];

export async function Footer() {
  await connection();
  const settings = await getStudioSettings();
  return (
    <footer className="border-border/50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_4fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="size-7" />
              <span className="font-display font-semibold text-lg tracking-wide">
                {settings.studioName}
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              theForge Revenue Systems is a Lagos-founded, globally delivered
              HubX company for founder-led firms that have outgrown
              referrals and disconnected tools.
            </p>
            <nav
              className="mt-2 flex items-center gap-2"
              aria-label="Social media links"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary inline-flex size-9 items-center justify-center rounded-full border border-border/60 transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4 fill-current"
                  >
                    <path d={social.path} />
                  </svg>
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
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
        </div>

        <div className="border-border/50 mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} theForge. All rights reserved.
          </p>
          <p className="text-muted-foreground font-mono-eyebrow uppercase">
            {settings.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
