import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const revalidate = 3600;

const BASE_URL = siteConfig.url;
const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api";

async function safeFetch(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    if (Array.isArray(data)) return data;

    return (
      data.jobs ||
      data.startups ||
      data.talent ||
      data.talents ||
      data.profiles ||
      []
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, startups, talents] = await Promise.all([
    safeFetch("/jobs"),
    safeFetch("/startups"),
    safeFetch("/talent/public"),
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/talent/explore/startups`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/talent/explore/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },

    ...startups.map((startup: any) => ({
      url: `${BASE_URL}/startups/${startup.slug || startup._id}`,
      lastModified: startup.updatedAt ? new Date(startup.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    ...jobs.map((job: any) => ({
      url: `${BASE_URL}/jobs/${job.slug || job._id}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),

    ...talents
      .filter((talent: any) => talent.username)
      .map((talent: any) => ({
        url: `${BASE_URL}/t/${talent.username}`,
        lastModified: talent.updatedAt
          ? new Date(talent.updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ];
}