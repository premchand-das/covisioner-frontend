"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import SharedNavbar from "@/components/SharedNavbar";
import {
  Search,
  Bookmark,
  SlidersHorizontal,
  X,
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
  ChevronDown,
  Users,
  Layers3,
  ArrowUpRight,
} from "lucide-react";

interface Startup {
  _id: string;
  startupName: string;
  slug?: string;
  logo?: string;
  tagline?: string;
  industry?: string;
  location?: string;
}

interface Job {
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
  equityRange?: {
    min?: number;
    max?: number;
    unit?: string;
  };
  startup?: Startup;
  createdAt: string;
  isSaved?: boolean;
}

const employmentOptions = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "remote",
  "Co-founder",
];

const experienceOptions = ["fresher", "junior", "mid", "senior"];

const skillOptions = [
  "react",
  "nextjs",
  "nodejs",
  "mongodb",
  "express",
  "typescript",
  "javascript",
  "python",
  "ui/ux",
  "figma",
];

const salaryOptions = [
  { label: "Any salary", min: "", max: "" },
  { label: "₹10k - ₹30k", min: "10000", max: "30000" },
  { label: "₹30k - ₹60k", min: "30000", max: "60000" },
  { label: "₹60k - ₹1L", min: "60000", max: "100000" },
  { label: "₹1L+", min: "100000", max: "" },
];

export default function ExploreJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [salary, setSalary] = useState({ min: "", max: "" });
  const [sort, setSort] = useState("newest");

  const [pagination, setPagination] = useState({
    totalJobs: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const activeFilterCount = useMemo(() => {
    return (
      employmentType.length +
      experienceLevel.length +
      skills.length +
      (location ? 1 : 0) +
      (salary.min || salary.max ? 1 : 0)
    );
  }, [employmentType, experienceLevel, skills, location, salary]);

  const totalStartups = useMemo(() => {
    const uniqueStartups = new Set(
      jobs
        .map((job) => job.startup?._id || job.startup?.startupName)
        .filter(Boolean)
    );

    return uniqueStartups.size;
  }, [jobs]);

  const totalSkills = useMemo(() => {
    const uniqueSkills = new Set(
      jobs.flatMap((job) => job.skillsRequired || []).filter(Boolean)
    );

    return uniqueSkills.size;
  }, [jobs]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);

      const params: Record<string, string | number> = {
        page,
        limit: 12,
        sort,
      };

      if (search) params.search = search;
      if (location) params.location = location;
      if (employmentType.length) params.employmentType = employmentType.join(",");
      if (experienceLevel.length)
        params.experienceLevel = experienceLevel.join(",");
      if (skills.length) params.skills = skills.join(",");
      if (salary.min) params.minSalary = salary.min;
      if (salary.max) params.maxSalary = salary.max;

      const res = await api.get("/jobs", { params });

      setJobs(res.data.jobs || []);
      setPagination(
        res.data.pagination || {
          totalJobs: 0,
          currentPage: 1,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.log("FETCH JOBS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, location, employmentType, experienceLevel, skills, salary, sort]);

  const toggleValue = (
    value: string,
    selected: string[],
    setSelected: (value: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setEmploymentType([]);
    setExperienceLevel([]);
    setSkills([]);
    setSalary({ min: "", max: "" });
    setSort("newest");
  };

  const FilterContent = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">
            Filters
          </h3>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Refine roles
          </p>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="rounded-full bg-[#F6F5F0] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Location">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remote, Delhi, Mumbai..."
            className="h-11 w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] pl-10 pr-4 text-sm font-medium outline-none focus:border-neutral-950"
          />
        </div>
      </FilterSection>

      <FilterSection title="Job type">
        {employmentOptions.map((item) => (
          <CheckboxFilter
            key={item}
            label={item}
            checked={employmentType.includes(item)}
            onChange={() => toggleValue(item, employmentType, setEmploymentType)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Experience">
        {experienceOptions.map((item) => (
          <CheckboxFilter
            key={item}
            label={item}
            checked={experienceLevel.includes(item)}
            onChange={() =>
              toggleValue(item, experienceLevel, setExperienceLevel)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Salary range">
        <div className="space-y-2">
          {salaryOptions.map((item) => (
            <button
              key={item.label}
              onClick={() => setSalary({ min: item.min, max: item.max })}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                salary.min === item.min && salary.max === item.max
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/[0.06] bg-[#F6F5F0] text-neutral-700 hover:border-neutral-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Skills">
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((item) => (
            <button
              key={item}
              onClick={() => toggleValue(item, skills, setSkills)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                skills.includes(item)
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/[0.06] bg-[#F6F5F0] text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
      <SharedNavbar />

      <section className="relative overflow-hidden border-b border-black/[0.06] bg-[#FBFAF7]">
        <div className="absolute left-[-140px] top-[-180px] h-[420px] w-[420px] rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-120px] top-[-160px] h-[420px] w-[420px] rounded-full bg-[#ECE7DC] blur-3xl" />
        <div className="absolute bottom-[-260px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-sm ring-1 ring-black/[0.06]">
              Startup Roles
            </p>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.08em] text-neutral-950 sm:text-7xl lg:text-[96px] lg:leading-[0.95]">
              Find your next
              <br />
              startup role.
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-500 sm:text-xl">
              Explore high-growth teams, early-stage opportunities, flexible
              roles, founder-led companies and skills-first startup jobs.
            </p>

            <div className="mx-auto mt-10 max-w-5xl rounded-[30px] border border-black/[0.06] bg-white p-2 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
              <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="flex items-center gap-3 rounded-[24px] bg-[#F4F3EF] px-5 py-4 sm:px-6 sm:py-5">
                  <Search className="h-5 w-5 text-neutral-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search jobs, skills, startup..."
                    className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-full min-h-[56px] w-full appearance-none rounded-[24px] border border-black/[0.06] bg-[#F4F3EF] px-5 pr-10 text-sm font-semibold text-neutral-700 outline-none focus:border-neutral-950"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="salaryHighToLow">Salary high to low</option>
                    <option value="salaryLowToHigh">Salary low to high</option>
                    <option value="equityHighToLow">Equity high to low</option>
                    <option value="titleAZ">Title A-Z</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-[24px] bg-neutral-950 px-6 text-sm font-semibold text-white lg:hidden"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
              </div>
            </div>

            {(activeFilterCount > 0 || search) && (
              <div className="mx-auto mt-5 flex max-w-5xl flex-wrap justify-center gap-2">
                {search && (
                  <ActiveChip onClear={() => setSearch("")}>
                    Search: {search}
                  </ActiveChip>
                )}

                {location && (
                  <ActiveChip onClear={() => setLocation("")}>
                    {location}
                  </ActiveChip>
                )}

                {employmentType.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setEmploymentType(
                        employmentType.filter((value) => value !== item)
                      )
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}

                {experienceLevel.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setExperienceLevel(
                        experienceLevel.filter((value) => value !== item)
                      )
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}

                {skills.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setSkills(skills.filter((value) => value !== item))
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}

                {(salary.min || salary.max) && (
                  <ActiveChip
                    onClear={() => setSalary({ min: "", max: "" })}
                  >
                    Salary: ₹{salary.min || "0"} -{" "}
                    {salary.max ? `₹${salary.max}` : "Above"}
                  </ActiveChip>
                )}
              </div>
            )}
{/* 
            <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              <HomeStat
                icon={<Briefcase className="h-4 w-4" />}
                value={`${pagination.totalJobs}`}
                label="Jobs found"
              />
              <HomeStat
                icon={<Users className="h-4 w-4" />}
                value={`${totalStartups}`}
                label="Startups hiring"
              />
              <HomeStat
                icon={<Layers3 className="h-4 w-4" />}
                value={`${totalSkills}`}
                label="Skills matched"
              />
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-[30px] border border-black/[0.06] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Explore opportunities
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-neutral-950 md:text-4xl">
              Open roles from startup teams.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm font-semibold text-neutral-700">
              {pagination.totalJobs} jobs
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:block">
            <div className="h-full overflow-y-auto p-6 pr-4 [scrollbar-width:thin]">
              <FilterContent />
            </div>
          </aside>

          <section className="min-w-0">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-[28px] border border-black/[0.06] bg-white"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F5F0]">
                  <Briefcase className="h-7 w-7 text-neutral-400" />
                </div>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">
                  No jobs found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-500">
                  Try changing your filters, removing salary range, or searching
                  with a broader skill keyword.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      disabled={pagination.currentPage <= 1}
                      onClick={() => fetchJobs(pagination.currentPage - 1)}
                      className="rounded-2xl border border-black/[0.06] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#FBFAF7] disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-600 ring-1 ring-black/[0.06]">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                      disabled={pagination.currentPage >= pagination.totalPages}
                      onClick={() => fetchJobs(pagination.currentPage + 1)}
                      className="rounded-2xl border border-black/[0.06] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#FBFAF7] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-[34px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.04em] text-neutral-950">
                  Filter jobs
                </h2>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  {pagination.totalJobs} jobs available
                </p>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F5F0]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FilterContent />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="sticky bottom-0 mt-7 h-14 w-full rounded-2xl bg-neutral-950 text-sm font-semibold text-white"
            >
              Show {pagination.totalJobs} Jobs
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ActiveChip({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm">
      {children}
      <button onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function HomeStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white/80 px-5 py-5 text-left shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
        {icon}
        {label}
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">
        {value}
      </p>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/[0.06] pb-6 last:border-none last:pb-0">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function CheckboxFilter({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-2xl px-2 py-1.5 text-left transition hover:bg-[#F6F5F0]"
    >
      <span className="capitalize text-sm font-semibold text-neutral-700">
        {label}
      </span>

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
          checked
            ? "border-neutral-950 bg-neutral-950"
            : "border-neutral-300 bg-white"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-sm bg-white" />}
      </span>
    </button>
  );
}

function JobCard({ job }: { job: Job }) {
  const jobHref = `/jobs/${job.slug || job._id}`;
  const startupHref = job.startup?.slug
    ? `/startups/${job.startup.slug}`
    : `/startups/${job.startup?._id}`;

  const [saved, setSaved] = useState(Boolean(job.isSaved));
  const [saving, setSaving] = useState(false);

  const toggleSave = async () => {
    try {
      setSaving(true);

      const res = await api.post(`/saved-jobs/${job._id}/toggle`);

      setSaved(res.data.saved);
    } catch (error) {
      console.log("SAVE JOB ERROR:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-black/[0.06] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="pointer-events-none absolute right-[-70px] top-[-90px] h-44 w-44 rounded-full bg-[#F6F5F0] blur-2xl transition group-hover:bg-[#ECE7DC]" />

      <button
        onClick={toggleSave}
        disabled={saving}
        title={saved ? "Saved" : "Save job"}
        className={`absolute right-5 top-5 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
          saved
            ? "border-neutral-950 bg-neutral-950 text-white shadow-md"
            : "border-black/[0.06] bg-[#F6F5F0] text-neutral-950 hover:bg-neutral-950 hover:text-white"
        }`}
      >
        <Bookmark className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
      </button>

      <div className="relative flex items-start gap-4 pr-14">
        <Link
          href={startupHref}
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#002045] text-lg font-semibold text-white shadow-sm"
        >
          {job.startup?.logo ? (
            <img
              src={job.startup.logo}
              alt={job.startup.startupName}
              className="h-full w-full object-cover"
            />
          ) : (
            job.startup?.startupName?.charAt(0) || "S"
          )}
        </Link>

        <div className="min-w-0">
          <Link
            href={jobHref}
            className="line-clamp-2 text-xl font-semibold tracking-[-0.04em] text-neutral-950 group-hover:text-[#002045]"
          >
            {job.title}
          </Link>

          {job.startup && (
            <Link
              href={startupHref}
              className="mt-1 inline-flex items-center gap-1 truncate text-sm font-semibold text-[#002045]"
            >
              {job.startup.startupName}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <p className="relative mt-5 line-clamp-3 text-sm leading-6 text-neutral-500">
        {job.description}
      </p>

      <div className="relative mt-5 grid gap-3 rounded-[24px] bg-[#FBFAF7] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <MapPin className="h-4 w-4 text-neutral-400" />
          <span>{job.location || "Remote"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <Briefcase className="h-4 w-4 text-neutral-400" />
          <span className="capitalize">
            {job.employmentType} · {job.experienceLevel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <IndianRupee className="h-4 w-4 text-neutral-400" />
          <span>
            ₹{job.salaryRange?.min || 0} - ₹{job.salaryRange?.max || 0}
          </span>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {(job.skillsRequired || []).slice(0, 6).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#F6F5F0] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <Link
        href={jobHref}
        className="relative mt-6 flex h-12 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        View Job
      </Link>
    </article>
  );
}