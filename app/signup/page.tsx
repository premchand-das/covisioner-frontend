"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import api from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "talent";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isValidRole = role === "talent" || role === "startup";

  const passwordRules = useMemo(
    () => [
      { label: "8+ characters", valid: password.length >= 8 },
      { label: "Uppercase", valid: /[A-Z]/.test(password) },
      { label: "Lowercase", valid: /[a-z]/.test(password) },
      { label: "Number", valid: /[0-9]/.test(password) },
      { label: "Under 72 chars", valid: password.length <= 72 },
    ],
    [password]
  );

  const usernameValid =
    /^[a-zA-Z0-9_]+$/.test(username) || username.length === 0;

  const canSubmit =
    isValidRole &&
    username.trim().length >= 3 &&
    username.trim().length <= 30 &&
    usernameValid &&
    email.trim().length > 0 &&
    passwordRules.every((rule) => rule.valid);

  const selectRole = (selectedRole: "talent" | "startup") => {
    setError("");
    router.replace(`/signup?role=${selectedRole}`);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidRole) {
      setError("Please choose Talent or Startup first.");
      return;
    }

    if (!canSubmit) {
      setError("Please complete all fields using the required format.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    if (!isValidRole) {
      setError("Please choose Talent or Startup first.");
      return;
    }

    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?role=${role}`;
  };

  return (
    <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-black/[0.06] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="relative hidden min-h-[680px] bg-[#F6F5F0] lg:block">
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
            <div className="relative z-20 p-10">
              <div className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 shadow-sm">
                CoVisioner
              </div>
              <h2 className="mt-5 max-w-[430px] text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-neutral-950">
                Create your place inside the startup network.
              </h2>
              <p className="mt-4 max-w-[390px] text-sm font-medium leading-6 text-neutral-500">
                Join as talent or startup, verify your email, and start building
                meaningful opportunities.
              </p>
            </div>

            <div className="absolute bottom-0 left-1/2 h-[390px] w-[380px] -translate-x-1/2 rounded-t-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
            <div className="absolute bottom-0 left-1/2 h-[360px] w-[330px] -translate-x-1/2">
              <div className="absolute left-1/2 top-3 h-24 w-24 -translate-x-1/2 rounded-full bg-neutral-950" />
              <div className="absolute left-1/2 top-[62px] h-20 w-20 -translate-x-1/2 rounded-full bg-[#C78F6F]" />
              <div className="absolute left-[96px] top-[45px] h-12 w-28 rounded-t-full bg-[#2A2522]" />
              <div className="absolute left-[120px] top-[84px] h-2 w-2 rounded-full bg-neutral-950" />
              <div className="absolute right-[120px] top-[84px] h-2 w-2 rounded-full bg-neutral-950" />
              <div className="absolute left-1/2 top-[106px] h-2 w-7 -translate-x-1/2 rounded-full bg-[#884A3D]" />
              <div className="absolute left-1/2 top-[145px] h-[150px] w-[150px] -translate-x-1/2 rounded-[36px] bg-white shadow-[0_22px_55px_rgba(0,0,0,0.10)]" />
              <div className="absolute left-6 top-[188px] h-14 w-24 rotate-[-13deg] rounded-full bg-[#C78F6F]" />
              <div className="absolute right-6 top-[188px] h-14 w-24 rotate-[13deg] rounded-full bg-[#C78F6F]" />
              <div className="absolute left-1/2 top-[218px] h-24 w-48 -translate-x-1/2 rounded-[24px] bg-[#DAD7D1] shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                <div className="mx-auto mt-9 h-6 w-6 rounded-full bg-[#B9B4AB]" />
                <div className="absolute bottom-3 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#C7C2BA]" />
              </div>
              <div className="absolute left-[86px] top-[40px] h-24 w-4 rounded-full bg-white" />
              <div className="absolute right-[86px] top-[40px] h-24 w-4 rounded-full bg-white" />
              <div className="absolute bottom-0 left-9 h-20 w-24 rounded-t-[28px] bg-[#002045]" />
              <div className="absolute bottom-0 right-9 h-20 w-24 rounded-t-[28px] bg-[#002045]" />
            </div>

            <div className="absolute bottom-6 right-6 z-20 rounded-[24px] border border-black/[0.06] bg-white/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <p className="text-sm font-semibold tracking-[-0.03em] text-neutral-950">
                Join. Build. Grow.
              </p>
              <p className="mt-1 text-xs font-semibold text-neutral-500">
                One account. Two powerful paths.
              </p>
            </div>
          </aside>

          <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-[430px]">
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  {role === "startup" ? (
                    <Building2 size={15} />
                  ) : role === "talent" ? (
                    <UserRound size={15} />
                  ) : (
                    <ShieldCheck size={15} />
                  )}
                  {role === "startup" ? "Startup Account" : "Talent Account"}
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-neutral-950">
                  Create account
                </h1>
                <p className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                  Signup, verify your email, and continue onboarding.
                </p>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => selectRole("talent")}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      role === "talent"
                        ? "border-[#002045] bg-[#002045] text-white shadow-lg"
                        : "border-black/[0.06] bg-[#F6F5F0] text-neutral-950 hover:bg-white"
                    }`}
                  >
                    <UserRound className="mb-2 h-5 w-5" />
                    <div className="font-semibold">Talent</div>
                    <div
                      className={`mt-1 text-xs ${
                        role === "talent" ? "text-white/80" : "text-neutral-500"
                      }`}
                    >
                      Find jobs & startups
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRole("startup")}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      role === "startup"
                        ? "border-[#002045] bg-[#002045] text-white shadow-lg"
                        : "border-black/[0.06] bg-[#F6F5F0] text-neutral-950 hover:bg-white"
                    }`}
                  >
                    <Building2 className="mb-2 h-5 w-5" />
                    <div className="font-semibold">Startup</div>
                    <div
                      className={`mt-1 text-xs ${
                        role === "startup"
                          ? "text-white/80"
                          : "text-neutral-500"
                      }`}
                    >
                      Hire & build teams
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserRound size={17} />}
                  invalid={username.length > 0 && !usernameValid}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={17} />}
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-800">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Example: Startup2026"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-11 py-3.5 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-950"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-[22px] border border-black/[0.06] bg-[#F6F5F0] p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-950">
                    <ShieldCheck className="h-4 w-4" />
                    Password check
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs font-medium"
                      >
                        {rule.valid ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-neutral-300" />
                        )}
                        <span
                          className={
                            rule.valid ? "text-neutral-700" : "text-neutral-400"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={loading || !canSubmit}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/[0.08]" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-black/[0.08]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-5 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-white focus:ring-4 focus:ring-neutral-950/10"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              <p className="mt-5 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  href={`/login?role=${role}`}
                  className="font-semibold text-neutral-950 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  icon,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  invalid?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-800">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={[
            "w-full rounded-2xl border bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400",
            "focus:bg-white focus:ring-4 focus:ring-neutral-950/10",
            invalid ? "border-red-300" : "border-black/[0.06]",
            icon ? "pl-11" : "",
          ].join(" ")}
        />
      </div>
      {invalid && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Only letters, numbers and underscores are allowed.
        </p>
      )}
    </div>
  );
}