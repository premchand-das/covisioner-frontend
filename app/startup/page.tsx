"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
 
  Globe,
  
  Mail,
  User,
} from "lucide-react";

interface TalentProfile {
  _id: string;
  fullname: string;
  headline?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  availability?: "open" | "not-looking";
  verifiedBadge?: boolean;
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
}

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

  const userId = params.userId as string;

  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/profile/${userId}`);
        setProfile(res.data.profile);
      } catch (err: any) {
        console.error("FETCH TALENT PROFILE ERROR:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load talent profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] px-6 py-10">
        <p className="text-sm text-neutral-500">Loading talent profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-3xl border border-red-100 bg-white p-8">
          <h1 className="text-xl font-semibold text-red-600">
            Profile unavailable
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  const avatar =
    profile.avatar || profile.user?.avatar || "/default-avatar.png";

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to applications
        </button>

        <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
          <div className="bg-black px-8 py-10 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <img
                src={avatar}
                alt={profile.fullname}
                className="h-28 w-28 rounded-3xl border border-white/20 object-cover"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {profile.fullname}
                  </h1>

                  {profile.verifiedBadge && (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      Verified
                    </span>
                  )}
                </div>

                {profile.headline && (
                  <p className="mt-2 max-w-2xl text-white/70">
                    {profile.headline}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-white/10 px-4 py-2">
                    Availability:{" "}
                    {profile.availability === "open"
                      ? "Open to work"
                      : "Not looking"}
                  </span>

                  {profile.user?.email && (
                    <a
                      href={`mailto:${profile.user.email}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/15"
                    >
                      <Mail size={15} />
                      {profile.user.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr]">
            <main className="space-y-6">
              <Card title="About">
                {profile.bio ? (
                  <p className="leading-7 text-neutral-700">{profile.bio}</p>
                ) : (
                  <Empty>No bio added.</Empty>
                )}
              </Card>

              <Card title="Skills">
                {profile.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Empty>No skills added.</Empty>
                )}
              </Card>

              <Card title="Experience">
                {profile.experience?.length ? (
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div
                        key={exp._id || index}
                        className="rounded-2xl border border-black/10 bg-neutral-50 p-5"
                      >
                        <div className="flex items-start gap-3">
                          <Briefcase className="mt-1 h-5 w-5 text-neutral-500" />
                          <div>
                            <h3 className="font-semibold text-neutral-950">
                              {exp.title || "Untitled role"}
                            </h3>
                            {exp.company && (
                              <p className="text-sm text-neutral-500">
                                {exp.company}
                              </p>
                            )}
                            {exp.description && (
                              <p className="mt-3 text-sm leading-6 text-neutral-700">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
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
                        className="rounded-2xl border border-black/10 bg-neutral-50 p-5"
                      >
                        <h3 className="font-semibold text-neutral-950">
                          {project.title || "Untitled project"}
                        </h3>

                        {project.description && (
                          <p className="mt-2 text-sm leading-6 text-neutral-600">
                            {project.description}
                          </p>
                        )}

                        {project.techStack?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-white px-2.5 py-1 text-xs text-neutral-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-5 flex gap-3">
                          {project.projectUrl && (
                            <LinkButton href={project.projectUrl}>
                              <ExternalLink size={14} />
                              Live
                            </LinkButton>
                          )}

                          {project.githubUrl && (
                            <LinkButton href={project.githubUrl}>
                              <Globe size={14} />
                              Code
                            </LinkButton>
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

            <aside className="space-y-6">
              <Card title="Contact">
                <div className="space-y-3 text-sm">
                  {profile.user?.username && (
                    <InfoRow icon={<User size={16} />} label="Username">
                      {profile.user.username}
                    </InfoRow>
                  )}

                  {profile.user?.email && (
                    <InfoRow icon={<Mail size={16} />} label="Email">
                      <a
                        href={`mailto:${profile.user.email}`}
                        className="text-black underline underline-offset-4"
                      >
                        {profile.user.email}
                      </a>
                    </InfoRow>
                  )}
                </div>
              </Card>

              <Card title="Links">
                <div className="space-y-3">
                  {profile.socialLinks?.portfolio && (
                    <SocialLink
                      href={profile.socialLinks.portfolio}
                      icon={<Globe size={16} />}
                      label="Portfolio"
                    />
                  )}

                  {profile.socialLinks?.github && (
                    <SocialLink
                      href={profile.socialLinks.github}
                      icon={<Globe size={16} />}
                      label="Github"
                    />
                  )}

                  {profile.socialLinks?.linkedin && (
                    <SocialLink
                      href={profile.socialLinks.linkedin}
                      icon={<Globe size={16} />}
                      label="LinkedIn"
                    />
                  )}

                  {!profile.socialLinks?.portfolio &&
                    !profile.socialLinks?.github &&
                    !profile.socialLinks?.linkedin && (
                      <Empty>No links added.</Empty>
                    )}
                </div>
              </Card>

              <Card title="Resume">
                <Empty>
                  Resume field is not available in current backend model.
                </Empty>
              </Card>
            </aside>
          </div>
        </section>
      </div>
    </div>
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
    <section className="rounded-3xl border border-black/10 bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-neutral-950">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-neutral-400">{children}</p>;
}

function LinkButton({
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
      className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
    >
      {children}
    </a>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm hover:bg-neutral-50"
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ExternalLink size={14} />
    </a>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
        {icon}
        {label}
      </div>
      <div className="text-neutral-800">{children}</div>
    </div>
  );
}