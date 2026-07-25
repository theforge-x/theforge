import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { getPublishedPosts } from "@/lib/data-access";

export async function InsightsPreview({ limit = 3 }: { limit?: number }) {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];

  try {
    posts = await getPublishedPosts();
  } catch {
    posts = [];
  }

  const items = posts.slice(0, limit);

  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono-eyebrow text-accent mb-3 text-[11px] uppercase">
              Field notes
            </div>
            <h2 className="font-display text-4xl sm:text-5xl">
              Thinking for the next move.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Practical ideas on digital products, growth systems, automation
              and the decisions that make momentum compound.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Explore the blog <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-lg border border-border/50 bg-card p-7 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_70px_-42px_var(--primary)] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono-eyebrow text-accent text-[10px] uppercase">
                  {post.category}
                </span>
                <ArrowUpRight className="text-muted-foreground size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none" />
              </div>
              <h3 className="font-display mt-8 text-2xl leading-tight">
                {post.title}
              </h3>
              <p className="text-muted-foreground mt-4 text-sm leading-6">
                {post.excerpt}
              </p>
              <div className="text-muted-foreground mt-auto pt-8 text-xs">
                {post.publishedAt?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </Link>
          ))}
          {!items.length ? (
            <p className="text-muted-foreground col-span-full text-center text-sm">
              New field notes are being prepared.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
