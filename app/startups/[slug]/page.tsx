import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import StartupPublicClient from "./StartupPublicClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getStartup(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/startups/slug/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.startup || null;
  } catch {
    return null;
  }
}

function cleanText(value?: string, max = 155) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function safeJsonLd(schema: object) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);

  const canonical = `${siteConfig.url}/startups/${slug}`;

  if (!startup) {
    return {
      title: "Startup Profile",
      description:
        "Explore startup profiles, journeys, jobs, and teams on CoVisioner.",
      alternates: {
        canonical,
      },
    };
  }

  const title = `${startup.startupName} | Startup Profile, Jobs & Journey`;

  const description =
    cleanText(startup.tagline) ||
    cleanText(startup.vision) ||
    cleanText(startup.bio) ||
    `Explore ${startup.startupName}'s startup profile, journey, team, technologies, and open jobs on CoVisioner.`;

  const image = startup.coverImage || startup.logo || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CoVisioner",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${startup.startupName} startup profile on CoVisioner`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function StartupPage({ params }: Props) {
  const { slug } = await params;
  const startup = await getStartup(slug);

  const canonical = `${siteConfig.url}/startups/${slug}`;

  const sameAs = startup
    ? [
        startup.website,
        startup.socialLinks?.linkedin,
        startup.socialLinks?.twitter,
        startup.socialLinks?.github,
      ].filter(Boolean)
    : [];

  const organizationSchema = startup
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: startup.startupName,
        url: canonical,
        logo: startup.logo || undefined,
        image: startup.coverImage || startup.logo || siteConfig.ogImage,
        description:
          cleanText(startup.tagline, 500) ||
          cleanText(startup.vision, 500) ||
          cleanText(startup.bio, 500) ||
          `${startup.startupName} startup profile on CoVisioner.`,
        foundingDate: startup.foundedYear
          ? String(startup.foundedYear)
          : undefined,
        industry: startup.industry || undefined,
        address: startup.location
          ? {
              "@type": "PostalAddress",
              addressLocality: startup.location,
              addressCountry: "IN",
            }
          : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        knowsAbout: startup.technologies?.length
          ? startup.technologies
          : undefined,
      }
    : null;

  const breadcrumbSchema = startup
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Startups",
            item: `${siteConfig.url}/startups`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: startup.startupName,
            item: canonical,
          },
        ],
      }
    : null;

  const schemas = [organizationSchema, breadcrumbSchema].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(schema as object),
          }}
        />
      ))}

      <StartupPublicClient />
    </>
  );
}