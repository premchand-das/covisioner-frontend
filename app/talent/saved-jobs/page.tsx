"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Bookmark, MapPin, Briefcase, IndianRupee, SaveIcon } from "lucide-react";

interface SavedJob {
  _id: string;
  job: {
    _id: string;
    title: string;
    slug?: string;
    description: string;
    skillsRequired: string[];
    employmentType: string;
    experienceLevel: string;
    location: string;
    salaryRange?: {
      min?: number;
      max?: number;
    };
    startup?: {
      _id: string;
      startupName: string;
      slug?: string;
      logo?: string;
    };
  };
}

export default function SavedJobsPage() {
  return (
    <ProtectedRoute allowedRole="talent">
      <SavedJobsContent />
    </ProtectedRoute>
  );
}

function SavedJobsContent() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/saved-jobs");
      setSavedJobs(res.data.savedJobs || []);
    } catch (error) {
      console.log("FETCH SAVED JOBS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId: string) => {
    try {
      await api.post(`/saved-jobs/${jobId}/toggle`);
      setSavedJobs((prev) => prev.filter((item) => item.job._id !== jobId));
    } catch (error) {
      console.log("REMOVE SAVED JOB ERROR:", error);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
      <SharedNavbar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
            Saved Jobs
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-neutral-950">
            Your saved opportunities
          </h1>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[28px] bg-white"
              />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center">
            <SaveIcon className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">
              No saved jobs yet
            </h3>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Save jobs you like and come back later.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedJobs.map(({ job }) => {
              if (!job) return null;

              const jobHref = `/jobs/${job.slug || job._id}`;

              return (
                <article
                  key={job._id}
                  className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#002045] text-lg font-semibold text-white">
                        {job.startup?.logo ? (
                          <img
                            src={job.startup.logo}
                            alt={job.startup.startupName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          job.startup?.startupName?.charAt(0) || "S"
                        )}
                      </div>

                      <div>
                        <Link
                          href={jobHref}
                          className="line-clamp-2 text-lg font-semibold tracking-[-0.03em] text-neutral-950"
                        >
                          {job.title}
                        </Link>

                        <p className="mt-1 text-sm font-semibold text-[#002045]">
                          {job.startup?.startupName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeSavedJob(job._id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#F6F5F0] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                    >
                      <Bookmark className="h-5 w-5" fill="currentColor" />
                    </button>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-500">
                    {job.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || "Remote"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">
                        {job.employmentType} · {job.experienceLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>
                        ₹{job.salaryRange?.min || 0} - ₹
                        {job.salaryRange?.max || 0}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={jobHref}
                    className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    View Job
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}