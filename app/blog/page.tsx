import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ConstraintCTA } from "@/components/site/constraint-cta";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { PageHeader } from "@/components/site/page-header";
import { getPublishedPosts } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Problem-led thinking on revenue systems, referrals, CRM, lead follow-up and founder-led service growth.",
};
export default async function BlogPage() {
  await connection();
  const posts = await getPublishedPosts();
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Insights"
          title="Problem-led field notes."
          description="Practical thinking on referrals, lead leakage, speed to lead, CRM stages, intake conversion and the operating decisions that turn demand into revenue."
        />
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border-border/50 bg-card overflow-hidden rounded-lg border"
              >
                {post.featuredImage ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="font-mono-eyebrow text-accent text-[10px] uppercase">
                    {post.category}
                  </div>
                  <h2 className="font-display mt-3 text-2xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="text-muted-foreground mt-5 text-xs">
                    {post.publishedAt?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </article>
            ))}
            {!posts.length ? (
              <p className="text-muted-foreground col-span-full text-center">
                No published articles yet.
              </p>
            ) : null}
          </div>
        </section>
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
