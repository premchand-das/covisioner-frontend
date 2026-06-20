"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe,
  LinkIcon,
  MapPin,
  Plus,
  Rocket,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

const currentYear = new Date().getFullYear();

const fundingStages = [
  "idea",
  "bootstrapped",
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "series-c",
  "profitable",
];

const teamSizes = ["1-5", "6-10", "11-50", "51-100", "100+"];
const availabilityOptions = ["open", "not-looking"];

const suggestedTalentSkills = [
  "react",
  "nextjs",
  "nodejs",
  "mongodb",
  "typescript",
  "javascript",
  "python",
  "ui/ux",
  "figma",
  "express",
];

const suggestedStartupTech = [
  "react",
  "nextjs",
  "nodejs",
  "mongodb",
  "typescript",
  "ai",
  "python",
  "aws",
  "figma",
  "express",
];

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const toList = (value: string, max = 30) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, max);

const cleanUrl = (value: string) => value.trim();

const isValidUrlOrEmpty = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [talentForm, setTalentForm] = useState({
    fullname: "",
    headline: "",
    bio: "",
    skills: "",
    availability: "open",
    avatar: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  });

  const [startupForm, setStartupForm] = useState({
    startupName: "",
    tagline: "",
    vision: "",
    bio: "",
    mission: "",
    problemStatement: "",
    whyJoinUs: "",
    industry: "",
    fundingStage: "idea",
    teamSize: "1-5",
    foundedYear: "",
    website: "",
    location: "",
    logo: "",
    coverImage: "",
    technologies: "",
    linkedin: "",
    twitter: "",
    github: "",
    crunchbase: "",
  });

  useEffect(() => {
    if (token) localStorage.setItem("accessToken", token);
  }, [token]);

  useEffect(() => {
    if (!user) return;

    if (user.onboardingCompleted) {
      router.replace(
        user.role === "talent" ? "/talent/explore/startups" : "/startup/startups"
      );
    }
  }, [user, router]);

  const isTalent = user?.role === "talent";

  const talentCompletion = useMemo(() => {
    const checks = [
      talentForm.fullname.trim().length >= 3,
      talentForm.headline.trim().length > 0,
      talentForm.bio.trim().length > 0,
      toList(talentForm.skills).length > 0,
      availabilityOptions.includes(talentForm.availability),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [talentForm]);

  const startupCompletion = useMemo(() => {
    const checks = [
      startupForm.startupName.trim().length >= 2,
      startupForm.tagline.trim().length > 0,
      startupForm.bio.trim().length > 0,
      startupForm.industry.trim().length > 0,
      fundingStages.includes(startupForm.fundingStage),
      teamSizes.includes(startupForm.teamSize),
      startupForm.location.trim().length > 0,
      toList(startupForm.technologies).length > 0,
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [startupForm]);

  const completion = isTalent ? talentCompletion : startupCompletion;

  const handleTalentChange = (e: InputChangeEvent) => {
    setTalentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStartupChange = (e: InputChangeEvent) => {
    setStartupForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addTalentSkill = (skill: string) => {
    setTalentForm((prev) => {
      const current = toList(prev.skills);
      if (current.includes(skill)) return prev;
      return { ...prev, skills: [...current, skill].join(", ") };
    });
  };

  const removeTalentSkill = (skill: string) => {
    setTalentForm((prev) => ({
      ...prev,
      skills: toList(prev.skills)
        .filter((item) => item !== skill)
        .join(", "),
    }));
  };

  const addStartupTech = (tech: string) => {
    setStartupForm((prev) => {
      const current = toList(prev.technologies);
      if (current.includes(tech)) return prev;
      return { ...prev, technologies: [...current, tech].join(", ") };
    });
  };

  const removeStartupTech = (tech: string) => {
    setStartupForm((prev) => ({
      ...prev,
      technologies: toList(prev.technologies)
        .filter((item) => item !== tech)
        .join(", "),
    }));
  };

  const getErrorMessage = (err: any) => {
    const data = err.response?.data;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0]?.message || data.errors[0] || "Validation failed";
    }

    if (data?.errors && typeof data.errors === "object") {
      const firstError = Object.entries(data.errors)
        .flatMap(([field, messages]: any) =>
          Array.isArray(messages)
            ? messages.map((msg: string) => `${field}: ${msg}`)
            : [`${field}: ${messages}`]
        )[0];

      return firstError || "Validation failed";
    }

    return data?.message || "Something went wrong";
  };

  const validateTalent = () => {
    if (talentForm.fullname.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }

    if (talentForm.fullname.trim().length > 80) {
      return "Full name must be under 80 characters.";
    }

    if (talentForm.headline.trim().length > 120) {
      return "Headline must be under 120 characters.";
    }

    if (talentForm.bio.trim().length > 1000) {
      return "Bio must be under 1000 characters.";
    }

    if (!availabilityOptions.includes(talentForm.availability)) {
      return "Please choose a valid availability.";
    }

    if (toList(talentForm.skills).length > 30) {
      return "Maximum 30 skills allowed.";
    }

    const urls = [
      talentForm.avatar,
      talentForm.github,
      talentForm.linkedin,
      talentForm.twitter,
      talentForm.portfolio,
    ];

    if (!urls.every(isValidUrlOrEmpty)) {
      return "Please enter valid URLs starting with http:// or https://.";
    }

    return "";
  };

  const validateStartup = () => {
    const foundedYear = startupForm.foundedYear.trim();

    if (startupForm.startupName.trim().length < 2) {
      return "Startup name must be at least 2 characters.";
    }

    if (startupForm.startupName.trim().length > 80) {
      return "Startup name cannot exceed 80 characters.";
    }

    if (startupForm.tagline.trim().length > 160) {
      return "Tagline cannot exceed 160 characters.";
    }

    if (startupForm.vision.trim().length > 300) {
      return "Vision cannot exceed 300 characters.";
    }

    if (startupForm.bio.trim().length > 3000) {
      return "Bio cannot exceed 3000 characters.";
    }

    if (startupForm.mission.trim().length > 1000) {
      return "Mission cannot exceed 1000 characters.";
    }

    if (startupForm.problemStatement.trim().length > 1500) {
      return "Problem statement cannot exceed 1500 characters.";
    }

    if (startupForm.whyJoinUs.trim().length > 1500) {
      return "Why join us cannot exceed 1500 characters.";
    }

    if (startupForm.industry.trim().length > 100) {
      return "Industry cannot exceed 100 characters.";
    }

    if (startupForm.location.trim().length > 120) {
      return "Location cannot exceed 120 characters.";
    }

    if (!fundingStages.includes(startupForm.fundingStage)) {
      return "Please choose a valid funding stage.";
    }

    if (!teamSizes.includes(startupForm.teamSize)) {
      return "Please choose a valid team size.";
    }

    if (foundedYear) {
      const year = Number(foundedYear);
      if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
        return `Founded year must be between 1900 and ${currentYear}.`;
      }
    }

    if (toList(startupForm.technologies).length > 30) {
      return "You can add up to 30 technologies.";
    }

    const urls = [
      startupForm.logo,
      startupForm.coverImage,
      startupForm.website,
      startupForm.linkedin,
      startupForm.twitter,
      startupForm.github,
      startupForm.crunchbase,
    ];

    if (!urls.every(isValidUrlOrEmpty)) {
      return "Please enter valid URLs starting with http:// or https://.";
    }

    return "";
  };

  const submitTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateTalent();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullname: talentForm.fullname.trim(),
        headline: talentForm.headline.trim(),
        avatar: cleanUrl(talentForm.avatar),
        bio: talentForm.bio.trim(),
        skills: toList(talentForm.skills),
        availability: talentForm.availability,
        socialLinks: {
          linkedin: cleanUrl(talentForm.linkedin),
          github: cleanUrl(talentForm.github),
          twitter: cleanUrl(talentForm.twitter),
          portfolio: cleanUrl(talentForm.portfolio),
        },
        experience: [],
        projects: [],
      };

      await api.post("/profile", payload);
      await api.patch("/auth/complete-onboarding");

      router.replace("/talent/explore/startups");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const submitStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateStartup();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        startupName: startupForm.startupName.trim(),
        logo: cleanUrl(startupForm.logo),
        coverImage: cleanUrl(startupForm.coverImage),
        website: cleanUrl(startupForm.website),
        tagline: startupForm.tagline.trim(),
        vision: startupForm.vision.trim(),
        bio: startupForm.bio.trim(),
        mission: startupForm.mission.trim(),
        problemStatement: startupForm.problemStatement.trim(),
        whyJoinUs: startupForm.whyJoinUs.trim(),
        industry: startupForm.industry.trim(),
        fundingStage: startupForm.fundingStage,
        teamSize: startupForm.teamSize,
        technologies: toList(startupForm.technologies),
        achievements: [],
        milestones: [],
       
        location: startupForm.location.trim(),
        socialLinks: {
          linkedin: cleanUrl(startupForm.linkedin),
          twitter: cleanUrl(startupForm.twitter),
          github: cleanUrl(startupForm.github),
          crunchbase: cleanUrl(startupForm.crunchbase),
        },
      };

      if (startupForm.foundedYear.trim()) {
        payload.foundedYear = Number(startupForm.foundedYear.trim());
      }

      await api.post("/startups", payload);
      await api.patch("/auth/complete-onboarding");

      router.replace("/startup/startups");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.onboardingCompleted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5F0] px-6 text-neutral-950">
        <div className="rounded-[28px] border border-black/[0.06] bg-white px-8 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
          <p className="text-sm font-medium text-neutral-500">
            Preparing your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5F0] px-4 py-5 text-neutral-950 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 flex items-center justify-between rounded-[26px] border border-black/[0.06] bg-white px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">
              CoVisioner
            </p>
            <p className="text-xs font-medium text-neutral-400">
              Profile onboarding
            </p>
          </div>

          <div className="rounded-full bg-[#F6F5F0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {isTalent ? "Talent" : "Startup"}
          </div>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[0.86fr_1.44fr]">
          <aside className="rounded-[32px] border border-black/[0.06] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.05)] md:p-8 lg:sticky lg:top-8 lg:h-fit">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                <Sparkles size={14} />
                Final setup
              </div>

              <h1 className="mt-7 max-w-xl text-4xl font-semibold tracking-[-0.07em] text-neutral-950 md:text-5xl">
                {isTalent
                  ? "Build a profile founders trust."
                  : "Launch your startup profile."}
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-500 md:text-base">
                {isTalent
                  ? "Show your skills, availability, links, and what kind of work you can do for early-stage teams."
                  : "Tell candidates what you build, your stage, team size, technology stack, and why they should join."}
              </p>
            </div>

            <div className="mt-8 rounded-[26px] bg-[#F6F5F0] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Completion
                </p>
                <p className="text-sm font-semibold text-neutral-950">
                  {completion}%
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-neutral-950 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <div className="mt-5 rounded-[26px] bg-neutral-950 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                {isTalent ? <UserRound size={20} /> : <Building2 size={20} />}
              </div>

              <h2 className="text-lg font-semibold tracking-[-0.03em]">
                {isTalent ? "What recruiters see" : "What talent sees"}
              </h2>

              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {(isTalent
                  ? [
                      "Your headline and availability",
                      "Skills and proof links",
                      "A clean profile for startup discovery",
                    ]
                  : [
                      "Company stage and team size",
                      "Industry, location and tech stack",
                      "Trusted public startup profile",
                    ]
                ).map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-[26px] border border-black/[0.06] bg-white p-5">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Setup steps
              </p>

              <div className="space-y-4">
                <ProgressItem done text="Account created" />
                <ProgressItem done text="Email verified" />
                <ProgressItem active text="Profile details" />
              </div>
            </div>
          </aside>

          <section className="rounded-[32px] border border-black/[0.06] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.05)] md:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  {isTalent ? "Talent profile" : "Startup profile"}
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">
                  {isTalent
                    ? "Tell founders who you are."
                    : "Tell talent why you exist."}
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F6F5F0] px-4 py-2 text-sm font-semibold text-neutral-700">
                <BadgeCheck size={16} />
                Step 3 of 3
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {isTalent ? (
              <form onSubmit={submitTalent} className="space-y-8">
                <FormSection
                  title="Basic profile"
                  description="Use a clear name and headline so founders instantly understand your role."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full name"
                      name="fullname"
                      value={talentForm.fullname}
                      onChange={handleTalentChange}
                      placeholder="username"
                      required
                      maxLength={80}
                      icon={<UserRound size={17} />}
                    />

                    <Input
                      label="Headline optional"
                      name="headline"
                      value={talentForm.headline}
                      onChange={handleTalentChange}
                      placeholder="Example: Full Stack Developer | React + Node.js"
                      maxLength={120}
                      
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Availability"
                  description="Choose your current availability for startup opportunities."
                >
                  <Select
                    label="Availability"
                    name="availability"
                    value={talentForm.availability}
                    onChange={handleTalentChange}
                    options={availabilityOptions}
                  />
                </FormSection>

                <FormSection
                  title="About you"
                  description="Optional bio. Keep it under 1000 characters."
                >
                  <Textarea
                    label="Bio optional"
                    name="bio"
                    value={talentForm.bio}
                    onChange={handleTalentChange}
                    placeholder="Example: I build full-stack products using React, Next.js, Node.js and MongoDB. I enjoy working with early-stage teams where I can move fast, own features, and ship clean user experiences."
                    maxLength={1000}
                  />
                </FormSection>

                <FormSection
                  title="Skills"
                  description="Add comma-separated skills or tap suggestions below. Maximum 30 skills."
                >
                  <Input
                    label="Skills optional"
                    name="skills"
                    value={talentForm.skills}
                    onChange={handleTalentChange}
                    placeholder="Example: react, nextjs, nodejs, mongodb, typescript"
                  />

                  <SkillCloud
                    suggestions={suggestedTalentSkills}
                    selected={talentForm.skills}
                    onAdd={addTalentSkill}
                    onRemove={removeTalentSkill}
                  />
                </FormSection>

                <FormSection
                  title="Proof links"
                  description="Optional links help startups trust your work. Use full URLs with https://."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Avatar URL optional"
                      name="avatar"
                      value={talentForm.avatar}
                      onChange={handleTalentChange}
                      placeholder="https://example.com/avatar.png"
                      icon={<LinkIcon size={17} />}
                    />
                    <Input
                      label="GitHub URL optional"
                      name="github"
                      value={talentForm.github}
                      onChange={handleTalentChange}
                      placeholder="https://github.com/yourusername"
                      icon={<span className="text-xs font-bold">GH</span>}
                    />
                    <Input
                      label="LinkedIn URL optional"
                      name="linkedin"
                      value={talentForm.linkedin}
                      onChange={handleTalentChange}
                      placeholder="https://linkedin.com/in/yourusername"
                      icon={<span className="text-xs font-bold">IN</span>}
                    />
                    <Input
                      label="Twitter/X URL optional"
                      name="twitter"
                      value={talentForm.twitter}
                      onChange={handleTalentChange}
                      placeholder="https://x.com/yourusername"
                      icon={<span className="text-xs font-bold">X</span>}
                    />
                    <Input
                      label="Portfolio URL optional"
                      name="portfolio"
                      value={talentForm.portfolio}
                      onChange={handleTalentChange}
                      placeholder="https://yourportfolio.com"
                      icon={<Globe size={17} />}
                    />
                  </div>
                </FormSection>

                <SubmitButton
                  loading={loading}
                  text="Complete talent profile"
                  loadingText="Creating profile..."
                />
              </form>
            ) : (
              <form onSubmit={submitStartup} className="space-y-8">
                <FormSection
                  title="Company identity"
                  description="Use real startup details. This becomes your public startup profile."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Startup name"
                      name="startupName"
                      value={startupForm.startupName}
                      onChange={handleStartupChange}
                      placeholder="Example: CoVisioner"
                      required
                      minLength={2}
                      maxLength={80}
                      icon={<Building2 size={17} />}
                    />
                    <Input
                      label="Tagline optional"
                      name="tagline"
                      value={startupForm.tagline}
                      onChange={handleStartupChange}
                      placeholder="Example: Helping startups discover ambitious talent faster"
                      maxLength={160}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Company story"
                  description="All fields are optional in your validator, but they improve the profile quality."
                >
                  <div className="space-y-5">
                    <Textarea
                      label="Startup bio optional"
                      name="bio"
                      value={startupForm.bio}
                      onChange={handleStartupChange}
                      placeholder="Example: We help early-stage startups discover, evaluate, and hire ambitious talent faster through verified profiles, startup pages, job discovery, and direct messaging."
                      maxLength={3000}
                    />
                    <Textarea
                      label="Vision optional"
                      name="vision"
                      value={startupForm.vision}
                      onChange={handleStartupChange}
                      placeholder="Example: Build the most trusted talent network for early-stage startups."
                      maxLength={300}
                    />
                    <Textarea
                      label="Mission optional"
                      name="mission"
                      value={startupForm.mission}
                      onChange={handleStartupChange}
                      placeholder="Example: Help founders and ambitious builders connect faster with less noise."
                      maxLength={1000}
                    />
                    <Textarea
                      label="Problem statement optional"
                      name="problemStatement"
                      value={startupForm.problemStatement}
                      onChange={handleStartupChange}
                      placeholder="Example: Startups struggle to find serious early talent and candidates struggle to find trustworthy startup opportunities."
                      maxLength={1500}
                    />
                    <Textarea
                      label="Why join us optional"
                      name="whyJoinUs"
                      value={startupForm.whyJoinUs}
                      onChange={handleStartupChange}
                      placeholder="Example: Join a small team, own real product work, and help shape the future of startup hiring."
                      maxLength={1500}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Business details"
                  description="These filters help talent discover your startup."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Industry optional"
                      name="industry"
                      value={startupForm.industry}
                      onChange={handleStartupChange}
                      placeholder="Example: AI, SaaS, HR Tech"
                      maxLength={100}
                      icon={<Briefcase size={17} />}
                    />
                    <Input
                      label="Location optional"
                      name="location"
                      value={startupForm.location}
                      onChange={handleStartupChange}
                      placeholder="Example: Remote, Bengaluru, Ahmedabad"
                      maxLength={120}
                      icon={<MapPin size={17} />}
                    />
                    <Select
                      label="Funding stage"
                      name="fundingStage"
                      value={startupForm.fundingStage}
                      onChange={handleStartupChange}
                      options={fundingStages}
                    />
                    <Select
                      label="Team size"
                      name="teamSize"
                      value={startupForm.teamSize}
                      onChange={handleStartupChange}
                      options={teamSizes}
                    />
                    <Input
                      label="Founded year optional"
                      name="foundedYear"
                      type="number"
                      min={1900}
                      max={currentYear}
                      value={startupForm.foundedYear}
                      onChange={handleStartupChange}
                      placeholder={`Example: ${currentYear}`}
                    />
                    <Input
                      label="Website optional"
                      name="website"
                      value={startupForm.website}
                      onChange={handleStartupChange}
                      placeholder="https://yourstartup.com"
                      icon={<Globe size={17} />}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Technology stack"
                  description="Add comma-separated technologies or tap suggestions below. Maximum 30 technologies."
                >
                  <Input
                    label="Technologies optional"
                    name="technologies"
                    value={startupForm.technologies}
                    onChange={handleStartupChange}
                    placeholder="Example: react, nodejs, mongodb, ai, aws"
                  />

                  <SkillCloud
                    suggestions={suggestedStartupTech}
                    selected={startupForm.technologies}
                    onAdd={addStartupTech}
                    onRemove={removeStartupTech}
                  />
                </FormSection>

                <FormSection
                  title="Brand and social links"
                  description="Optional links help candidates verify your startup. Use full URLs with https://."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Logo URL optional"
                      name="logo"
                      value={startupForm.logo}
                      onChange={handleStartupChange}
                      placeholder="https://yourstartup.com/logo.png"
                      icon={<LinkIcon size={17} />}
                    />
                    <Input
                      label="Cover image URL optional"
                      name="coverImage"
                      value={startupForm.coverImage}
                      onChange={handleStartupChange}
                      placeholder="https://yourstartup.com/cover.png"
                      icon={<LinkIcon size={17} />}
                    />
                    <Input
                      label="LinkedIn optional"
                      name="linkedin"
                      value={startupForm.linkedin}
                      onChange={handleStartupChange}
                      placeholder="https://linkedin.com/company/yourstartup"
                      icon={<span className="text-xs font-bold">IN</span>}
                    />
                    <Input
                      label="Twitter/X optional"
                      name="twitter"
                      value={startupForm.twitter}
                      onChange={handleStartupChange}
                      placeholder="https://x.com/yourstartup"
                      icon={<span className="text-xs font-bold">X</span>}
                    />
                    <Input
                      label="GitHub optional"
                      name="github"
                      value={startupForm.github}
                      onChange={handleStartupChange}
                      placeholder="https://github.com/yourstartup"
                      icon={<span className="text-xs font-bold">GH</span>}
                    />
                    <Input
                      label="Crunchbase optional"
                      name="crunchbase"
                      value={startupForm.crunchbase}
                      onChange={handleStartupChange}
                      placeholder="https://www.crunchbase.com/organization/yourstartup"
                      icon={<LinkIcon size={17} />}
                    />
                  </div>
                </FormSection>

                <SubmitButton
                  loading={loading}
                  text="Launch startup profile"
                  loadingText="Creating startup..."
                />
              </form>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function ProgressItem({
  text,
  done,
  active,
}: {
  text: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
          done
            ? "bg-emerald-50 text-emerald-600"
            : active
              ? "bg-neutral-950 text-white"
              : "bg-neutral-100 text-neutral-400",
        ].join(" ")}
      >
        {done ? "✓" : "•"}
      </div>
      <p
        className={[
          "text-sm font-semibold",
          active ? "text-neutral-950" : "text-neutral-500",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-black/[0.06] bg-white p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-800">{label}</label>
      <div className="relative mt-2">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={[
            "w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400",
            "focus:bg-white focus:ring-4 focus:ring-neutral-950/10",
            icon ? "pl-11" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-800">{label}</label>
      <textarea
        {...props}
        rows={6}
        className="mt-2 w-full resize-none rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-800">{label}</label>
      <div className="relative mt-2">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-[50px] w-full appearance-none rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 text-sm font-medium text-neutral-950 outline-none transition focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {formatLabel(item)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  );
}

function SkillCloud({
  suggestions,
  selected,
  onAdd,
  onRemove,
}: {
  suggestions: string[];
  selected: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const selectedItems = toList(selected);

  return (
    <div className="mt-4">
      {selectedItems.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRemove(item)}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white"
            >
              {item}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => {
          const active = selectedItems.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => (active ? onRemove(item) : onAdd(item))}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/[0.06] bg-[#F6F5F0] text-neutral-600 hover:border-neutral-300",
              ].join(" ")}
            >
              {!active && <Plus className="h-3.5 w-3.5" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubmitButton({
  loading,
  text,
  loadingText,
}: {
  loading: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <button
      disabled={loading}
      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingText : text}
      {!loading && (
        <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
