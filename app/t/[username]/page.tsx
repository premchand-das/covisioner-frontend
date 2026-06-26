import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import TalentProfileClient from "@/app/t/[username]/TalentProfileClient";

type Props = {
  params: Promise<{ username: string }>;
};

async function getTalentProfile(username: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/talent/username/${username}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.profile || null;
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
  const { username } = await params;
  const profile = await getTalentProfile(username);

  const canonical = `${siteConfig.url}/t/${username}`;

  if (!profile) {
    return {
      title: "Talent Profile",
      description:
        "Explore startup talent profiles, builders, projects, skills, experience, and portfolios on CoVisioner.",
      alternates: {
        canonical,
      },
    };
  }

  const displayName = profile.fullname || username;

  const title = `${displayName} | Startup Talent Profile`;

  const description =
    cleanText(profile.headline) ||
    cleanText(profile.bio) ||
    `View ${displayName}'s startup talent profile, skills, projects, experience, and portfolio on CoVisioner.`;

  const image = profile.avatar || profile.user?.avatar || siteConfig.ogImage;

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
          alt: `${displayName} talent profile on CoVisioner`,
        },
      ],
      type: "profile",
      firstName: displayName.split(" ")[0],
      lastName: displayName.split(" ").slice(1).join(" ") || undefined,
      username,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function TalentProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getTalentProfile(username);

  const displayName = profile?.fullname || username;
  const canonical = `${siteConfig.url}/t/${username}`;

  const sameAs = profile
    ? [
        profile.socialLinks?.linkedin,
        profile.socialLinks?.twitter,
        profile.socialLinks?.github,
        profile.socialLinks?.website,
      ].filter(Boolean)
    : [];

  const personSchema = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: displayName,
        url: canonical,
        image: profile.avatar || profile.user?.avatar || undefined,
        jobTitle: profile.headline || "Startup Talent",
        description:
          cleanText(profile.bio, 500) ||
          cleanText(profile.headline, 500) ||
          `${displayName} talent profile on CoVisioner.`,
        knowsAbout: profile.skills?.length ? profile.skills : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        hasOccupation: {
          "@type": "Occupation",
          name: profile.headline || "Startup Talent",
          skills: profile.skills?.length
            ? profile.skills.join(", ")
            : undefined,
        },
      }
    : null;

  const breadcrumbSchema = profile
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
            name: "Talent Profiles",
            item: `${siteConfig.url}/t/${username}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: displayName,
            item: canonical,
          },
        ],
      }
    : null;

  const schemas = [personSchema, breadcrumbSchema].filter(Boolean);

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

      <TalentProfileClient />
    </>
  );
}