import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ConstraintCTA } from "@/components/site/constraint-cta";
import { ContentBody } from "@/components/site/content-body";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { getPublishedPost } from "@/lib/data-access";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: post.featuredImage
      ? { images: [post.featuredImage] }
      : undefined,
  };
}
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <article>
          <header className="mx-auto max-w-4xl px-6 py-20 text-center">
            <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
              {post.category}
            </div>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
              {post.title}
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
            <time className="text-muted-foreground mt-5 block text-xs">
              {post.publishedAt?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </header>
          {post.featuredImage ? (
            <div className="relative mx-auto aspect-[16/7] max-w-6xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          ) : null}
          <ContentBody body={post.body} />
        </article>
        <ConstraintCTA />
      </main>
      <Footer />
    </>
  );
}
