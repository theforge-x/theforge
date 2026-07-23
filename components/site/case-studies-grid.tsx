import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getPublishedCaseStudies } from "@/lib/data-access";

export async function CaseStudiesGrid({ limit }: { limit?: number }) {
  const caseStudies = await getPublishedCaseStudies();
  const items = limit ? caseStudies.slice(0, limit) : caseStudies;

  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
              Fresh off the forge
            </div>
            <h2 className="font-display text-4xl sm:text-5xl">
              Proof, not promises.
            </h2>
          </div>
          <Link
            href="/work"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            View all work →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((c) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className="border-border hover:border-accent/50 group flex flex-col overflow-hidden rounded-lg border transition-colors"
            >
              {c.featuredImage ? (
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <Image
                    src={c.featuredImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-5 p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono-eyebrow text-muted-foreground text-[10px] uppercase">
                      {c.client} · {c.industry}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{c.title}</h3>
                  </div>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-accent size-5 shrink-0 transition-colors" />
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {c.summary}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="font-display text-accent text-xl">
                    {c.metric.value}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!items.length ? (
            <p className="text-muted-foreground col-span-full text-center text-sm">
              Case studies are being prepared.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
