export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "CoVisioner",
  url: SITE_URL,
  title: "CoVisioner | Startup Discovery, Jobs & Co-Founder Network",
  description:
    "Discover startups, explore startup journeys, connect with talented builders, find co-founders, and join ambitious startup teams.",
  ogImage: "/og-image.png",
  keywords: [
    "startup discovery",
    "startup directory",
    "startup jobs",
    "startup case studies",
    "startup talent",
    "co-founder network",
    "join startups",
    "early stage startups",
    "startup hiring",
    "startup ecosystem",
  ],
};