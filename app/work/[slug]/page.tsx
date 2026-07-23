import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentBody } from "@/components/site/content-body";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { Badge } from "@/components/ui/badge";
import { getPublishedCaseStudy } from "@/lib/data-access";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedCaseStudy(slug);
  if (!result) return {};

  return {
    title: result.post.seoTitle || result.post.title,
    description: result.post.seoDescription || result.post.excerpt,
    openGraph: result.post.featuredImage
      ? { images: [result.post.featuredImage] }
      : undefined,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPublishedCaseStudy(slug);
  if (!result) notFound();

  const { post, project, client } = result;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <article>
          <header className="mx-auto max-w-5xl px-6 py-20">
            <div className="font-mono-eyebrow text-accent text-[11px] uppercase">
              {client.industry} · Case study
            </div>
            <h1 className="font-display mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">
              {post.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="secondary">{client.name}</Badge>
              <Badge variant="secondary">{project.name}</Badge>
              <Badge variant="secondary">{project.phase}</Badge>
            </div>
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
      </main>
      <Footer />
    </>
  );
}
