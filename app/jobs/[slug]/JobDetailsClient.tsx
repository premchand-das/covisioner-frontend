"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Bookmark,
  Send,
  Globe,
  Sparkles,
  IndianRupee,
  BadgePercent,
  ExternalLink,
  Layers,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  slug: string;
  description: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  skillsRequired: string[];
  createdAt?: string;
  updatedAt?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  equityRange?: {
    min: number;
    max: number;
  };
  startup?: {
    _id: string;
    slug?: string;
    startupName: string;
    logo?: string;
    industry?: string;
    website?: string;
    tagline?: string;
  };
}

export default function JobDetailsClient({ slug }: { slug: string }) {
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${slug}`);
        setJob(res.data.job);
      } catch (error) {
        console.error("FETCH JOB ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchJob();
  }, [slug]);

  const applyToJob = async () => {
    if (!job) return;

    try {
      await api.post(`/applications/jobs/${job._id}/apply`, {
        coverLetter: "I am interested in this role.",
        resumeUrl: "",
      });

      alert("Applied successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const saveJob = async () => {
    if (!job) return;

    try {
      const res = await api.patch(`/saved-jobs/${job._id}`);
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F3]">
        <div className="rounded-[28px] bg-white px-8 py-6 text-sm font-semibold text-neutral-500 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
          Loading job details...
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F3] px-5">
        <div className="max-w-md rounded-[32px] bg-white p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
          <Briefcase className="mx-auto h-10 w-10 text-neutral-400" />
          <h1 className="mt-5 text-2xl font-bold">Job not found</h1>
          <p className="mt-2 text-sm text-neutral-500">
            This job may be closed or removed.
          </p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex rounded-2xl bg-[#002045] px-5 py-3 text-sm font-bold text-white"
          >
            Explore Jobs
          </Link>
        </div>
      </main>
    );
  }

  const startupHref = job.startup?.slug
    ? `/startups/${job.startup.slug}`
    : "#";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jobUrl = `${siteUrl}/jobs/${job.slug || slug}`;

  const normalizedEmploymentType =
    job.employmentType === "full-time"
      ? "FULL_TIME"
      : job.employmentType === "part-time"
      ? "PART_TIME"
      : job.employmentType === "contract"
      ? "CONTRACTOR"
      : job.employmentType === "internship"
      ? "INTERN"
      : job.employmentType === "remote"
      ? "FULL_TIME"
      : "OTHER";

  const isRemote =
    job.employmentType?.toLowerCase() === "remote" ||
    job.location?.toLowerCase().includes("remote");

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt || new Date().toISOString(),
    validThrough: job.updatedAt || undefined,
    employmentType: normalizedEmploymentType,
    url: jobUrl,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: job.startup?.startupName || "CoVisioner Startup",
      sameAs: job.startup?.website || undefined,
      logo: job.startup?.logo || undefined,
    },
    jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: isRemote
      ? {
          "@type": "Country",
          name: "India",
        }
      : undefined,
    jobLocation: !isRemote
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "India",
            addressCountry: "IN",
          },
        }
      : undefined,
    baseSalary:
      job.salaryRange?.min || job.salaryRange?.max
        ? {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryRange?.min || undefined,
              maxValue: job.salaryRange?.max || undefined,
              unitText: "MONTH",
            },
          }
        : undefined,
    skills: job.skillsRequired?.join(", "),
    industry: job.startup?.industry || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobSchema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-[#F8F7F3] text-[#111111]">
        <section className="border-b border-black/[0.06] bg-[#FBFAF7]">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <button
              onClick={() => router.back()}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-5 py-3 text-sm font-bold text-neutral-600 shadow-sm transition hover:bg-[#F4F3EF] hover:text-neutral-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="rounded-[36px] border border-black/[0.06] bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.06)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <Link
                    href={startupHref}
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#F5F4F0] transition hover:scale-[1.03]"
                  >
                    {job.startup?.logo ? (
                      <img
                        src={job.startup.logo}
                        alt={job.startup.startupName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-neutral-400" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F3EF] px-3 py-1.5 text-xs font-bold text-neutral-500">
                        <Sparkles className="h-3.5 w-3.5" />
                        Startup Role
                      </span>

                      {job.startup?.industry && (
                        <span className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-neutral-500">
                          {job.startup.industry}
                        </span>
                      )}
                    </div>

                    <h1 className="text-4xl font-black tracking-[-0.06em] text-neutral-950 sm:text-5xl lg:text-6xl">
                      {job.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-500">
                      {job.startup?._id && (
                        <Link
                          href={startupHref}
                          className="inline-flex items-center gap-1.5 text-[#002045] transition hover:underline"
                        >
                          {job.startup.startupName}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}

                      <span>•</span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>

                      <span>•</span>
                      <span>{job.employmentType}</span>

                      <span>•</span>
                      <span>{job.experienceLevel}</span>
                    </div>

                    {job.startup?.tagline && (
                      <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-500">
                        {job.startup.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard
                    icon={IndianRupee}
                    label="Salary"
                    value={
                      job.salaryRange
                        ? `₹${job.salaryRange.min} - ₹${job.salaryRange.max}`
                        : "Not disclosed"
                    }
                  />

                  <InfoCard
                    icon={BadgePercent}
                    label="Equity"
                    value={
                      job.equityRange
                        ? `${job.equityRange.min}% - ${job.equityRange.max}%`
                        : "Not offered"
                    }
                  />

                  <InfoCard
                    icon={MapPin}
                    label="Location"
                    value={job.location}
                  />

                  <InfoCard
                    icon={Briefcase}
                    label="Experience"
                    value={job.experienceLevel}
                  />
                </div>
              </div>

              <aside className="lg:sticky lg:top-24">
                <div className="rounded-[34px] border border-black/[0.06] bg-white p-5 shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
                  <button
                    onClick={applyToJob}
                    className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#002045] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#00162f]"
                  >
                    <Send className="h-4 w-4" />
                    Apply Now
                  </button>

                  <button
                    onClick={saveJob}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#F4F3EF] px-6 py-4 text-sm font-black text-neutral-800 transition hover:bg-neutral-200"
                  >
                    <Bookmark className="h-4 w-4" />
                    Save Job
                  </button>

                  {job.startup && (
                    <Link
                      href={startupHref}
                      className="mt-5 block rounded-[26px] border border-black/[0.06] bg-[#FBFAF7] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white">
                          {job.startup.logo ? (
                            <img
                              src={job.startup.logo}
                              alt={job.startup.startupName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-neutral-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-neutral-950">
                            {job.startup.startupName}
                          </h3>
                          <p className="truncate text-sm font-semibold text-neutral-500">
                            {job.startup.industry || "Startup"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm font-bold text-[#002045]">
                        View startup profile
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </Link>
                  )}

                  {job.startup?.website && (
                    <Link
                      href={job.startup.website}
                      target="_blank"
                      className="mt-3 flex items-center justify-center gap-2 rounded-[20px] border border-black/[0.06] bg-white px-5 py-3 text-sm font-bold text-neutral-700 transition hover:bg-[#F4F3EF]"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Link>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
          <div className="space-y-8">
            <section className="rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_70px_rgba(0,0,0,0.04)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F3EF]">
                  <Layers className="h-5 w-5 text-neutral-500" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                    Role Overview
                  </p>
                  <h2 className="text-2xl font-black tracking-[-0.04em]">
                    About this role
                  </h2>
                </div>
              </div>

              <div className="mt-7 whitespace-pre-wrap text-base leading-8 text-neutral-600">
                {job.description}
              </div>
            </section>

            <section className="rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_70px_rgba(0,0,0,0.04)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                Required Skills
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                Skills you need
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {job.skillsRequired?.length ? (
                  job.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-2xl border border-black/[0.06] bg-[#F8F7F3] px-4 py-2 text-sm font-bold text-neutral-600"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    No skills added for this role.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.04] bg-[#F8F7F3] p-5">
      <Icon className="h-5 w-5 text-neutral-400" />

      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-neutral-950">{value}</p>
    </div>
  );
}