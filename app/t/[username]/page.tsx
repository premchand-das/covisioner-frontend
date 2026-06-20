import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import TalentProfileClient from "@/app/t/[username]/TalentProfileClient";

type Props = {
  params: Promise<{ username: string }>;
};

async function getTalentProfile(username: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/username/${username}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getTalentProfile(username);

  if (!profile) {
    return {
      title: "Talent Profile",
      description:
        "Explore startup talent profiles, builders, projects, skills, experience, and portfolios on CoVisioner.",
      alternates: {
        canonical: `${siteConfig.url}/t/${username}`,
      },
    };
  }

  const title = `${profile.fullname || username} | Startup Talent Profile`;

  const description =
    profile.headline ||
    profile.bio?.slice(0, 155) ||
    `View ${profile.fullname || username}'s startup talent profile, skills, projects, experience, and portfolio on CoVisioner.`;

  const image = profile.avatar || profile.user?.avatar || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/t/${username}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/t/${username}`,
      siteName: "CoVisioner",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${profile.fullname || username} talent profile on CoVisioner`,
        },
      ],
      type: "profile",
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

  const personSchema = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.fullname || username,
        url: `${siteConfig.url}/t/${username}`,
        image: profile.avatar || profile.user?.avatar || undefined,
        jobTitle: profile.headline || "Startup Talent",
        description:
          profile.bio ||
          profile.headline ||
          `${profile.fullname || username} talent profile on CoVisioner.`,
        knowsAbout: profile.skills || undefined,
        sameAs: [
          profile.socialLinks?.linkedin,
          profile.socialLinks?.twitter,
          profile.socialLinks?.github,
          profile.socialLinks?.website,
        ].filter(Boolean),
        hasOccupation: {
          "@type": "Occupation",
          name: profile.headline || "Startup Talent",
          skills: profile.skills?.join(", ") || undefined,
        },
      }
    : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <TalentProfileClient />
    </>
  );
}