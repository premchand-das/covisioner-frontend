"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUpload from "@/components/ImageUpload";
import SharedNavbar from "@/components/SharedNavbar";
import api from "@/lib/api";

const fundingStages = [
  { value: "idea", label: "Idea Stage" },
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "series-c", label: "Series C" },
  { value: "profitable", label: "Profitable" },
];

const teamSizes = ["1-5", "6-10", "11-50", "51-100", "100+"];

type Achievement = {
  title: string;
  issuer: string;
  year: string;
  description: string;
};

type Milestone = {
  title: string;
  date: string;
  description: string;
};

type TeamMember = {
  user?: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  linkedin: string;
  twitter: string;
  github: string;
  isFounder: boolean;
};

type StartupProfile = {
  logo: string;
  coverImage: string;
  startupName: string;
  tagline: string;
  vision: string;
  bio: string;
  mission: string;
  problemStatement: string;
  whyJoinUs: string;
  website: string;
  industry: string;
  fundingStage: string;
  teamSize: string;
  foundedYear: string;
  location: string;
  technologies: string[];
  achievements: Achievement[];
  milestones: Milestone[];
  team: TeamMember[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    crunchbase: string;
  };
  verifiedBadge?: boolean;
};

const emptyProfile: StartupProfile = {
  logo: "",
  coverImage: "",
  startupName: "",
  tagline: "",
  vision: "",
  bio: "",
  mission: "",
  problemStatement: "",
  whyJoinUs: "",
  website: "",
  industry: "",
  fundingStage: "idea",
  teamSize: "1-5",
  foundedYear: "",
  location: "",
  technologies: [],
  achievements: [],
  milestones: [],
  team: [],
  socialLinks: {
    linkedin: "",
    twitter: "",
    github: "",
    crunchbase: "",
  },
  verifiedBadge: false,
};

export default function StartupProfilePage() {
  return (
    <ProtectedRoute allowedRole="startup">
      <StartupProfileContent />
    </ProtectedRoute>
  );
}

function StartupProfileContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [form, setForm] = useState<StartupProfile>(emptyProfile);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/startups/me");
      const profile = res.data.startup || res.data.profile;

      const data: StartupProfile = {
        logo: profile.logo || "",
        coverImage: profile.coverImage || "",
        startupName: profile.startupName || "",
        tagline: profile.tagline || "",
        vision: profile.vision || "",
        bio: profile.bio || "",
        mission: profile.mission || "",
        problemStatement: profile.problemStatement || "",
        whyJoinUs: profile.whyJoinUs || "",
        website: profile.website || "",
        industry: profile.industry || "",
        fundingStage: profile.fundingStage || "idea",
        teamSize: profile.teamSize || "1-5",
        foundedYear: profile.foundedYear ? String(profile.foundedYear) : "",
        location: profile.location || "",
        technologies: profile.technologies || [],
        achievements:
          profile.achievements?.map((a: any) => ({
            title: a.title || "",
            issuer: a.issuer || "",
            year: a.year || "",
            description: a.description || "",
          })) || [],
        milestones:
          profile.milestones?.map((m: any) => ({
            title: m.title || "",
            date: m.date ? m.date.slice(0, 10) : "",
            description: m.description || "",
          })) || [],
        team:
          profile.team?.map((m: any) => ({
            user: m.user?._id || m.user || undefined,
            name: m.name || m.user?.username || "",
            role: m.role || "",
            avatar: m.avatar || m.user?.avatar || "",
            bio: m.bio || "",
            linkedin: m.linkedin || "",
            twitter: m.twitter || "",
            github: m.github || "",
            isFounder: Boolean(m.isFounder),
          })) || [],
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
          github: profile.socialLinks?.github || "",
          crunchbase: profile.socialLinks?.crunchbase || "",
        },
        verifiedBadge: profile.verifiedBadge || false,
      };

      setForm(data);
      setTechnologiesInput(data.technologies.join(", "));
    } catch (err) {
      console.error("FETCH STARTUP PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        logo: form.logo,
        coverImage: form.coverImage,
        startupName: form.startupName,
        tagline: form.tagline,
        vision: form.vision,
        bio: form.bio,
        mission: form.mission,
        problemStatement: form.problemStatement,
        whyJoinUs: form.whyJoinUs,
        website: form.website,
        industry: form.industry,
        fundingStage: form.fundingStage || "idea",
        teamSize: form.teamSize || "1-5",
        location: form.location,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
        technologies: technologiesInput
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        achievements: form.achievements
          .filter((a) => a.title.trim())
          .map((a) => ({
            title: a.title.trim(),
            issuer: a.issuer || "",
            year: a.year || "",
            description: a.description || "",
          })),
        milestones: form.milestones
          .filter((m) => m.title.trim())
          .map((m) => ({
            title: m.title.trim(),
            date: m.date || undefined,
            description: m.description || "",
          })),
        team: form.team
          .filter((m) => m.name.trim() || m.role.trim())
          .map((m) => ({
            user: m.user,
            name: m.name.trim(),
            role: m.role.trim(),
            avatar: m.avatar || "",
            bio: m.bio || "",
            linkedin: m.linkedin || "",
            twitter: m.twitter || "",
            github: m.github || "",
            isFounder: Boolean(m.isFounder),
          })),
        socialLinks: form.socialLinks,
      };

      const res = await api.put("/startups/me", payload);

const updatedProfile =
  res.data.startup ||
  res.data.profile ||
  res.data.updatedStartup ||
  res.data;

if (updatedProfile) {
  setForm({
    ...form,
    ...updatedProfile,
    foundedYear: updatedProfile.foundedYear
      ? String(updatedProfile.foundedYear)
      : form.foundedYear,
    technologies: updatedProfile.technologies || payload.technologies,
    socialLinks: {
      ...form.socialLinks,
      ...(updatedProfile.socialLinks || payload.socialLinks),
    },
  });

  setTechnologiesInput(
    (updatedProfile.technologies || payload.technologies || []).join(", ")
  );
}

setEditing(false);
await fetchProfile();
    } catch (err) {
      console.error("UPDATE STARTUP PROFILE ERROR:", err);
    } finally {
      setSaving(false);
    }
  };

  const addAchievement = () => {
    setForm({
      ...form,
      achievements: [
        ...form.achievements,
        { title: "", issuer: "", year: "", description: "" },
      ],
    });
  };

  const updateAchievement = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const updated = [...form.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, achievements: updated });
  };

  const removeAchievement = (index: number) => {
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index),
    });
  };

  const addMilestone = () => {
    setForm({
      ...form,
      milestones: [...form.milestones, { title: "", date: "", description: "" }],
    });
  };

  const updateMilestone = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    const updated = [...form.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, milestones: updated });
  };

  const removeMilestone = (index: number) => {
    setForm({
      ...form,
      milestones: form.milestones.filter((_, i) => i !== index),
    });
  };

  const addTeamMember = () => {
    setForm({
      ...form,
      team: [
        ...form.team,
        {
          name: "",
          role: "",
          avatar: "",
          bio: "",
          linkedin: "",
          twitter: "",
          github: "",
          isFounder: false,
        },
      ],
    });
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string | boolean
  ) => {
    const updated = [...form.team];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, team: updated });
  };

  const removeTeamMember = (index: number) => {
    setForm({
      ...form,
      team: form.team.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF]">
        <div className="rounded-[2rem] bg-white px-8 py-7 text-center shadow-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
          <p className="text-sm font-semibold text-neutral-500">
            Loading startup profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F6F4EF] px-4 py-6 text-neutral-950 md:px-8">
        <div className="mx-auto max-w-7xl">
          {!editing ? (
            <ViewMode form={form} onEdit={() => setEditing(true)} />
          ) : (
            <form
              onSubmit={updateProfile}
              className="rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-8"
            >
              <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Startup Profile
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                    Edit Company Profile
                  </h1>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-200"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={saving}
                    className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <aside className="h-fit space-y-5 rounded-[1.5rem] bg-[#F6F4EF] p-5">
                  <ImageUpload
                    label="Startup Logo"
                    value={form.logo}
                    onChange={(url) => setForm({ ...form, logo: url })}
                  />

                  <ImageUpload
                    label="Cover Image"
                    value={form.coverImage}
                    onChange={(url) => setForm({ ...form, coverImage: url })}
                  />

                  <p className="text-xs font-medium leading-5 text-neutral-500">
                    Square logo works best. Use a clean, wide image for the
                    cover.
                  </p>
                </aside>

                <div className="space-y-6">
                  <EditPanel title="Company Basics">
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="Startup Name"
                        value={form.startupName}
                        maxLength={80}
                        helper="Required. Minimum 2 characters, maximum 80 characters."
                        onChange={(e) =>
                          setForm({ ...form, startupName: e.target.value })
                        }
                      />

                      <Input
                        label="Tagline"
                        value={form.tagline}
                        maxLength={160}
                        helper="Short one-line pitch. Maximum 160 characters."
                        placeholder="Example: Building the future of startup hiring"
                        onChange={(e) =>
                          setForm({ ...form, tagline: e.target.value })
                        }
                      />
                    </div>

                    <Textarea
                      label="Vision"
                      value={form.vision}
                      maxLength={300}
                      helper="Describe the future your startup wants to create. Maximum 300 characters."
                      placeholder="Example: To make startup hiring faster, fairer, and more human."
                      onChange={(e) =>
                        setForm({ ...form, vision: e.target.value })
                      }
                    />

                    <Textarea
                      label="Bio"
                      value={form.bio}
                      maxLength={3000}
                      helper="Full startup overview. Explain what you build, who it serves, and why it matters. Maximum 3000 characters."
                      placeholder="Write about your product, market, traction, team, and long-term direction."
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  </EditPanel>

                  <EditPanel title="Mission & Hiring Story">
                    <Textarea
                      label="Mission"
                      value={form.mission}
                      maxLength={1000}
                      helper="Explain your core mission and purpose. Maximum 1000 characters."
                      placeholder="Example: Our mission is to connect ambitious talent with early-stage startups where they can create real impact."
                      onChange={(e) =>
                        setForm({ ...form, mission: e.target.value })
                      }
                    />

                    <Textarea
                      label="Problem Statement"
                      value={form.problemStatement}
                      maxLength={1500}
                      helper="Explain the real-world problem your startup is solving. Maximum 1500 characters."
                      placeholder="Example: Early-stage startups struggle to find skilled people who understand risk, speed, ownership, and product-building culture."
                      onChange={(e) =>
                        setForm({
                          ...form,
                          problemStatement: e.target.value,
                        })
                      }
                    />

                    <Textarea
                      label="Why Join Us"
                      value={form.whyJoinUs}
                      maxLength={1500}
                      helper="Tell candidates why they should join your company. Maximum 1500 characters."
                      placeholder="Mention ownership, learning, equity, culture, growth, mission, and why this is a rare opportunity."
                      onChange={(e) =>
                        setForm({ ...form, whyJoinUs: e.target.value })
                      }
                    />
                  </EditPanel>

                  <EditPanel title="Company Details">
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="Website"
                        value={form.website}
                        placeholder="https://example.com"
                        helper="Optional. Must be a valid URL."
                        onChange={(e) =>
                          setForm({ ...form, website: e.target.value })
                        }
                      />

                      <Input
                        label="Industry"
                        value={form.industry}
                        placeholder="AI, Fintech, SaaS"
                        maxLength={100}
                        helper="Maximum 100 characters."
                        onChange={(e) =>
                          setForm({ ...form, industry: e.target.value })
                        }
                      />

                      <Select
                        label="Funding Stage"
                        value={form.fundingStage}
                        onChange={(value) =>
                          setForm({ ...form, fundingStage: value })
                        }
                        options={fundingStages}
                      />

                      <Select
                        label="Team Size"
                        value={form.teamSize}
                        onChange={(value) =>
                          setForm({ ...form, teamSize: value })
                        }
                        options={teamSizes.map((size) => ({
                          value: size,
                          label: size,
                        }))}
                      />

                      <Input
                        label="Founded Year"
                        type="number"
                        min={1900}
                        max={new Date().getFullYear()}
                        value={form.foundedYear}
                        placeholder="2026"
                        helper={`Optional. Between 1900 and ${new Date().getFullYear()}.`}
                        onChange={(e) =>
                          setForm({ ...form, foundedYear: e.target.value })
                        }
                      />

                      <Input
                        label="Location"
                        value={form.location}
                        maxLength={120}
                        placeholder="Ahmedabad, India"
                        helper="Maximum 120 characters."
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                      />
                    </div>

                    <Input
                      label="Technologies"
                      value={technologiesInput}
                      placeholder="React, Node.js, MongoDB, AI"
                      helper="Comma separated. Maximum 30 technologies, each up to 50 characters."
                      onChange={(e) => setTechnologiesInput(e.target.value)}
                    />
                  </EditPanel>

                  <EditPanel title="Social Links">
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="LinkedIn"
                        value={form.socialLinks.linkedin}
                        helper="Optional. Must be a valid URL."
                        placeholder="https://linkedin.com/company/..."
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
                        label="GitHub"
                        value={form.socialLinks.github}
                        helper="Optional. Must be a valid URL."
                        placeholder="https://github.com/..."
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
                        label="Twitter / X"
                        value={form.socialLinks.twitter}
                        helper="Optional. Must be a valid URL."
                        placeholder="https://x.com/..."
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

                      <Input
                        label="Crunchbase"
                        value={form.socialLinks.crunchbase}
                        helper="Optional. Must be a valid URL."
                        placeholder="https://www.crunchbase.com/..."
                        onChange={(e) =>
                          setForm({
                            ...form,
                            socialLinks: {
                              ...form.socialLinks,
                              crunchbase: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </EditPanel>

                  <EditSection
                    title="Team Members"
                    buttonLabel="+ Add Member"
                    onAdd={addTeamMember}
                  >
                    <div className="grid gap-4">
                      {form.team.map((member, index) => (
                        <EditCard key={index}>
                          <CardHeader
                            title={`Team Member #${index + 1}`}
                            onRemove={() => removeTeamMember(index)}
                          />

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Name"
                              value={member.name}
                              maxLength={100}
                              helper="Maximum 100 characters."
                              onChange={(e) =>
                                updateTeamMember(index, "name", e.target.value)
                              }
                            />

                            <Input
                              label="Role"
                              value={member.role}
                              maxLength={100}
                              helper="Maximum 100 characters."
                              placeholder="Founder, CTO, Product Lead"
                              onChange={(e) =>
                                updateTeamMember(index, "role", e.target.value)
                              }
                            />

                            <Input
                              label="Avatar URL"
                              value={member.avatar}
                              helper="Optional. Must be a valid URL."
                              onChange={(e) =>
                                updateTeamMember(index, "avatar", e.target.value)
                              }
                            />

                            <Input
                              label="LinkedIn"
                              value={member.linkedin}
                              helper="Optional. Must be a valid URL."
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  "linkedin",
                                  e.target.value
                                )
                              }
                            />

                            <Input
                              label="Twitter / X"
                              value={member.twitter}
                              helper="Optional. Must be a valid URL."
                              onChange={(e) =>
                                updateTeamMember(index, "twitter", e.target.value)
                              }
                            />

                            <Input
                              label="GitHub"
                              value={member.github}
                              helper="Optional. Must be a valid URL."
                              onChange={(e) =>
                                updateTeamMember(index, "github", e.target.value)
                              }
                            />
                          </div>

                          <div className="mt-4">
                            <Textarea
                              label="Bio"
                              value={member.bio}
                              maxLength={500}
                              helper="Short team member bio. Maximum 500 characters."
                              placeholder="Write about this member's experience, role, and contribution."
                              onChange={(e) =>
                                updateTeamMember(index, "bio", e.target.value)
                              }
                            />
                          </div>

                          <label className="mt-4 flex items-center gap-2 text-sm font-bold">
                            <input
                              type="checkbox"
                              checked={member.isFounder}
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  "isFounder",
                                  e.target.checked
                                )
                              }
                            />
                            Founder / Co-founder
                          </label>
                        </EditCard>
                      ))}
                    </div>
                  </EditSection>

                  <EditSection
                    title="Achievements"
                    buttonLabel="+ Add Achievement"
                    onAdd={addAchievement}
                  >
                    <div className="grid gap-4">
                      {form.achievements.map((item, index) => (
                        <EditCard key={index}>
                          <CardHeader
                            title={`Achievement #${index + 1}`}
                            onRemove={() => removeAchievement(index)}
                          />

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Title"
                              value={item.title}
                              maxLength={120}
                              helper="Required if achievement is added. Maximum 120 characters."
                              onChange={(e) =>
                                updateAchievement(index, "title", e.target.value)
                              }
                            />

                            <Input
                              label="Issuer"
                              value={item.issuer}
                              maxLength={120}
                              helper="Maximum 120 characters."
                              onChange={(e) =>
                                updateAchievement(index, "issuer", e.target.value)
                              }
                            />

                            <Input
                              label="Year"
                              value={item.year}
                              maxLength={20}
                              helper="Maximum 20 characters."
                              placeholder="2026"
                              onChange={(e) =>
                                updateAchievement(index, "year", e.target.value)
                              }
                            />

                            <Textarea
                              label="Description"
                              value={item.description}
                              maxLength={500}
                              helper="Achievement details. Maximum 500 characters."
                              onChange={(e) =>
                                updateAchievement(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </EditCard>
                      ))}
                    </div>
                  </EditSection>

                  <EditSection
                    title="Milestones"
                    buttonLabel="+ Add Milestone"
                    onAdd={addMilestone}
                  >
                    <div className="grid gap-4">
                      {form.milestones.map((item, index) => (
                        <EditCard key={index}>
                          <CardHeader
                            title={`Milestone #${index + 1}`}
                            onRemove={() => removeMilestone(index)}
                          />

                          <div className="grid gap-4">
                            <Input
                              label="Title"
                              value={item.title}
                              maxLength={120}
                              helper="Required if milestone is added. Maximum 120 characters."
                              onChange={(e) =>
                                updateMilestone(index, "title", e.target.value)
                              }
                            />

                            <Input
                              label="Date"
                              type="date"
                              value={item.date}
                              helper="Optional milestone date."
                              onChange={(e) =>
                                updateMilestone(index, "date", e.target.value)
                              }
                            />

                            <Textarea
                              label="Description"
                              value={item.description}
                              maxLength={500}
                              helper="Milestone details. Maximum 500 characters."
                              onChange={(e) =>
                                updateMilestone(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </EditCard>
                      ))}
                    </div>
                  </EditSection>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

function ViewMode({
  form,
  onEdit,
}: {
  form: StartupProfile;
  onEdit: () => void;
}) {
  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)]">
        <div
          className="relative bg-neutral-950 px-6 py-10 text-white md:px-8 md:py-14"
          style={
            form.coverImage
              ? {
                  backgroundImage: `linear-gradient(rgba(10,10,10,.72), rgba(10,10,10,.88)), url(${form.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white/10 ring-4 ring-white/10">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt={form.startupName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                    {form.startupName?.charAt(0) || "S"}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  Startup Profile
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] md:text-6xl">
                  {form.startupName || "Startup Name"}{" "}
                  {form.verifiedBadge ? "✓" : ""}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                  {form.tagline || "No tagline added yet."}
                </p>

                {form.vision && (
                  <p className="mt-4 max-w-3xl text-lg font-semibold leading-7 text-white">
                    “{form.vision}”
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onEdit}
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-neutral-950 hover:bg-neutral-100"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-5 md:p-8">
          <InfoCard label="Industry" value={form.industry || "Not added"} />
          <InfoCard label="Location" value={form.location || "Not added"} />
          <InfoCard label="Funding" value={formatFunding(form.fundingStage)} />
          <InfoCard label="Team Size" value={form.teamSize || "Not added"} />
          <InfoCard label="Founded" value={form.foundedYear || "Not added"} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="About">
            <p className="text-sm leading-7 text-neutral-600">
              {form.bio || "No bio added."}
            </p>
          </Panel>

          <Panel title="Mission">
            <p className="text-sm leading-7 text-neutral-600">
              {form.mission || "No mission added."}
            </p>
          </Panel>

          <Panel title="Problem Statement">
            <p className="text-sm leading-7 text-neutral-600">
              {form.problemStatement || "No problem statement added."}
            </p>
          </Panel>

          <Panel title="Why Join Us">
            <p className="text-sm leading-7 text-neutral-600">
              {form.whyJoinUs || "No hiring pitch added."}
            </p>
          </Panel>

          <Panel title="Team">
            <div className="grid gap-4 md:grid-cols-2">
              {form.team.length === 0 && (
                <EmptyText>No team members added yet.</EmptyText>
              )}

              {form.team.map((member, index) => (
                <SmallCard key={index}>
                  <div className="flex gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-neutral-200">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-black">
                          {member.name?.charAt(0) || "T"}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black">{member.name || "Unnamed"}</h3>
                      <p className="text-sm font-bold text-neutral-500">
                        {member.role || "No role added"}
                      </p>
                      {member.isFounder && (
                        <span className="mt-2 inline-flex rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                          Founder
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-neutral-600">
                    {member.bio || "No bio added."}
                  </p>
                </SmallCard>
              ))}
            </div>
          </Panel>

          <Panel title="Milestones">
            <div className="grid gap-4">
              {form.milestones.length === 0 && (
                <EmptyText>No milestones added yet.</EmptyText>
              )}

              {form.milestones.map((item, index) => (
                <SmallCard key={index}>
                  <h3 className="font-black">{item.title || "Untitled"}</h3>
                  <p className="mt-1 text-xs font-bold text-neutral-400">
                    {item.date || "No date"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {item.description || "No description added."}
                  </p>
                </SmallCard>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Technologies">
            <div className="flex flex-wrap gap-2">
              {form.technologies.length === 0 ? (
                <EmptyText>No technologies added yet.</EmptyText>
              ) : (
                form.technologies.map((tech) => <Badge key={tech}>{tech}</Badge>)
              )}
            </div>
          </Panel>

          <Panel title="Links">
            <div className="grid gap-3">
              {form.website && <LinkBox href={form.website} label="Website" />}
              {form.socialLinks.linkedin && (
                <LinkBox href={form.socialLinks.linkedin} label="LinkedIn" />
              )}
              {form.socialLinks.github && (
                <LinkBox href={form.socialLinks.github} label="GitHub" />
              )}
              {form.socialLinks.twitter && (
                <LinkBox href={form.socialLinks.twitter} label="Twitter / X" />
              )}
              {form.socialLinks.crunchbase && (
                <LinkBox href={form.socialLinks.crunchbase} label="Crunchbase" />
              )}

              {!form.website &&
                !form.socialLinks.linkedin &&
                !form.socialLinks.github &&
                !form.socialLinks.twitter &&
                !form.socialLinks.crunchbase && (
                  <EmptyText>No links added yet.</EmptyText>
                )}
            </div>
          </Panel>

          <Panel title="Achievements">
            <div className="grid gap-3">
              {form.achievements.length === 0 && (
                <EmptyText>No achievements added yet.</EmptyText>
              )}

              {form.achievements.map((item, index) => (
                <SmallCard key={index}>
                  <h3 className="font-black">{item.title || "Achievement"}</h3>
                  <p className="mt-1 text-xs font-bold text-neutral-400">
                    {item.issuer} {item.year ? `• ${item.year}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {item.description || "No description added."}
                  </p>
                </SmallCard>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </section>
  );
}

function Input({
  label,
  helper,
  maxLength,
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
}) {
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-extrabold">{label}</label>

        {maxLength ? (
          <span className="text-xs font-bold text-neutral-400">
            {currentLength}/{maxLength}
          </span>
        ) : null}
      </div>

      <input
        {...props}
        value={value}
        maxLength={maxLength}
        className="mt-2 w-full rounded-xl bg-white px-4 py-3.5 text-sm font-semibold outline-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] placeholder:text-neutral-400 focus:ring-4 focus:ring-black/10"
      />

      {helper ? (
        <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold leading-5 text-neutral-500 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function Textarea({
  label,
  helper,
  maxLength,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helper?: string;
}) {
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-extrabold">{label}</label>

        {maxLength ? (
          <span className="text-xs font-bold text-neutral-400">
            {currentLength}/{maxLength}
          </span>
        ) : null}
      </div>

      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        rows={5}
        className="mt-2 w-full resize-none rounded-xl bg-white px-4 py-3.5 text-sm font-semibold outline-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] placeholder:text-neutral-400 focus:ring-4 focus:ring-black/10"
      />

      {helper ? (
        <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold leading-5 text-neutral-500 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[#F6F4EF] p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-base font-black">{value}</p>
    </div>
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
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-black tracking-[-0.04em]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EditPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-[1.5rem] bg-[#F6F4EF] p-5">
      <h2 className="text-xl font-black tracking-[-0.03em]">{title}</h2>
      {children}
    </section>
  );
}

function SmallCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-[#F6F4EF] p-5">{children}</div>;
}

function EditSection({
  title,
  buttonLabel,
  onAdd,
  children,
}: {
  title: string;
  buttonLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] bg-[#F6F4EF] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black tracking-[-0.03em]">{title}</h2>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-white px-4 py-2 text-sm font-black shadow-sm hover:bg-neutral-50"
        >
          {buttonLabel}
        </button>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function EditCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white p-5">{children}</div>;
}

function CardHeader({
  title,
  onRemove,
}: {
  title: string;
  onRemove: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <p className="text-sm font-black">{title}</p>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 hover:bg-red-100"
      >
        Remove
      </button>
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-neutral-400">{children}</p>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-black text-neutral-700">
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-extrabold">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl bg-white px-4 py-3.5 text-sm font-semibold outline-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus:ring-4 focus:ring-black/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatFunding(value: string) {
  return fundingStages.find((stage) => stage.value === value)?.label || value;
}