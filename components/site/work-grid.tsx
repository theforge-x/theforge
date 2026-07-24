"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaseStudy } from "@/lib/data";

const ALL = "All work";

export function WorkGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const c of caseStudies) {
      for (const t of c.tags) set.add(t);
    }
    return [ALL, ...Array.from(set)];
  }, [caseStudies]);

  const [active, setActive] = useState(ALL);

  const items =
    active === ALL
      ? caseStudies
      : caseStudies.filter((c) => c.tags.includes(active));

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <Tabs value={active} onValueChange={setActive} className="mb-12 min-w-0">
        <section
          className="-mx-6 overflow-x-auto px-6 pb-2 [overscroll-behavior-inline:contain] lg:mx-0 lg:overflow-visible lg:px-0"
          aria-label="Filter work by category"
        >
          <TabsList className="mx-auto h-auto min-w-max flex-nowrap lg:min-w-0 lg:max-w-full lg:flex-wrap lg:justify-center">
            {tags.map((tag) => (
              <TabsTrigger key={tag} value={tag} className="h-8 flex-none">
                {tag}
              </TabsTrigger>
            ))}
          </TabsList>
        </section>
      </Tabs>

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
            No published work in this category yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
