import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/portal/",
        "/sales/",
        "/login",
        "/proposal/",
        "/demo/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
