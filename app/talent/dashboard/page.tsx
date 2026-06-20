"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";
import {
  Briefcase,
  Bookmark,
  Send,
  Search,
  MapPin,
  ArrowRight,
  Building2,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  description: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  skillsRequired: string[];
  startup?: {
    startupName: string;
    logo?: string;
    industry?: string;
  };
}

export default function TalentDashboard() {
  return (
    <ProtectedRoute allowedRole="talent">
      <TalentDashboardContent />
    </ProtectedRoute>
  );
}

function TalentDashboardContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs?search=${search}`);
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyToJob = async (jobId: string) => {
    try {
      await api.post(`/applications/jobs/${jobId}/apply`, {
        coverLetter: "I am interested in this role.",
        resumeUrl: "",
      });

      alert("Applied successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const saveJob = async (jobId: string) => {
    try {
      const res = await api.patch(`/saved-jobs/${jobId}`);
      alert(res.data.message || "Job saved");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save job");
    }
  };

  return (
    <>
    
    <main className="min-h-screen bg-[#F7FAFC] text-[#181C1E]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-[#EEF3F7] p-5 shadow-[0_10px_34px_rgba(24,28,30,0.04)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A6673]">
                Talent Dashboard
              </p>

              <h1 className="mt-2 font-manrope text-3xl font-semibold tracking-tight text-[#002045] sm:text-4xl">
                Find startup jobs
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A6673]">
                Discover startup roles, save opportunities, and apply directly.
              </p>
            </div>

            <div className="w-full rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(24,28,30,0.06)] lg:max-w-xl">
              <div className="flex gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#F1F4F6] px-3 py-2.5">
                  <Search className="h-4 w-4 text-[#002045]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search React, Node, remote..."
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8B96A1]"
                  />
                </div>

                <button
                  onClick={fetchJobs}
                  className="rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A365D]"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Send className="h-5 w-5" />} label="Applications" value="0" />
          <StatCard icon={<Bookmark className="h-5 w-5" />} label="Saved Jobs" value="0" />
          <StatCard icon={<Briefcase className="h-5 w-5" />} label="Available Jobs" value={jobs.length.toString()} />
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A6673]">
                Recommended
              </p>
              <h2 className="mt-1 font-manrope text-xl font-semibold text-[#181C1E]">
                Jobs for you
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl bg-white shadow-[0_10px_34px_rgba(24,28,30,0.05)]"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-[0_10px_34px_rgba(24,28,30,0.05)]">
              <Briefcase className="mx-auto h-10 w-10 text-[#8B96A1]" />
              <h3 className="mt-4 font-manrope text-xl font-semibold">
                No jobs found
              </h3>
              <p className="mt-1 text-sm text-[#5A6673]">
                Try another keyword or search again later.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="group rounded-2xl bg-white p-4 shadow-[0_10px_34px_rgba(24,28,30,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(24,28,30,0.08)] sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F1F4F6]">
                        {job.startup?.logo ? (
                          <img
                            src={job.startup.logo}
                            alt={job.startup.startupName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-7 w-7 text-[#5A6673]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-manrope text-lg font-semibold text-[#181C1E] group-hover:text-[#002045]">
                          {job.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#5A6673]">
                          <span className="font-semibold text-[#002045]">
                            {job.startup?.startupName || "Startup"}
                          </span>

                          {job.startup?.industry && (
                            <span className="rounded-md bg-[#EAF2FF] px-2 py-0.5 text-xs font-bold text-[#002045]">
                              {job.startup.industry}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveJob(job._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F1F4F6] px-3 py-2 text-sm font-semibold text-[#002045] hover:bg-[#EAF2FF] sm:flex-none"
                      >
                        <Bookmark className="h-4 w-4" />
                        Save
                      </button>

                      <button
                        onClick={() => applyToJob(job._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#002045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A365D] sm:flex-none"
                      >
                        Apply
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5A6673]">
                    {job.description}
                  </p>

                  <div className="mt-4 grid gap-2 rounded-xl bg-[#F7FAFC] p-3 sm:grid-cols-3">
                    <Info icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location} />
                    <Info icon={<Briefcase className="h-4 w-4" />} label="Type" value={job.employmentType} />
                    <Info label="Level" value={job.experienceLevel} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skillsRequired?.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#F1F4F6] px-2.5 py-1 text-xs font-semibold text-[#5A6673]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_10px_34px_rgba(24,28,30,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F4F6] text-[#002045]">
          {icon}
        </div>
        <p className="font-manrope text-2xl font-semibold text-[#002045]">
          {value}
        </p>
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#5A6673]">
        {label}
      </p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B96A1]">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-[#181C1E]">{value}</p>
    </div>
  );
}