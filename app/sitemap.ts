import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://covisioner.com";
const apiUrl =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL 
 

async function safeFetch(path: string) {
  try {
    const res = await fetch(`${apiUrl}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();

    if (Array.isArray(data)) return data;
    return data.jobs || data.startups || data.talent || data.talents || [];
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
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.slug || job._id}`,
      lastModified: new Date(job.updatedAt || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),

    ...startups.map((startup: any) => ({
      url: `${baseUrl}/startups/${startup.slug || startup._id}`,
      lastModified: new Date(startup.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...talents.map((talent: any) => ({
      url: `${baseUrl}/t/${talent.username}`,
      lastModified: new Date(talent.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}