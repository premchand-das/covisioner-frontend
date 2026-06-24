import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import JobDetailsClient from "./JobDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.job || null;
  } catch {
    return null;
  }
}

function cleanDescription(value?: string) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  const canonical = `${siteConfig.url}/jobs/${slug}`;

  if (!job) {
    return {
      title: "Startup Job",
      description:
        "Explore startup jobs, early-stage roles, and founder-led opportunities on CoVisioner.",
      alternates: {
        canonical,
      },
    };
  }

  const startupName = job.startup?.startupName || "Startup";
  const title = `${job.title} at ${startupName} | Startup Job`;
  const description =
    cleanDescription(job.description) ||
    `Apply for ${job.title} at ${startupName}. Explore startup jobs, salary, equity, skills, and team details on CoVisioner.`;

  const image = job.startup?.logo || siteConfig.ogImage;

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
          alt: `${job.title} at ${startupName}`,
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

export default async function JobPage({ params }: Props) {
  const { slug } = await params;

  return <JobDetailsClient slug={slug} />;
}