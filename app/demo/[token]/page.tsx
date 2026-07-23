import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { websiteDemos } from "@/lib/db/schema";
import type { DemoBlock, DemoBrand } from "@/lib/demo-render";
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
  return (
    <main
      className="min-h-screen text-neutral-900"
      style={{ background: brand.background, fontFamily: brand.font }}
    >
      {blocks.map((item) => (
        <section
          key={item.id}
          className="px-6 py-20 sm:px-10 sm:py-28"
          style={{
            background:
              item.type === "hero"
                ? brand.primary
                : item.type === "cta"
                  ? brand.accent
                  : brand.background,
            color:
              item.type === "hero" || item.type === "cta" ? "white" : "#171717",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-xs uppercase tracking-[.2em] opacity-60">
              {item.type}
            </div>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-7xl">
              {item.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-80">
              {item.body}
            </p>
            {item.button ? (
              <a
                href="mailto:hello@theforge.ng"
                className="mt-8 inline-block rounded-md bg-white px-5 py-3 font-semibold text-neutral-900 shadow-sm"
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
