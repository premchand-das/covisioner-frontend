"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";

interface Job {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  status: string;
  applicantsCount: number;
  skillsRequired: string[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
  equityRange?: {
    min?: number;
    max?: number;
    unit?: string;
  };
}

const employmentTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "remote",
  "Co-founder",
];

const experienceLevels = ["Co-founder","fresher", "junior", "mid", "senior"];

export default function StartupDashboard() {
  return (
    <ProtectedRoute allowedRole="startup">
      <StartupDashboardContent />
    </ProtectedRoute>
  );
}

function StartupDashboardContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    employmentType: "full-time",
    experienceLevel: "junior",
    location: "Remote",
    skillsRequired: "",
    salaryMin: "",
    salaryMax: "",
    equityMin: "",
    equityMax: "",
  });

  const fetchDashboardData = async () => {
    try {
      setError("");

      const jobsRes = await api.get("/jobs/my-jobs");
      setJobs(jobsRes.data.jobs || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPosting(true);

    try {
      await api.post("/jobs", {
        title: form.title.trim(),
        description: form.description.trim(),
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        location: form.location.trim() || "Remote",

        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),

        salaryRange: {
          min: form.salaryMin ? Number(form.salaryMin) : 0,
          max: form.salaryMax ? Number(form.salaryMax) : 0,
        },

        equityRange: {
          min: form.equityMin ? Number(form.equityMin) : 0,
          max: form.equityMax ? Number(form.equityMax) : 0,
          unit: "percent",
        },
      });

      setForm({
        title: "",
        description: "",
        employmentType: "full-time",
        experienceLevel: "junior",
        location: "Remote",
        skillsRequired: "",
        salaryMin: "",
        salaryMax: "",
        equityMin: "",
        equityMax: "",
      });

      await fetchDashboardData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create job");
    } finally {
      setPosting(false);
    }
  };

  const closeJob = async (jobId: string) => {
    try {
      setClosingId(jobId);
      setError("");

      await api.patch(`/jobs/${jobId}/close`);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to close job");
    } finally {
      setClosingId(null);
    }
  };

  if (pageLoading) {
    return (
      <>
        <SharedNavbar />
        <main className="flex min-h-screen items-center justify-center bg-[#F6F5F0]">
          <div className="rounded-[34px] border border-black/[0.06] bg-white px-8 py-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.07)]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
            <p className="text-sm font-semibold text-neutral-500">
              Loading jobs...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10">
          {error && (
            <div className="mb-6 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <section className="h-fit rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.07)] sm:p-8">
              <div className="mb-8 rounded-[28px] bg-neutral-950 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Hiring Studio
                </p>

                <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">
                  Create Job
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
                  Post salary, equity, skills, role details, and expectations
                  for startup talent.
                </p>
              </div>

              <form onSubmit={createJob} className="space-y-5">
                <Input
                  label="Job title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Frontend Developer Intern..... under 120 characters."
                  maxLength={120}
                  required
                />

                <Textarea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe responsibilities, expectations, and what the candidate will build... under 500 characters."
                  minLength={50}
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Employment type"
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    options={employmentTypes}
                  />

                  <Select
                    label="Experience level"
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    options={experienceLevels}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Remote"
                  />

                  <Input
                    label="Skills required"
                    name="skillsRequired"
                    value={form.skillsRequired}
                    onChange={handleChange}
                    placeholder="React, Next.js, Tailwind"
                  />
                </div>

                <div className="rounded-[28px] border border-black/[0.06] bg-[#FBFAF7] p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Compensation
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Min salary"
                      name="salaryMin"
                      type="number"
                      min={0}
                      value={form.salaryMin}
                      onChange={handleChange}
                      placeholder="0"
                    />

                    <Input
                      label="Max salary"
                      name="salaryMax"
                      type="number"
                      min={0}
                      value={form.salaryMax}
                      onChange={handleChange}
                      placeholder="50000"
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Min equity %"
                      name="equityMin"
                      type="number"
                      min={0}
                      step="0.1"
                      value={form.equityMin}
                      onChange={handleChange}
                      placeholder="0"
                    />

                    <Input
                      label="Max equity %"
                      name="equityMax"
                      type="number"
                      min={0}
                      step="0.1"
                      value={form.equityMax}
                      onChange={handleChange}
                      placeholder="2"
                    />
                  </div>
                </div>

                <button
                  disabled={posting}
                  className="w-full rounded-[18px] bg-neutral-950 px-5 py-4 text-sm font-medium text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {posting ? "Posting job..." : "Post Job"}
                </button>
              </form>
            </section>

            <section className="h-fit">
              <div className="mb-5 rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Pipeline
                </p>

                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
                  My Jobs
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Manage posted roles and track applicants.
                </p>

                <Link
                  href="/startup/applications"
                  className="mt-5 inline-flex rounded-[16px] bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  View Applications
                </Link>
              </div>

              <div className="grid gap-4">
                {jobs.map((job) => (
                  <article
                    key={job._id}
                    className="group overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.07)]"
                  >
                    <div className="h-2 bg-neutral-950" />

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold tracking-[-0.05em] text-neutral-950">
                          {job.title}
                        </h3>

                        <StatusBadge status={job.status} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-neutral-500">
                        {job.location} • {job.employmentType} •{" "}
                        {job.experienceLevel}
                      </p>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-500">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.salaryRange?.min || job.salaryRange?.max ? (
                          <span className="rounded-full bg-[#F6F5F0] px-3 py-1.5 text-xs font-semibold text-neutral-800">
                            ₹{job.salaryRange?.min || 0} - ₹
                            {job.salaryRange?.max || 0}
                          </span>
                        ) : null}

                        {job.equityRange?.min || job.equityRange?.max ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            Equity {job.equityRange?.min || 0}% -{" "}
                            {job.equityRange?.max || 0}%
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skillsRequired?.slice(0, 6).map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-[22px] bg-[#F6F5F0] px-4 py-3">
                        <span className="text-sm font-medium text-neutral-500">
                          Applicants
                        </span>

                        <span className="text-lg font-semibold text-neutral-950">
                          {job.applicantsCount || 0}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/jobs/${job.slug || job._id}`}
                          className="rounded-[14px] border border-black/[0.06] bg-[#F6F5F0] px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200"
                        >
                          View
                        </Link>

                        {job.status === "open" && (
                          <button
                            onClick={() => closeJob(job._id)}
                            disabled={closingId === job._id}
                            className="rounded-[14px] border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            {closingId === job._id ? "Closing..." : "Close"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                {jobs.length === 0 && (
                  <div className="rounded-[34px] border border-black/[0.06] bg-white p-10 text-center shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
                    <h3 className="text-3xl font-semibold tracking-[-0.05em]">
                      No jobs posted yet.
                    </h3>

                    <p className="mt-3 text-sm font-medium text-neutral-500">
                      Create your first role and start attracting talent.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#F6F5F0] px-3 py-1.5 text-xs font-semibold text-neutral-700">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "open"
      ? "bg-emerald-50 text-emerald-700"
      : status === "archived"
        ? "bg-neutral-100 text-neutral-500"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${classes}`}
    >
      {status}
    </span>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-900">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-[16px] border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium outline-none placeholder:text-neutral-400 transition focus:border-neutral-950/20 focus:bg-white focus:ring-4 focus:ring-black/5"
      />
    </div>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-900">{label}</label>
      <textarea
        {...props}
        rows={9}
        className="mt-2 w-full resize-none rounded-[16px] border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium outline-none placeholder:text-neutral-400 transition focus:border-neutral-950/20 focus:bg-white focus:ring-4 focus:ring-black/5"
      />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-900">{label}</label>
      <select
        {...props}
        className="mt-2 w-full rounded-[16px] border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium outline-none transition focus:border-neutral-950/20 focus:bg-white focus:ring-4 focus:ring-black/5"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}