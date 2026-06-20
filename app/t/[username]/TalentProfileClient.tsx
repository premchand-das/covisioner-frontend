"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import SharedNavbar from "@/components/SharedNavbar";

type TalentProfile = {
  _id: string;
  fullname: string;
  headline?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  availability?: "open" | "not-looking";
  verifiedBadge?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    _id: string;
    username: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  experience?: {
    _id?: string;
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  projects?: {
    _id?: string;
    title?: string;
    description?: string;
    techStack?: string[];
    projectUrl?: string;
    githubUrl?: string;
  }[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
};

export default function StartupTalentProfilePage() {
  return (
    <ProtectedRoute allowedRole="startup">
      <StartupTalentProfileContent />
    </ProtectedRoute>
  );
}

function StartupTalentProfileContent() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
const res = await api.get(`/talent/username/${username}`);

setProfile(res.data.profile);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const strength = useMemo(() => {
    if (!profile) return 0;

    const checks = [
      Boolean(profile.avatar || profile.user?.avatar),
      Boolean(profile.fullname),
      Boolean(profile.headline),
      Boolean(profile.bio),
      Boolean(profile.skills?.length),
      Boolean(profile.experience?.length),
      Boolean(profile.projects?.length),
      Boolean(profile.socialLinks?.github),
      Boolean(profile.socialLinks?.linkedin),
      Boolean(profile.socialLinks?.portfolio),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1e8] p-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-24 rounded-[32px] bg-white/80 shadow-sm" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="h-[450px] rounded-[34px] bg-white/80 shadow-sm" />
            <div className="h-[450px] rounded-[34px] bg-white/80 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f6f1e8] p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="rounded-[30px] border border-red-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-red-600">
            Profile unavailable
          </h1>
          <p className="mt-2 text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  const avatar =
    profile.avatar || profile.user?.avatar || "/default-avatar.png";
  const isOpen = profile.availability === "open";

  return (
    <>
      

      <div className="min-h-screen bg-[#f6f1e8] px-4 py-6 text-[#1f1f1f] md:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => router.back()}
            className="mb-6 rounded-full border border-black/10 bg-white/80 px-5 py-2 text-sm font-semibold text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            ← Back to applications
          </button>

          <div className="mb-8 border-b border-dashed border-black/15 pb-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Profile
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              View all profile details here.
            </p>
          </div>
<section className="grid gap-6 lg:grid-cols-[430px_1fr]">
  {/* LEFT PROFILE CARD */}
  <div className="rounded-[34px] border border-black/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(31,31,31,0.08)] backdrop-blur">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight">
        {profile.fullname}
      </h2>

      <p className="mt-1 text-sm font-semibold text-emerald-600">
        {profile.headline || "No headline added yet."}
      </p>
    </div>

    <div className="mx-auto mt-8 flex h-[320px] w-[320px] items-center justify-center rounded-full bg-gradient-to-br from-[#d8d3c9] via-white to-[#c8c1b4] p-5 shadow-inner max-sm:h-[240px] max-sm:w-[240px]">
      <div className="h-full w-full overflow-hidden rounded-full border-[10px] border-white bg-neutral-100 shadow-2xl">
        <img
          src={avatar}
          alt={profile.fullname}
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    <div className="mx-auto mt-7 max-w-sm rounded-[24px] border border-black/10 bg-[#fbf8f1] p-4 text-center">
      <p className="text-sm leading-7 text-neutral-500">
        {profile.headline || "No headline added yet."}
      </p>
    </div>

    <div className="mt-5 rounded-[24px] border border-black/10 bg-[#fbf8f1] p-4">
      <div className="mb-2 flex justify-between text-xs font-semibold text-neutral-500">
        <span>Profile strength</span>
        <span>{strength}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[#1f1f1f]"
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  </div>

  {/* RIGHT DETAILS CARD */}
  <div className="relative rounded-[34px] border border-black/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(31,31,31,0.08)] backdrop-blur">
    <span
      className={`absolute right-7 top-8 h-3 w-3 rounded-full ${
        isOpen
          ? "bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]"
          : "bg-neutral-300"
      }`}
    />

    <h2 className="text-xl font-bold tracking-tight">
      Bio & other details
    </h2>

    {/* FULL WIDTH ABOUT */}
    <div className="mt-7 rounded-[24px] border border-black/10 bg-[#fbf8f1] p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        About
      </p>

      <p className="text-sm leading-8 text-neutral-600">
        {profile.bio || "No bio added"}
      </p>
    </div>

    {/* DETAILS GRID */}
    <div className="mt-7 grid gap-x-10 gap-y-5 md:grid-cols-2">
      <Detail label="Username">
        {profile.user?.username || "Not available"}
      </Detail>

      <Detail label="Email">
        {profile.user?.email || "Not available"}
      </Detail>

      <Detail label="Joined">
        {formatDate(profile.createdAt)}
      </Detail>

      <Detail label="Availability">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
            isOpen
              ? "bg-emerald-100 text-emerald-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOpen ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />

          {isOpen
            ? "Available for Collaboration"
            : "Currently Not Looking"}
        </span>
      </Detail>

      <Detail label="Badges">
        {profile.verifiedBadge ? "🏅 Verified Talent" : "No badge"}
      </Detail>
    </div>

    {/* SKILLS */}
    {profile.skills?.length ? (
      <div className="mt-8 border-t border-black/10 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#f1eadf] px-3 py-1.5 text-xs font-semibold text-neutral-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : (
      <div className="mt-8 border-t border-black/10 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Skills
        </p>
        <Empty>No skills added.</Empty>
      </div>
    )}
  </div>
</section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <main className="space-y-6">
             

             

              <Card title="Experience">
                {profile.experience?.length ? (
                  <div className="space-y-5">
                    {profile.experience.map((exp, index) => (
                      <div
                        key={exp._id || index}
                        className="rounded-[24px] border border-black/10 bg-[#fbf8f1] p-5 transition hover:bg-white hover:shadow-md"
                      >
                        <h3 className="text-lg font-semibold">
                          {exp.title || "Untitled role"}
                        </h3>

                        {exp.company && (
                          <p className="mt-1 text-sm font-medium text-neutral-500">
                            {exp.company}
                          </p>
                        )}

                        {(exp.startDate || exp.endDate) && (
                          <p className="mt-2 text-xs text-neutral-400">
                            {formatDate(exp.startDate)} —{" "}
                            {exp.endDate
                              ? formatDate(exp.endDate)
                              : "Present"}
                          </p>
                        )}

                        {exp.description && (
                          <p className="mt-4 text-sm leading-7 text-neutral-600">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty>No experience added.</Empty>
                )}
              </Card>

              <Card title="Projects">
                {profile.projects?.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {profile.projects.map((project, index) => (
                      <div
                        key={project._id || index}
                        className="rounded-[24px] border border-black/10 bg-[#fbf8f1] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                      >
                        <h3 className="text-lg font-semibold">
                          {project.title || "Untitled project"}
                        </h3>

                        {project.description && (
                          <p className="mt-3 text-sm leading-7 text-neutral-600">
                            {project.description}
                          </p>
                        )}

                        {project.techStack?.length ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 ring-1 ring-black/10"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-6 flex flex-wrap gap-3">
                          {project.projectUrl && (
                            <ExternalButton href={project.projectUrl}>
                              Live Demo ↗
                            </ExternalButton>
                          )}

                          {project.githubUrl && (
                            <ExternalButton href={project.githubUrl}>
                              GitHub ↗
                            </ExternalButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty>No projects added.</Empty>
                )}
              </Card>
            </main>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">


              <Card title="Links">
                <div className="space-y-3">
                  {profile.socialLinks?.portfolio && (
                    <LinkItem
                      href={profile.socialLinks.portfolio}
                      label="Portfolio"
                    />
                  )}

                  {profile.socialLinks?.github && (
                    <LinkItem
                      href={profile.socialLinks.github}
                      label="GitHub"
                    />
                  )}

                  {profile.socialLinks?.linkedin && (
                    <LinkItem
                      href={profile.socialLinks.linkedin}
                      label="LinkedIn"
                    />
                  )}

                  {profile.socialLinks?.twitter && (
                    <LinkItem
                      href={profile.socialLinks.twitter}
                      label="Twitter / X"
                    />
                  )}

                  {!profile.socialLinks?.portfolio &&
                    !profile.socialLinks?.github &&
                    !profile.socialLinks?.linkedin &&
                    !profile.socialLinks?.twitter && (
                      <Empty>No links added.</Empty>
                    )}
                </div>
              </Card>

              <Card title="Availability">
                <div
                  className={`rounded-2xl px-4 py-4 ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {isOpen ? "Open to opportunities" : "Currently not looking"}
                  </p>
                  <p className="mt-1 text-xs opacity-75">
                    Candidate status from profile.
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white/75 p-6 shadow-[0_18px_50px_rgba(31,31,31,0.06)] backdrop-blur">
      <h2 className="mb-5 text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 pb-4">
      <p className="mb-1 text-xs font-medium text-neutral-400">{label}</p>
      <div className="text-sm font-semibold text-neutral-800">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-neutral-400">{children}</p>;
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fbf8f1] p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <div className="text-sm text-neutral-800">{children}</div>
    </div>
  );
}

function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#fbf8f1] px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-[#1f1f1f] hover:text-white"
    >
      {label}
      <span>↗</span>
    </a>
  );
}

function ExternalButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
    >
      {children}
    </a>
  );
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}