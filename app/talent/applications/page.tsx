"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";
import {
  Send,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected" | string;
  createdAt: string;
  job: {
    _id?: string;
    title: string;
    employmentType: string;
    location: string;
    status: string;
  };
  startup: {
    startupName: string;
    logo?: string;
    industry?: string;
  };
}

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute allowedRole="talent">
      <MyApplicationsContent />
    </ProtectedRoute>
  );
}

function MyApplicationsContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/me");
      setApplications(res.data.applications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      return statusFilter === "all" || app.status === statusFilter;
    });
  }, [applications, statusFilter]);

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  return (
    <>
    <SharedNavbar/>
    <main className="min-h-screen bg-[#F8F7F3] text-neutral-950">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <section className="rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.07)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">
                Track every startup application.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-500">
                See where you applied, which startups responded, and what needs
                your next action.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Filter
              </p>

              <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-black/[0.06] bg-[#F6F5F0] p-2 sm:flex">
                {["all", "pending", "accepted", "rejected"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-[16px] px-4 py-2.5 text-xs font-semibold capitalize transition ${
                      statusFilter === status
                        ? "bg-neutral-950 text-white shadow-[0_14px_35px_rgba(0,0,0,0.16)]"
                        : "text-neutral-500 hover:bg-white hover:text-neutral-950"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

        
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Application History
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                {filteredApplications.length} applications found
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-[28px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.04)]"
                />
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-[34px] border border-black/[0.06] bg-white px-6 py-20 text-center shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F6F5F0]">
                <Send className="h-7 w-7 text-neutral-700" />
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">
                No applications found.
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Apply to startup roles and your progress will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((app) => (
                <article
                  key={app._id}
                  className="group rounded-[30px] border border-black/[0.06] bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.07)] sm:p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-5">
                      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#F6F5F0]">
                        {app.startup?.logo ? (
                          <img
                            src={app.startup.logo}
                            alt={app.startup.startupName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-neutral-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-[30px]">
                            {app.job?.title}
                          </h2>

                          <StatusBadge status={app.status} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-500">
                          <span className="text-neutral-900">
                            {app.startup?.startupName || "Startup"}
                          </span>

                          {app.startup?.industry && (
                            <>
                              <span>·</span>
                              <span>{app.startup.industry}</span>
                            </>
                          )}

                          <span>·</span>
                          <span className="capitalize">Job {app.job?.status}</span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          <Info
                            icon={<MapPin className="h-4 w-4" />}
                            label="Location"
                            value={app.job?.location}
                          />
                          <Info
                            icon={<Briefcase className="h-4 w-4" />}
                            label="Type"
                            value={app.job?.employmentType}
                          />
                          <Info
                            icon={<Calendar className="h-4 w-4" />}
                            label="Applied"
                            value={new Date(app.createdAt).toLocaleDateString()}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex lg:flex-col">
                      {app.status === "accepted" && (
                        <button
                          onClick={() => {
                            window.location.href = "/talent/messages";
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                          Message
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      )}

                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    reviewed: "bg-blue-50 text-blue-700 border-blue-100",
    shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "border-black/[0.06] bg-[#F6F5F0] text-neutral-500"
      }`}
    >
      {status}
    </span>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-neutral-950">
        {value || "N/A"}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-[#FBFAF7] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white text-neutral-700">
          {icon}
        </div>

        <p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}