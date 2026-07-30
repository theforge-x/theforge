import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

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
        "/os",
        "/login",
        "/proposal/",
        "/demo/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
