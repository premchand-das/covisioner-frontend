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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) {
    return {
      title: "Startup Profile",
      description:
        "Explore startup profiles, journeys, jobs, and teams on CoVisioner.",
      alternates: {
        canonical: `${siteConfig.url}/startups/${slug}`,
      },
    };
  }

  const title = `${startup.startupName} | Startup Profile, Jobs & Journey`;

  const description =
    startup.tagline ||
    startup.vision ||
    startup.bio?.slice(0, 155) ||
    `Explore ${startup.startupName}'s startup profile, journey, team, technologies, and open jobs on CoVisioner.`;

  const image = startup.coverImage || startup.logo || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/startups/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/startups/${slug}`,
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

  const organizationSchema = startup
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: startup.startupName,
        url: `${siteConfig.url}/startups/${slug}`,
        logo: startup.logo || undefined,
        image: startup.coverImage || startup.logo || siteConfig.ogImage,
        description:
          startup.tagline ||
          startup.vision ||
          startup.bio ||
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
        sameAs: [
          startup.website,
          startup.socialLinks?.linkedin,
          startup.socialLinks?.twitter,
          startup.socialLinks?.github,
        ].filter(Boolean),
        knowsAbout: startup.technologies || undefined,
      }
    : null;

  return (
    <>
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <StartupPublicClient />
    </>
  );
}