"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUpload from "@/components/ImageUpload";
import SharedNavbar from "@/components/SharedNavbar";
import api from "@/lib/api";
import {
  User,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  X,
  Save,
  BadgeCheck,
} from "lucide-react";

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubUrl: string;
}

interface TalentProfile {
  avatar: string;
  fullname: string;
  headline: string;
  bio: string;
  skills: string[];
  availability: string;
  experience: Experience[];
  projects: Project[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export default function TalentProfilePage() {
  return (
    <ProtectedRoute allowedRole="talent">
      <TalentProfileContent />
    </ProtectedRoute>
  );
}

function TalentProfileContent() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  const [form, setForm] = useState<TalentProfile>({
    avatar: "",
    fullname: "",
    headline: "",
    bio: "",
    skills: [],
    availability: "open",
    experience: [],
    projects: [],
    socialLinks: {
      github: "",
      linkedin: "",
      portfolio: "",
      twitter: "",
    },
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      const profile = res.data.profile || res.data;

      const data: TalentProfile = {
        avatar: profile.avatar || "",
        fullname: profile.fullname || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        availability: profile.availability || "open",
        experience:
          profile.experience?.map((exp: any) => ({
            title: exp.title || "",
            company: exp.company || "",
            startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
            endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
            description: exp.description || "",
          })) || [],
        projects:
          profile.projects?.map((project: any) => ({
            title: project.title || "",
            description: project.description || "",
            techStack: project.techStack || [],
            projectUrl: project.projectUrl || "",
            githubUrl: project.githubUrl || "",
          })) || [],
        socialLinks: {
          github: profile.socialLinks?.github || "",
          linkedin: profile.socialLinks?.linkedin || "",
          portfolio: profile.socialLinks?.portfolio || "",
          twitter: profile.socialLinks?.twitter || "",
        },
      };

      setForm(data);
      setSkillsInput(data.skills.join(", "));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const strength = useMemo(() => {
    const checks = [
      Boolean(form.avatar),
      Boolean(form.fullname),
      Boolean(form.headline),
      Boolean(form.bio),
      Boolean(form.skills.length),
      Boolean(form.experience.length),
      Boolean(form.projects.length),
      Boolean(form.socialLinks.github),
      Boolean(form.socialLinks.linkedin),
      Boolean(form.socialLinks.portfolio),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  const parsedSkills = useMemo(() => {
    return skillsInput
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 30);
  }, [skillsInput]);

  const isOpen = form.availability === "open";

  const addExperience = () => {
    if (form.experience.length >= 20) return;

    setForm({
      ...form,
      experience: [
        ...form.experience,
        { title: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    });
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, experience: updated });
  };

  const removeExperience = (index: number) => {
    setForm({
      ...form,
      experience: form.experience.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    if (form.projects.length >= 20) return;

    setForm({
      ...form,
      projects: [
        ...form.projects,
        {
          title: "",
          description: "",
          techStack: [],
          projectUrl: "",
          githubUrl: "",
        },
      ],
    });
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[]
  ) => {
    const updated = [...form.projects];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, projects: updated });
  };

  const removeProject = (index: number) => {
    setForm({
      ...form,
      projects: form.projects.filter((_, i) => i !== index),
    });
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updatedData = {
        ...form,
        skills: parsedSkills,
        socialLinks: {
          github: form.socialLinks.github || "",
          linkedin: form.socialLinks.linkedin || "",
          portfolio: form.socialLinks.portfolio || "",
          twitter: form.socialLinks.twitter || "",
        },
      };

      await api.put("/profile/me", updatedData);

      setForm(updatedData);
      setEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F1E8] p-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-24 rounded-[32px] bg-white/80 shadow-sm" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[430px_1fr]">
            <div className="h-[560px] rounded-[34px] bg-white/80 shadow-sm" />
            <div className="h-[560px] rounded-[34px] bg-white/80 shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (editing) {
    return (
      <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1f1f1f] md:px-8">
        <div className="mx-auto max-w-6xl">
          <form
            onSubmit={updateProfile}
            className="rounded-[34px] border border-black/10 bg-white/80 p-6 shadow-[0_24px_70px_rgba(31,31,31,0.08)] backdrop-blur sm:p-8"
          >
            <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Talent Profile Setup
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">
                  Edit Profile
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                  Fill this like a professional startup-facing profile. Startups
                  will use this information to understand your skills,
                  experience, projects, and availability.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#FBF8F1] px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>

            <div className="grid gap-6">
              <Card title="Profile Image">
                <p className="-mt-2 mb-5 text-sm leading-6 text-neutral-500">
                  Upload a clear professional photo. A good profile image helps
                  startups trust your profile faster.
                </p>

                <ImageUpload
                  label="Profile Image"
                  value={form.avatar}
                  onChange={(url) => setForm({ ...form, avatar: url })}
                />
              </Card>

              <Card title="Basic Details">
                <div className="mb-5 rounded-[22px] border border-black/10 bg-[#FBF8F1] p-4">
                  <p className="text-sm font-semibold text-neutral-800">
                    What should I write here?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Write your real name, a short professional headline, your
                    career summary, your main skills, and whether you are open
                    for startup opportunities.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    value={form.fullname}
                    required
                    minLength={3}
                    maxLength={80}
                    placeholder="Example: Prem Chand Das"
                    helper="Required. Minimum 3 characters. Use your real full name."
                    onChange={(e) =>
                      setForm({ ...form, fullname: e.target.value })
                    }
                  />

                  <Input
                    label="Headline"
                    value={form.headline}
                    maxLength={120}
                    placeholder="Example: Full-Stack Developer | MERN Stack | Startup Builder"
                    helper="Short title shown below your name. Maximum 120 characters."
                    onChange={(e) =>
                      setForm({ ...form, headline: e.target.value })
                    }
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label="Bio"
                      value={form.bio}
                      maxLength={1000}
                      placeholder="Example: I am a full-stack developer focused on building scalable web apps using React, Next.js, Node.js, Express, MongoDB, and modern product design. I enjoy working with startups and building fast MVPs."
                      helper="Write your professional story, strengths, interests, and what kind of work you want. Maximum 1000 characters."
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                    />
                  </div>

                  <Input
                    label="Skills"
                    value={skillsInput}
                    maxLength={500}
                    placeholder="Example: React, Next.js, Node.js, Express, MongoDB, TypeScript"
                    helper={`Comma separated. Maximum 30 skills. Currently detected: ${parsedSkills.length}/30.`}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      Availability
                    </label>

                    <select
                      value={form.availability}
                      onChange={(e) =>
                        setForm({ ...form, availability: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FBF8F1] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-black/10"
                    >
                      <option value="open">Open to opportunities</option>
                      <option value="not-looking">Currently not looking</option>
                    </select>

                    <p className="mt-2 text-xs leading-5 text-neutral-400">
                      Choose “Open” if startups can contact you for roles,
                      internships, freelance work, or collaboration.
                    </p>
                  </div>
                </div>
              </Card>

              <EditorSection
                title="Experience"
                onAdd={addExperience}
                count={form.experience.length}
                limit={20}
                helper="Add internships, jobs, freelance work, startup work, open-source work, or serious practical experience."
              >
                {form.experience.length === 0 && (
                  <EmptyBox
                    title="No experience added yet"
                    description="Click Add and write your role, company/project name, dates, and what you actually worked on."
                  />
                )}

                {form.experience.map((exp, index) => (
                  <EditorCard key={index} title={`Experience #${index + 1}`}>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute right-4 top-4 inline-flex items-center gap-1 text-sm font-semibold text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Role / Title"
                        value={exp.title}
                        maxLength={80}
                        placeholder="Example: Frontend Developer Intern"
                        helper="Your position or responsibility. Maximum 80 characters."
                        onChange={(e) =>
                          updateExperience(index, "title", e.target.value)
                        }
                      />

                      <Input
                        label="Company / Organization"
                        value={exp.company}
                        maxLength={80}
                        placeholder="Example: coVisioner, Freelance, College Project"
                        helper="Where you worked or contributed. Maximum 80 characters."
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                      />

                      <Input
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        helper="When this work started."
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                      />

                      <Input
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        helper="Leave empty if this is your current work."
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                      />

                      <div className="md:col-span-2">
                        <Textarea
                          label="Description"
                          value={exp.description}
                          maxLength={500}
                          placeholder="Example: Built responsive dashboard pages, integrated REST APIs, improved loading states, and worked with authentication-protected routes."
                          helper="Write what you built, improved, learned, or achieved. Maximum 500 characters."
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </EditorCard>
                ))}
              </EditorSection>

              <EditorSection
                title="Projects"
                onAdd={addProject}
                count={form.projects.length}
                limit={20}
                helper="Add your strongest projects. Startups care more about proof than certificates."
              >
                {form.projects.length === 0 && (
                  <EmptyBox
                    title="No projects added yet"
                    description="Click Add and include your best apps, GitHub projects, live demos, or startup MVPs."
                  />
                )}

                {form.projects.map((project, index) => (
                  <EditorCard key={index} title={`Project #${index + 1}`}>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="absolute right-4 top-4 inline-flex items-center gap-1 text-sm font-semibold text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Project Title"
                        value={project.title}
                        maxLength={100}
                        placeholder="Example: Startup Hiring Platform"
                        helper="Name of your project. Maximum 100 characters."
                        onChange={(e) =>
                          updateProject(index, "title", e.target.value)
                        }
                      />

                      <Input
                        label="Tech Stack"
                        value={project.techStack.join(", ")}
                        maxLength={400}
                        placeholder="Example: Next.js, Express, MongoDB, Socket.io"
                        helper={`Comma separated. Maximum 20 technologies per project. Currently: ${project.techStack.length}/20.`}
                        onChange={(e) =>
                          updateProject(
                            index,
                            "techStack",
                            e.target.value
                              .split(",")
                              .map((s) => s.trim().toLowerCase())
                              .filter(Boolean)
                              .slice(0, 20)
                          )
                        }
                      />

                      <div className="md:col-span-2">
                        <Textarea
                          label="Project Description"
                          value={project.description}
                          maxLength={700}
                          placeholder="Example: A hiring platform where startups can post jobs, review applications, accept candidates, and chat with talent in real time."
                          helper="Explain what problem it solves, your role, and key features. Maximum 700 characters."
                          onChange={(e) =>
                            updateProject(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <Input
                        label="Project URL"
                        type="url"
                        value={project.projectUrl}
                        placeholder="Example: https://your-project.vercel.app"
                        helper="Optional. Add live demo link if deployed."
                        onChange={(e) =>
                          updateProject(index, "projectUrl", e.target.value)
                        }
                      />

                      <Input
                        label="GitHub URL"
                        type="url"
                        value={project.githubUrl}
                        placeholder="Example: https://github.com/username/project-name"
                        helper="Optional. Add source code link if public."
                        onChange={(e) =>
                          updateProject(index, "githubUrl", e.target.value)
                        }
                      />
                    </div>
                  </EditorCard>
                ))}
              </EditorSection>

              <Card title="Social Links">
                <div className="mb-5 rounded-[22px] border border-black/10 bg-[#FBF8F1] p-4">
                  <p className="text-sm font-semibold text-neutral-800">
                    Add links that prove your work.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    GitHub and portfolio are highly recommended for developers.
                    LinkedIn helps startups verify your professional profile.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="GitHub"
                    type="url"
                    value={form.socialLinks.github || ""}
                    placeholder="Example: https://github.com/yourusername"
                    helper="Optional. Best place to show your code."
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: {
                          ...form.socialLinks,
                          github: e.target.value,
                        },
                      })
                    }
                  />

                  <Input
                    label="LinkedIn"
                    type="url"
                    value={form.socialLinks.linkedin || ""}
                    placeholder="Example: https://linkedin.com/in/yourusername"
                    helper="Optional. Add your professional profile."
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: {
                          ...form.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />

                  <Input
                    label="Portfolio"
                    type="url"
                    value={form.socialLinks.portfolio || ""}
                    placeholder="Example: https://yourname.dev"
                    helper="Optional. Add your personal website or portfolio."
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: {
                          ...form.socialLinks,
                          portfolio: e.target.value,
                        },
                      })
                    }
                  />

                  <Input
                    label="Twitter / X"
                    type="url"
                    value={form.socialLinks.twitter || ""}
                    placeholder="Example: https://x.com/yourusername"
                    helper="Optional. Add only if it supports your professional profile."
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: {
                          ...form.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </Card>

              <button
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-6 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <>
    <SharedNavbar/>
    <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1f1f1f] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-dashed border-black/15 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Talent Profile
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em] md:text-5xl">
            Profile
          </h1>
        </div>

        <section className="grid gap-6 lg:grid-cols-[430px_1fr]">
          <aside className="rounded-[34px] border border-black/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(31,31,31,0.08)] backdrop-blur">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                {form.fullname || "Your Name"}
              </h2>

              <p className="mt-1 text-sm font-semibold text-emerald-600">
                {form.headline || "Add your professional headline"}
              </p>
            </div>

            <div className="mx-auto mt-8 flex h-[320px] w-[320px] items-center justify-center rounded-full bg-gradient-to-br from-[#d8d3c9] via-white to-[#c8c1b4] p-5 shadow-inner max-sm:h-[240px] max-sm:w-[240px]">
              <div className="h-full w-full overflow-hidden rounded-full border-[10px] border-white bg-neutral-100 shadow-2xl">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt={form.fullname}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-20 w-20 text-neutral-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-sm rounded-[24px] border border-black/10 bg-[#FBF8F1] p-4 text-center">
              <p className="text-sm leading-7 text-neutral-500">
                {form.headline || "No headline added yet."}
              </p>
            </div>

            <div className="mt-5 rounded-[24px] border border-black/10 bg-[#FBF8F1] p-4">
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

              <p className="mt-3 text-xs leading-5 text-neutral-400">
                Add bio, skills, projects, experience, GitHub, LinkedIn, and
                portfolio to improve your profile strength.
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </aside>

          <section className="relative rounded-[34px] border border-black/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(31,31,31,0.08)] backdrop-blur">
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

            <div className="mt-7 rounded-[24px] border border-black/10 bg-[#FBF8F1] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                About
              </p>

              <p className="text-sm leading-8 text-neutral-600">
                {form.bio || "No bio added"}
              </p>
            </div>

            <div className="mt-7 grid gap-x-10 gap-y-5 md:grid-cols-2">
              <Detail label="Full Name">
                {form.fullname || "Not available"}
              </Detail>

              <Detail label="Availability">
                <AvailabilityBadge isOpen={isOpen} />
              </Detail>

              <Detail label="Experience">
                {form.experience.length} roles
              </Detail>

              <Detail label="Projects">{form.projects.length} projects</Detail>

              <Detail label="Badge">
                <span className="inline-flex items-center gap-2">
                  
                  No badges
                </span>
              </Detail>

              
            </div>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Skills
              </p>

              {form.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#F1EADF] px-3 py-1.5 text-xs font-semibold text-neutral-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <Empty>No skills added.</Empty>
              )}
            </div>
          </section>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <main className="space-y-6">
            <Card title="Experience">
              {form.experience.length ? (
                <div className="space-y-5">
                  {form.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] border border-black/10 bg-[#FBF8F1] p-5 transition hover:bg-white hover:shadow-md"
                    >
                      <h3 className="text-lg font-semibold">
                        {exp.title || "Untitled role"}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-neutral-500">
                        {exp.company || "Company"}
                      </p>

                      <p className="mt-2 text-xs text-neutral-400">
                        {formatDate(exp.startDate)} —{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-neutral-600">
                        {exp.description || "No description added."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty>No experience added.</Empty>
              )}
            </Card>

            <Card title="Projects">
              {form.projects.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {form.projects.map((project, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] border border-black/10 bg-[#FBF8F1] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold">
                        {project.title || "Untitled project"}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {project.description || "No description added."}
                      </p>

                      {project.techStack.length ? (
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
                <SocialLink label="Portfolio" url={form.socialLinks.portfolio} />
                <SocialLink label="GitHub" url={form.socialLinks.github} />
                <SocialLink label="LinkedIn" url={form.socialLinks.linkedin} />
                <SocialLink label="Twitter / X" url={form.socialLinks.twitter} />
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
    </main>
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

function EmptyBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-black/15 bg-white/60 p-5">
      <p className="text-sm font-bold text-neutral-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
    </div>
  );
}

function AvailabilityBadge({ isOpen }: { isOpen: boolean }) {
  return (
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
      {isOpen ? "Available for Collaboration" : "Currently Not Looking"}
    </span>
  );
}

function SocialLink({ label, url }: { label: string; url?: string }) {
  if (!url) {
    return (
      <p className="rounded-2xl border border-black/10 bg-[#FBF8F1] px-4 py-3 text-sm text-neutral-400">
        {label}: Not added
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#FBF8F1] px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-[#1f1f1f] hover:text-white"
    >
      <span className="inline-flex items-center gap-2">
        <LinkIcon className="h-4 w-4" />
        {label}
      </span>
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

function EditorSection({
  title,
  onAdd,
  children,
  helper,
  count,
  limit,
}: {
  title: string;
  onAdd?: () => void;
  children: React.ReactNode;
  helper?: string;
  count?: number;
  limit?: number;
}) {
  const disabled = typeof count === "number" && typeof limit === "number" && count >= limit;

  return (
    <section className="rounded-[28px] border border-black/10 bg-[#FBF8F1] p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>

          {helper && (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
              {helper}
            </p>
          )}

          {typeof count === "number" && typeof limit === "number" && (
            <p className="mt-1 text-xs font-medium text-neutral-400">
              {count}/{limit} added
            </p>
          )}
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        )}
      </div>

      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function EditorCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-[24px] border border-black/10 bg-white p-5">
      <p className="mb-4 text-sm font-bold">{title}</p>
      {children}
    </div>
  );
}

function Input({
  label,
  helper,
  value,
  maxLength,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
}) {
  const valueLength = typeof value === "string" ? value.length : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {label}
        </label>

        {maxLength && (
          <span className="text-[11px] font-medium text-neutral-400">
            {valueLength}/{maxLength}
          </span>
        )}
      </div>

      <input
        {...props}
        value={value}
        maxLength={maxLength}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FBF8F1] px-4 py-3 text-sm font-medium text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/10"
      />

      {helper && (
        <p className="mt-2 text-xs leading-5 text-neutral-400">{helper}</p>
      )}
    </div>
  );
}

function Textarea({
  label,
  helper,
  value,
  maxLength,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helper?: string;
}) {
  const valueLength = typeof value === "string" ? value.length : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {label}
        </label>

        {maxLength && (
          <span className="text-[11px] font-medium text-neutral-400">
            {valueLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FBF8F1] px-4 py-3 text-sm font-medium text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/10"
      />

      {helper && (
        <p className="mt-2 text-xs leading-5 text-neutral-400">{helper}</p>
      )}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}