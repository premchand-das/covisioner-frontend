"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowUpRight,
  Building2,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  Layers3,
  Users,
} from "lucide-react";

interface Startup {
  _id: string;
  startupName: string;
  slug?: string;
  logo?: string;
  tagline?: string;
  bio?: string;
  website?: string;
  industry?: string;
  fundingStage?: string;
  location?: string;
  technologies?: string[];
  openJobsCount?: number;
  createdAt?: string;
}

export default function ExploreStartupsPage() {
  const [allStartups, setAllStartups] = useState<Startup[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [fundingStage, setFundingStage] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [technology, setTechnology] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const activeFilterCount =
    industry.length +
    fundingStage.length +
    technology.length +
    (location.trim() ? 1 : 0);

  const normalize = (value: unknown) => String(value || "").trim();

  const uniqueValues = (values: Array<string | undefined>) => {
    const map = new Map<string, string>();

    values.forEach((value) => {
      const cleanValue = normalize(value);
      if (!cleanValue) return;
      map.set(cleanValue.toLowerCase(), cleanValue);
    });

    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  };

  const industries = useMemo(
    () => uniqueValues(allStartups.map((s) => s.industry)),
    [allStartups]
  );

  const fundingStages = useMemo(
    () => uniqueValues(allStartups.map((s) => s.fundingStage)),
    [allStartups]
  );

  const locations = useMemo(
    () => uniqueValues(allStartups.map((s) => s.location)),
    [allStartups]
  );

  const technologies = useMemo(
    () => uniqueValues(allStartups.flatMap((s) => s.technologies || [])),
    [allStartups]
  );

  const totalOpenRoles = useMemo(
    () => startups.reduce((sum, item) => sum + (item.openJobsCount || 0), 0),
    [startups]
  );

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string> = {};

      if (search.trim()) params.search = search.trim();
      if (industry.length) params.industry = industry.join(",");
      if (fundingStage.length) params.fundingStage = fundingStage.join(",");
      if (location.trim()) params.location = location.trim();
      if (technology.length) params.technology = technology.join(",");
      if (sort) params.sort = sort;

      const res = await api.get("/startups", { params });

      const startupsData = res.data.startups || [];

      setStartups(startupsData);
      setAllStartups(startupsData);
      setTotalCount(res.data.count ?? startupsData.length);
    } catch (err: any) {
      console.log("FETCH STARTUPS ERROR:", err);
      setError(err.response?.data?.message || "Failed to load startups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStartups();
    }, 350);

    return () => clearTimeout(timer);
  }, [search, industry, fundingStage, location, technology, sort]);

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
    setIndustry([]);
    setFundingStage([]);
    setLocation("");
    setTechnology([]);
    setSort("newest");
  };

  const FilterContent = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">
          Filters
        </h3>

        {(activeFilterCount > 0 || search || sort !== "newest") && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-950"
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
            className="h-12 w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] pl-10 pr-4 text-sm font-medium outline-none focus:border-neutral-950"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {locations.slice(0, 8).map((item) => (
            <FilterPill
              key={item}
              active={location === item}
              onClick={() => setLocation(location === item ? "" : item)}
            >
              {item}
            </FilterPill>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Industry">
        {industries.length === 0 ? (
          <p className="text-sm font-medium text-neutral-400">No industries</p>
        ) : (
          <div className="space-y-3">
            {industries.slice(0, 14).map((item) => (
              <CheckboxFilter
                key={item}
                label={item}
                checked={industry.includes(item)}
                onChange={() => toggleValue(item, industry, setIndustry)}
              />
            ))}
          </div>
        )}
      </FilterSection>

      <FilterSection title="Funding stage">
        {fundingStages.length === 0 ? (
          <p className="text-sm font-medium text-neutral-400">
            No funding stages
          </p>
        ) : (
          <div className="space-y-3">
            {fundingStages.map((item) => (
              <CheckboxFilter
                key={item}
                label={item}
                checked={fundingStage.includes(item)}
                onChange={() =>
                  toggleValue(item, fundingStage, setFundingStage)
                }
              />
            ))}
          </div>
        )}
      </FilterSection>

      <FilterSection title="Technology">
        {technologies.length === 0 ? (
          <p className="text-sm font-medium text-neutral-400">
            No technologies
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {technologies.slice(0, 32).map((tech) => (
              <FilterPill
                key={tech}
                active={technology.includes(tech)}
                onClick={() => toggleValue(tech, technology, setTechnology)}
              >
                {tech}
              </FilterPill>
            ))}
          </div>
        )}
      </FilterSection>
    </div>
  );

return (
  <>
    <SharedNavbar />

    <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
      <section className="relative overflow-hidden border-b border-black/[0.06] bg-[#FBFAF7]">
        <div className="absolute left-[-140px] top-[-180px] h-[420px] w-[420px] rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-120px] top-[-160px] h-[420px] w-[420px] rounded-full bg-[#ECE7DC] blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-sm ring-1 ring-black/[0.06]">
              Startup Directory
            </p>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.08em] text-neutral-950 sm:text-7xl lg:text-[96px] lg:leading-[0.95]">
              Discover the next
              <br />
              generation of startups.
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-500 sm:text-xl">
              Connect with ambitious founders, explore innovative companies,
              discover opportunities and become part of the future of work.
            </p>

            <div className="mx-auto mt-10 max-w-4xl rounded-[30px] border border-black/[0.06] bg-white p-2 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
              <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="flex items-center gap-3 rounded-[24px] bg-[#F4F3EF] px-5 py-4 sm:px-6 sm:py-5">
                  <Search className="h-5 w-5 text-neutral-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search startup, industry, city, tech..."
                    className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-full min-h-[56px] w-full appearance-none rounded-[24px] border border-black/[0.06] bg-[#F4F3EF] px-5 text-sm font-semibold text-neutral-700 outline-none focus:border-neutral-950"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="nameAZ">Name A-Z</option>
                    <option value="nameZA">Name Z-A</option>
                    <option value="jobsHigh">Most open jobs</option>
                    <option value="jobsLow">Fewest open jobs</option>
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
              <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">
                {search && (
                  <ActiveChip onClear={() => setSearch("")}>
                    Search: {search}
                  </ActiveChip>
                )}

                {industry.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setIndustry(industry.filter((value) => value !== item))
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}

                {fundingStage.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setFundingStage(
                        fundingStage.filter((value) => value !== item)
                      )
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}

                {location && (
                  <ActiveChip onClear={() => setLocation("")}>
                    {location}
                  </ActiveChip>
                )}

                {technology.map((item) => (
                  <ActiveChip
                    key={item}
                    onClear={() =>
                      setTechnology(
                        technology.filter((value) => value !== item)
                      )
                    }
                  >
                    {item}
                  </ActiveChip>
                ))}
              </div>
            )}

            {/* <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              <HomeStat
                icon={<Building2 className="h-4 w-4" />}
                value={`${totalCount}`}
                label="Startups found"
              />
              <HomeStat
                icon={<Briefcase className="h-4 w-4" />}
                value={`${totalOpenRoles}`}
                label="Open roles"
              />
              <HomeStat
                icon={<Layers3 className="h-4 w-4" />}
                value={`${industries.length}`}
                label="Industries"
              />
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="sticky top-24 hidden h-fit rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:block">
            <FilterContent />
          </aside>

          <section>
            {loading && (
              <div className="grid gap-5 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[330px] animate-pulse rounded-[28px] border border-black/[0.06] bg-white"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && startups.length === 0 && (
              <div className="rounded-[32px] border border-dashed border-black/10 bg-white px-6 py-16 text-center">
                <Building2 className="mx-auto h-10 w-10 text-neutral-400" />
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                  No startups found
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Try changing your filters or search keyword.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && startups.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                {startups.map((startup) => (
                  <StartupCard key={startup._id} startup={startup} />
                ))}
              </div>
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
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-neutral-950">
                Filter startups
              </h2>

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
              Show {totalCount} Startups
            </button>
          </div>
        </div>
      )}
    </main>
  </>
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

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-black/[0.06] bg-[#F6F5F0] text-neutral-600 hover:border-neutral-300"
      }`}
    >
      {children}
    </button>
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
    <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#F6F5F0] px-3 py-1.5 text-xs font-semibold text-neutral-700">
      {children}
      <button onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startups/${startup.slug || startup._id}`}
      className="group rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start gap-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#F6F5F0]">
          {startup.logo ? (
            <img
              src={startup.logo}
              alt={startup.startupName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-8 w-8 text-neutral-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-950">
                {startup.startupName}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                {startup.tagline || "Modern startup hiring ambitious talent."}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-[#F6F5F0] text-neutral-500 transition group-hover:bg-neutral-950 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 line-clamp-3 text-sm leading-7 text-neutral-500">
        {startup.bio ||
          "Explore this startup profile, learn what they are building, and discover open opportunities."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {startup.industry && <Tag>{startup.industry}</Tag>}
        {startup.fundingStage && <Tag>{startup.fundingStage}</Tag>}

        {startup.technologies?.slice(0, 4).map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>

      <div className="mt-7 grid gap-4 border-t border-black/[0.06] pt-6 sm:grid-cols-2">
        <Info
          icon={<MapPin className="h-4 w-4" />}
          label="Location"
          value={startup.location || "Remote"}
        />

        <Info
          icon={<Briefcase className="h-4 w-4" />}
          label="Open roles"
          value={`${startup.openJobsCount || 0} jobs available`}
        />
      </div>
    </Link>
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
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
        {title}
      </h4>

      <div>{children}</div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/[0.06] bg-[#F6F5F0] px-3 py-1.5 text-xs font-semibold text-neutral-600">
      {children}
    </span>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-neutral-950">
        {value}
      </p>
    </div>
  );
}