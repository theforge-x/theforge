"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { caseStudies } from "@/lib/data";

const ALL = "All work";

export function WorkGrid() {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const c of caseStudies) {
      for (const t of c.tags) set.add(t);
    }
    return [ALL, ...Array.from(set)];
  }, []);

  const [active, setActive] = useState(ALL);

  const items =
    active === ALL
      ? caseStudies
      : caseStudies.filter((c) => c.tags.includes(active));

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <Tabs value={active} onValueChange={setActive} className="mb-12">
        <TabsList className="flex-wrap">
          {tags.map((tag) => (
            <TabsTrigger key={tag} value={tag}>
              {tag}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((c) => (
          <div
            key={c.slug}
            className="border-border hover:border-accent/50 group flex flex-col gap-5 rounded-lg border p-8 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono-eyebrow text-muted-foreground text-[10px] uppercase">
                  {c.industry}
                </div>
                <h3 className="mt-1 text-xl font-semibold">{c.client}</h3>
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
        ))}
      </div>
    </div>
  );
}
