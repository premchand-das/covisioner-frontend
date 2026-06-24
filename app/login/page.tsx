"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") as "talent" | "startup" | null;
  const errorParam = searchParams.get("error");

  const { login, loading } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    errorParam === "role_required"
      ? "This Google account needs a role first. Please sign up and choose Talent or Startup."
      : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Login should NOT send role.
  // Signup page should send role.
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const redirectUser = (user: any) => {
    if (!user?.role) {
      router.push("/signup");
      return;
    }

    if (!user?.onboardingCompleted) {
      router.push("/onboarding");
      return;
    }

    if (user.role === "talent") {
      router.push("/talent/explore/startups");
      return;
    }

    if (user.role === "startup") {
      router.push("/startup/startups");
      return;
    }

    router.push("/");
  };

  const isUserNotFoundError = (message: string) => {
    const lower = message.toLowerCase();

    return (
      lower.includes("user not found") ||
      lower.includes("account not found") ||
      lower.includes("not registered") ||
      lower.includes("no account") ||
      lower.includes("invalid email")
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      redirectUser(user);
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";

      if (isUserNotFoundError(message)) {
        router.push("/signup");
        return;
      }

      setError(message);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F5F0] text-neutral-950">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-black/[0.06] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] lg:min-h-[720px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  {role === "startup" ? (
                    <Building2 size={15} />
                  ) : role === "talent" ? (
                    <UserRound size={15} />
                  ) : (
                    <ShieldCheck size={15} />
                  )}

                  {role === "startup"
                    ? "Startup Login"
                    : role === "talent"
                    ? "Talent Login"
                    : "Account Login"}
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-5xl">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm font-medium leading-6 text-neutral-500">
                  Login to continue your CoVisioner journey.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  icon={<Mail size={17} />}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-800">
                    Password
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      <LockKeyhole size={17} />
                    </div>

                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Your secure password"
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

                  <div className="mt-2 flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/[0.08]" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-black/[0.08]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-5 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-white focus:ring-4 focus:ring-neutral-950/10"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-neutral-950 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <aside className="relative hidden overflow-hidden bg-[#F6F5F0] lg:block">
            <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute right-20 top-16 h-24 w-24 rounded-full bg-white blur-2xl" />
            <div className="absolute bottom-24 left-24 h-32 w-32 rounded-full bg-white blur-2xl" />

            <div className="absolute bottom-0 right-16 h-[560px] w-[390px] rounded-t-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />

            <div className="absolute bottom-8 left-8 z-20 rounded-[28px] border border-black/[0.06] bg-white/75 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <p className="text-sm font-semibold tracking-[-0.03em] text-neutral-950">
                Build. Hire. Grow.
              </p>
              <p className="mt-1 text-xs font-semibold text-neutral-500">
                Your startup network starts here.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
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
            "w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400",
            "focus:bg-white focus:ring-4 focus:ring-neutral-950/10",
            icon ? "pl-11" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}