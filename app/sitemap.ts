import type { MetadataRoute } from "next";

import { getPublishedCaseStudies, getPublishedPosts } from "@/lib/data-access";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/work",
  "/blog",
  "/contact",
  "/book",
  "/privacy",
  "/terms",
  "/data-processing",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));

  try {
    const [posts, caseStudies] = await Promise.all([
      getPublishedPosts(),
      getPublishedCaseStudies(),
    ]);

    routes.push(
      ...posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
      })),
      ...caseStudies.map((caseStudy) => ({
        url: `${siteUrl}/work/${caseStudy.slug}`,
      })),
    );
  } catch {
    // Keep the core public sitemap available when content storage is unavailable.
  }

  return routes;
}
