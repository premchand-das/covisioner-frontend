"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";

type Achievement = {
  title?: string;
  issuer?: string;
  year?: string;
  description?: string;
};

type Milestone = {
  title?: string;
  date?: string;
  description?: string;
};

type TeamMember = {
  user?: {
    _id?: string;
    username?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | string;
  name?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  isFounder?: boolean;
};

type Startup = {
  _id: string;
  startupName: string;
  slug?: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  vision?: string;
  bio?: string;
  mission?: string;
  problemStatement?: string;
  whyJoinUs?: string;
  website?: string;
  industry?: string;
  fundingStage?: string;
  teamSize?: string;
  foundedYear?: number;
  location?: string;
  technologies?: string[];
  achievements?: Achievement[];
  milestones?: Milestone[];
  team?: TeamMember[];
  verifiedBadge?: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    crunchbase?: string;
  };
};

type Job = {
  _id: string;
  title: string;
  description?: string;
  employmentType: string;
  experienceLevel?: string;
  location: string;
  skillsRequired?: string[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
};

const fundingLabels: Record<string, string> = {
  idea: "Idea Stage",
  bootstrapped: "Bootstrapped",
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  "series-c": "Series C",
  profitable: "Profitable",
};

export default function PublicStartupPage() {
  const params = useParams();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchStartup = async () => {
    try {
      setLoading(true);
      setError("");

      const slug = params.slug as string;

      const res = await api.get(`/startups/slug/${slug}`);

      setStartup(res.data.startup);
      setJobs(res.data.openJobs || []);
    } catch (err) {
      console.error("FETCH STARTUP ERROR:", err);
      setError("Unable to load startup.");
    } finally {
      setLoading(false);
    }
  };

  if (params.slug) fetchStartup();
}, [params.slug]);

  const handleApply = async (jobId: string) => {
    try {
      setApplyingId(jobId);
      setError("");

      await api.post(`/applications/jobs/${jobId}/apply`, {
        coverLetter: "I am interested in this role.",
        resumeUrl: "",
      });

      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <SharedNavbar />
        <main className="min-h-screen bg-[#F6F4EF] px-4 py-8">
          <div className="mx-auto max-w-7xl animate-pulse space-y-6">
            <div className="h-96 rounded-[2rem] bg-white" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="h-96 rounded-[2rem] bg-white" />
              <div className="h-96 rounded-[2rem] bg-white" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!startup) {
    return (
      <>
        <SharedNavbar />
        <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] px-4">
          <div className="rounded-[2rem] bg-white px-8 py-7 text-center shadow-xl">
            <p className="text-lg font-black text-neutral-950">
              Startup not found
            </p>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </main>
      </>
    );
  }

  const links = [
    { label: "Website", href: startup.website },
    { label: "LinkedIn", href: startup.socialLinks?.linkedin },
    { label: "GitHub", href: startup.socialLinks?.github },
    { label: "Twitter / X", href: startup.socialLinks?.twitter },
    { label: "Crunchbase", href: startup.socialLinks?.crunchbase },
  ].filter((link) => link.href);

  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F6F4EF] text-neutral-950">
        <section
          className="relative overflow-hidden bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8"
          style={
            startup.coverImage
              ? {
                  backgroundImage: `linear-gradient(rgba(10,10,10,.72), rgba(10,10,10,.9)), url(${startup.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] bg-white/10 ring-4 ring-white/10">
                  {startup.logo ? (
                    <img
                      src={startup.logo}
                      alt={startup.startupName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black">
                      {startup.startupName?.charAt(0) || "S"}
                    </span>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/70">
                    {startup.industry || "Startup"}
                  </div>

                  <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.06em] sm:text-6xl">
                    {startup.startupName}
                    {startup.verifiedBadge ? " ✓" : ""}
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                    {startup.tagline || "Building the next generation company."}
                  </p>

                  {startup.vision && (
                    <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-white">
                      “{startup.vision}”
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2">
                    {startup.location && (
                      <BadgeDark>{startup.location}</BadgeDark>
                    )}

                    {startup.fundingStage && (
                      <BadgeDark>
                        {fundingLabels[startup.fundingStage] ||
                          startup.fundingStage}
                      </BadgeDark>
                    )}

                    {startup.teamSize && (
                      <BadgeDark>{startup.teamSize} team members</BadgeDark>
                    )}

                    {startup.foundedYear && (
                      <BadgeDark>Founded {startup.foundedYear}</BadgeDark>
                    )}
                  </div>
                </div>
              </div>

              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-100 sm:w-fit"
                >
                  Visit Website ↗
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <InfoCard label="Industry" value={startup.industry || "Not added"} />
            <InfoCard
              label="Funding"
              value={fundingLabels[startup.fundingStage || ""] || "Not added"}
            />
            <InfoCard label="Location" value={startup.location || "Remote"} />
            <InfoCard label="Team Size" value={startup.teamSize || "Not added"} />
            <InfoCard
              label="Founded"
              value={startup.foundedYear ? String(startup.foundedYear) : "Not added"}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <Panel title="About Startup">
                <p className="text-sm leading-7 text-neutral-600">
                  {startup.bio || "No description available."}
                </p>
              </Panel>

              <Panel title="Mission">
                <p className="text-sm leading-7 text-neutral-600">
                  {startup.mission || "No mission added yet."}
                </p>
              </Panel>

              <Panel title="Problem Statement">
                <p className="text-sm leading-7 text-neutral-600">
                  {startup.problemStatement || "No problem statement added yet."}
                </p>
              </Panel>

              <Panel title="Why Join Us">
                <p className="text-sm leading-7 text-neutral-600">
                  {startup.whyJoinUs || "No hiring story added yet."}
                </p>
              </Panel>

              <Panel title="Team">
                <div className="grid gap-4 md:grid-cols-2">
                  {startup.team?.length ? (
                    startup.team.map((member, index) => (
                      <TeamCard key={index} member={member} />
                    ))
                  ) : (
                    <Empty>No team members added.</Empty>
                  )}
                </div>
              </Panel>

              <Panel title="Open Positions">
                <div className="mb-5 rounded-3xl bg-[#F6F4EF] px-5 py-4">
                  <p className="text-sm font-black text-neutral-950">
                    {jobs.length} open role{jobs.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid gap-4">
                  {jobs.length > 0 ? (
                    jobs.map((job) => {
                      const applied = appliedJobs.includes(job._id);
                      const applying = applyingId === job._id;

                      return (
                        <article
                          key={job._id}
                          className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5"
                        >
                          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-2xl font-black tracking-[-0.04em]">
                                {job.title}
                              </h3>

                              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                                {job.description || "No description added."}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Badge>{job.employmentType}</Badge>

                                {job.experienceLevel && (
                                  <Badge>{job.experienceLevel}</Badge>
                                )}

                                <Badge>{job.location}</Badge>

                                {job.salaryRange?.min || job.salaryRange?.max ? (
                                  <Badge>
                                    ₹{job.salaryRange?.min || 0} - ₹
                                    {job.salaryRange?.max || 0}
                                  </Badge>
                                ) : null}
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {job.skillsRequired?.map((skill) => (
                                  <Badge key={skill}>{skill}</Badge>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={applying || applied}
                              onClick={() => handleApply(job._id)}
                              className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition md:w-fit ${
                                applied
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-neutral-950 text-white hover:bg-neutral-800"
                              } disabled:cursor-not-allowed disabled:opacity-80`}
                            >
                              {applying
                                ? "Applying..."
                                : applied
                                  ? "Applied ✓"
                                  : "Apply Now →"}
                            </button>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-3xl bg-[#F6F4EF] px-6 py-12 text-center">
                      <p className="text-sm font-bold text-neutral-500">
                        No open positions currently.
                      </p>
                    </div>
                  )}
                </div>
              </Panel>

              <Panel title="Milestones">
                <div className="grid gap-4">
                  {startup.milestones?.length ? (
                    startup.milestones.map((item, index) => (
                      <SmallCard key={index}>
                        <h3 className="font-black">{item.title || "Milestone"}</h3>

                        <p className="mt-1 text-xs font-bold text-neutral-400">
                          {item.date ? formatDate(item.date) : "No date"}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                          {item.description || "No description added."}
                        </p>
                      </SmallCard>
                    ))
                  ) : (
                    <Empty>No milestones added.</Empty>
                  )}
                </div>
              </Panel>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <Panel title="Technologies">
                <div className="flex flex-wrap gap-2">
                  {startup.technologies?.length ? (
                    startup.technologies.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))
                  ) : (
                    <Empty>No technologies added.</Empty>
                  )}
                </div>
              </Panel>

              <Panel title="Links">
                <div className="grid gap-3">
                  {links.length ? (
                    links.map((link) => (
                      <LinkBox
                        key={link.label}
                        href={link.href!}
                        label={link.label}
                      />
                    ))
                  ) : (
                    <Empty>No links added.</Empty>
                  )}
                </div>
              </Panel>

              <Panel title="Achievements">
                <div className="grid gap-3">
                  {startup.achievements?.length ? (
                    startup.achievements.map((item, index) => (
                      <SmallCard key={index}>
                        <h3 className="font-black">
                          {item.title || "Achievement"}
                        </h3>

                        <p className="mt-1 text-xs font-bold text-neutral-400">
                          {item.issuer} {item.year ? `• ${item.year}` : ""}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                          {item.description || "No description added."}
                        </p>
                      </SmallCard>
                    ))
                  ) : (
                    <Empty>No achievements added.</Empty>
                  )}
                </div>
              </Panel>

              <div className="rounded-[2rem] bg-neutral-950 p-6 text-white shadow-xl">
                <h3 className="text-2xl font-black tracking-[-0.04em]">
                  Want to join this startup?
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/65">
                  Apply to an open role and start the conversation with the team.
                </p>

                <button
                  onClick={() =>
                    document
                      .querySelector("#open-positions")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-100"
                >
                  Explore Opportunities
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const userObj = typeof member.user === "object" ? member.user : null;

  const name = member.name || userObj?.username || "Team Member";
  const avatar = member.avatar || userObj?.avatar || "";
  const role = member.role || "Team";
  const links = [
    { label: "LinkedIn", href: member.linkedin },
    { label: "GitHub", href: member.github },
    { label: "Twitter / X", href: member.twitter },
  ].filter((link) => link.href);

  return (
    <SmallCard>
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-black">{name.charAt(0)}</span>
          )}
        </div>

        <div>
          <h3 className="font-black">{name}</h3>

          <p className="mt-1 text-sm font-bold text-neutral-500">{role}</p>

          {member.isFounder && (
            <span className="mt-2 inline-flex rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              Founder
            </span>
          )}
        </div>
      </div>

      {member.bio && (
        <p className="mt-4 text-sm leading-6 text-neutral-600">{member.bio}</p>
      )}

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-neutral-700 hover:bg-neutral-950 hover:text-white"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </SmallCard>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={title === "Open Positions" ? "open-positions" : undefined}
      className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-base font-black">{value}</p>
    </div>
  );
}

function SmallCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-[#F6F4EF] p-5">{children}</div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#F6F4EF] px-3 py-1.5 text-xs font-black text-neutral-700">
      {children}
    </span>
  );
}

function BadgeDark({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white/75">
      {children}
    </span>
  );
}

function LinkBox({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl bg-[#F6F4EF] px-4 py-3 text-sm font-bold hover:bg-neutral-950 hover:text-white"
    >
      {label}
      <span>↗</span>
    </a>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-neutral-400">{children}</p>;
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}


