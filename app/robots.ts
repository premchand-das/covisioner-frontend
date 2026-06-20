import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/onboarding",
          "/startup",
          "/startup/*",
          "/talent/saved-jobs",
          "/talent/applications",
          "/talent/messages",
          "/talent/notifications",
          "/messages",
          "/notifications",
          "/profile",
          "/profile/*",
          "/api",
          "/api/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}