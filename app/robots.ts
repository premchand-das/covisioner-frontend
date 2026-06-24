import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/startups",
          "/startups/*",
          "/jobs",
          "/jobs/*",
          "/t/*",
          "/blog",
          "/blog/*",
          "/case-studies",
          "/case-studies/*",
          "/founder-stories",
          "/founder-stories/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/login",
          "/signup",
          "/verify-email",
          "/forgot-password",
          "/reset-password/",

          "/onboarding",

          "/startup",
          "/startup/",

          "/talent/dashboard",
          "/talent/profile",
          "/talent/saved-jobs",
          "/talent/applications",
          "/talent/messages",
          "/talent/notifications",

          "/messages",
          "/notifications",

          "/profile",
          "/profile/",

          "/_next/",
        ],
      },

      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],

    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}