import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { websiteDemos } from "@/lib/db/schema";
import type { DemoBlock, DemoBrand } from "@/lib/demo-render";

const cards = new Set<DemoBlock["type"]>([
  "features",
  "proof",
  "process",
  "faq",
  "gallery",
  "pricing",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [demo] = await db
    .select({ title: websiteDemos.title })
    .from(websiteDemos)
    .where(eq(websiteDemos.shareToken, token))
    .limit(1);
  return {
    title: demo?.title ?? "Website demo",
    robots: { index: false, follow: false },
  };
}
export default async function SharedDemoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [demo] = await db
    .select()
    .from(websiteDemos)
    .where(eq(websiteDemos.shareToken, token))
    .limit(1);
  if (!demo) notFound();
  const brand = demo.brand as DemoBrand;
  const blocks = demo.blocks as DemoBlock[];
  const importedHtml = blocks.find((item) => item.type === "html")?.html;
  if (importedHtml) {
    return (
      <main className="min-h-screen bg-white">
        <iframe
          title={demo.title}
          sandbox=""
          srcDoc={importedHtml}
          className="h-screen w-full border-0"
        />
      </main>
    );
  }
  const text = brand.text ?? "#171717";
  const muted = brand.muted ?? "#6b6b6b";
  const radius = brand.radius ?? "18px";
  return (
    <main
      className="min-h-screen"
      style={{
        background: brand.background,
        color: text,
        fontFamily: brand.font,
      }}
    >
      {blocks.map((item) => (
        <section
          key={item.id}
          className={`px-6 py-20 sm:px-10 sm:py-28 ${
            brand.style === "soft" ? "" : "border-b border-black/10"
          }`}
          style={{
            background:
              item.type === "hero"
                ? brand.primary
                : item.type === "cta"
                  ? brand.accent
                  : brand.background,
            color: item.type === "hero" || item.type === "cta" ? "white" : text,
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-xs uppercase tracking-[.2em] opacity-60">
              {item.eyebrow || item.type}
            </div>
            <h2
              className={`mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-7xl ${
                brand.style === "bold" ? "tracking-tighter" : ""
              }`}
            >
              {item.title}
            </h2>
            <p
              className="mt-6 max-w-2xl text-lg leading-8 opacity-80"
              style={{
                color:
                  item.type === "hero" || item.type === "cta"
                    ? "inherit"
                    : muted,
              }}
            >
              {item.body}
            </p>
            {item.type === "pricing" && item.meta ? (
              <div
                className="mt-7 inline-block px-5 py-4 text-lg font-bold text-white"
                style={{ background: brand.primary, borderRadius: radius }}
              >
                {item.meta}
              </div>
            ) : null}
            {item.items?.length ? (
              <div
                className={`mt-9 grid gap-4 ${
                  item.type === "stats"
                    ? "sm:grid-cols-3"
                    : cards.has(item.type)
                      ? "sm:grid-cols-2 lg:grid-cols-3"
                      : ""
                }`}
              >
                {item.items.map((listItem) => (
                  <div
                    key={listItem}
                    className={`border border-black/10 bg-white/50 p-5 leading-7 ${
                      item.type === "stats" ? "text-2xl font-bold" : ""
                    }`}
                    style={{ borderRadius: radius, color: text }}
                  >
                    {listItem}
                  </div>
                ))}
              </div>
            ) : null}
            {item.button ? (
              <a
                href={item.buttonHref || "mailto:hello@theforge.ng"}
                className="mt-8 inline-block bg-white px-5 py-3 font-semibold text-neutral-900 shadow-sm"
                style={{ borderRadius: radius }}
              >
                {item.button}
              </a>
            ) : null}
          </div>
        </section>
      ))}
    </main>
  );
}
