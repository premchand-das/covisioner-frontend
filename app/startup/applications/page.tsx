"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";
import Link from "next/link";

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  job: {
    _id: string;
    title: string;
    employmentType: string;
    location: string;
  };
  talent: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  talentProfile: {
    fullname: string;
    headline?: string;
    skills: string[];
    avatar?: string;
  };
}

const statusOptions = ["all", "pending", "reviewed", "accepted", "rejected"];

export default function StartupApplicationsPage() {
  return (
    <ProtectedRoute allowedRole="startup">
      <StartupApplicationsContent />
    </ProtectedRoute>
  );
}

function StartupApplicationsContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/startup");
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const uniqueJobs = useMemo(() => {
    return Array.from(
      new Set(applications.map((app) => app.job?.title).filter(Boolean))
    );
  }, [applications]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      reviewed: applications.filter((a) => a.status === "reviewed").length,
      accepted: applications.filter((a) => a.status === "accepted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  const filteredApplications = applications.filter((app) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      app.talentProfile?.fullname?.toLowerCase().includes(searchText) ||
      app.talent?.username?.toLowerCase().includes(searchText) ||
      app.talent?.email?.toLowerCase().includes(searchText) ||
      app.job?.title?.toLowerCase().includes(searchText) ||
      app.status?.toLowerCase().includes(searchText);

    const matchesJob = jobFilter === "all" || app.job?.title === jobFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  const updateStatus = async (applicationId: string, status: string) => {
    await api.patch(`/applications/${applicationId}/status`, { status });
    fetchApplications();
  };

  const handleMessage = async (applicationId: string) => {
    try {
      const res = await api.post(
        `/conversations/from-application/${applicationId}`
      );

      sessionStorage.setItem("openConversationId", res.data.conversation._id);
      window.location.href = "/startup/messages";
    } catch (error) {
      console.error(error);
    }
  };

  const acceptAndMessage = async (applicationId: string) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: "accepted",
      });

      const conversationRes = await api.post(
        `/conversations/from-application/${applicationId}`
      );

      const conversationId = conversationRes.data.conversation._id;

      await api.post(`/messages/${conversationId}`, {
        text: "Hi, your application has been accepted. Please share your availability for the next step in the hiring process.",
      });

      sessionStorage.setItem("openConversationId", conversationId);
      window.location.href = "/startup/messages";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F4F2EC] text-neutral-950">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10">
          <section className="overflow-hidden rounded-[38px] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)]">
            <div className="relative overflow-hidden bg-neutral-950 px-6 py-8 text-white sm:px-8 lg:px-10">
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Hiring Pipeline
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                    Application Review
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                    Manage every applicant in one clean pipeline. Search,
                    filter, review, accept, reject, and message candidates from
                    a single section.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:w-[560px]">
                  <PipelineStat label="Total" value={stats.total} />
                  <PipelineStat label="Pending" value={stats.pending} />
                  <PipelineStat label="Reviewed" value={stats.reviewed} />
                  <PipelineStat label="Accepted" value={stats.accepted} />
                  <PipelineStat label="Rejected" value={stats.rejected} />
                </div>
              </div>
            </div>

            <div className="border-b border-black/[0.06] bg-[#FBFAF7] p-4 sm:p-5 lg:p-6">
              <div className="grid gap-3 lg:grid-cols-[1fr_260px_220px_auto]">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-400">
                    ⌕
                  </span>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by candidate, email, job, or status..."
                    className="h-14 w-full rounded-[20px] border border-black/[0.06] bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-neutral-400 focus:border-neutral-950/20 focus:ring-4 focus:ring-black/5"
                  />
                </div>

                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="h-14 w-full rounded-[20px] border border-black/[0.06] bg-white px-4 text-sm font-medium outline-none transition focus:border-neutral-950/20 focus:ring-4 focus:ring-black/5"
                >
                  <option value="all">All Applied Jobs</option>
                  {uniqueJobs.map((jobTitle) => (
                    <option key={jobTitle} value={jobTitle}>
                      {jobTitle}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-14 w-full rounded-[20px] border border-black/[0.06] bg-white px-4 text-sm font-medium capitalize outline-none transition focus:border-neutral-950/20 focus:ring-4 focus:ring-black/5"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearch("");
                    setJobFilter("all");
                    setStatusFilter("all");
                  }}
                  className="h-14 rounded-[20px] bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 lg:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Application List
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em]">
                    {filteredApplications.length} candidate
                    {filteredApplications.length === 1 ? "" : "s"} found
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="rounded-[28px] border border-black/[0.06] bg-[#FBFAF7] p-12 text-center text-sm font-medium text-neutral-500">
                  Loading applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-[28px] border border-black/[0.06] bg-[#FBFAF7] px-6 py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-2xl font-semibold shadow-sm">
                    0
                  </div>

                  <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">
                    No applications found.
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Try changing your search, job filter, or status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[28px] border border-black/[0.06]">
                  <div className="hidden grid-cols-[1.3fr_1fr_160px_180px] border-b border-black/[0.06] bg-[#F6F5F0] px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 lg:grid">
                    <span>Candidate</span>
                    <span>Applied For</span>
                    <span>Status</span>
                    <span className="text-right">Actions</span>
                  </div>

                  <div className="divide-y divide-black/[0.06] bg-white">
                    {filteredApplications.map((app) => (
                      <article
                        key={app._id}
                        className="grid gap-5 p-5 transition hover:bg-[#FBFAF7] lg:grid-cols-[1.3fr_1fr_160px_180px] lg:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <Avatar
                            src={app.talentProfile?.avatar || app.talent?.avatar}
                            name={
                              app.talentProfile?.fullname ||
                              app.talent?.username
                            }
                          />

                          <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold tracking-[-0.04em]">
                              {app.talentProfile?.fullname ||
                                app.talent?.username}
                            </h3>

                            <p className="mt-1 truncate text-sm font-medium text-neutral-500">
                              {app.talentProfile?.headline || app.talent?.email}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {app.talentProfile?.skills
                                ?.slice(0, 4)
                                .map((skill) => (
                                  <Badge key={skill}>{skill}</Badge>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-neutral-950">
                            {app.job?.title}
                          </p>
                          <p className="mt-1 text-sm font-medium text-neutral-500">
                            {app.job?.location} • {app.job?.employmentType}
                          </p>
                          <p className="mt-2 text-xs font-medium text-neutral-400">
                            Applied{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <StatusBadge status={app.status} />
                        </div>

                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <Link
                            href={`/t/${app.talent?.username || app.talent?._id}`}
                            className="rounded-[14px] bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                          >
                            Profile
                          </Link>

                          <button
                            onClick={() => handleMessage(app._id)}
                            className="rounded-[14px] border border-black/[0.06] bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100"
                          >
                            Message
                          </button>

                          <div className="flex w-full gap-2 lg:w-auto">


                            <button
                              onClick={() => acceptAndMessage(app._id)}
                              className="flex-1 rounded-[14px] bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => updateStatus(app._id, "rejected")}
                              className="flex-1 rounded-[14px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function PipelineStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">
        {value}
      </p>
    </div>
  );
}

function Avatar({ src, name }: { src?: string; name?: string }) {
  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[20px] bg-[#F6F5F0] shadow-sm ring-1 ring-black/[0.06]">
      {src ? (
        <img
          src={src}
          alt={name || "Talent"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-neutral-950">
          {name?.charAt(0) || "T"}
        </div>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#F6F5F0] px-3 py-1 text-xs font-semibold text-neutral-600">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "accepted"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
        ? "bg-red-50 text-red-700"
        : status === "reviewed"
          ? "bg-blue-50 text-blue-700"
          : "bg-[#F6F5F0] text-neutral-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] ${styles}`}
    >
      {status}
    </span>
  );
}