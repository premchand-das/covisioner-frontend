"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanCode = code.replace(/\D/g, "").slice(0, 6);
  const isCodeValid = cleanCode.length === 6;

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return email;

    const [name, domain] = email.split("@");
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    if (!isCodeValid) {
      setError("Verification code must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-email", {
        email,
        code: cleanCode,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <main className="min-h-screen overflow-hidden bg-[#F6F5F0] px-4 py-4 text-neutral-950">
    <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[460px] items-center justify-center">
      <section className="w-full rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.07)] sm:p-6">
        <Link
          href="/signup"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"
        >
          <ArrowLeft size={16} />
          Back to signup
        </Link>

        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6F5F0] text-neutral-950">
            <Mail size={19} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Email Verification
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">
            Verify your email
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            We sent a verification code to:
          </p>

          <p className="mt-2 break-all rounded-2xl bg-[#F6F5F0] px-4 py-2.5 text-sm font-semibold text-neutral-950">
            {maskedEmail || "No email found"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
              Verification code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={cleanCode}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 text-center text-xl font-semibold tracking-[0.32em] text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
              required
            />

            <p className="mt-2 text-xs font-medium text-neutral-400">
              Enter the 6-digit code from your email inbox.
            </p>
          </div>

          <button
            disabled={loading || !isCodeValid || !email}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}

            {!loading && (
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-0.5"
              />
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-neutral-950 hover:underline"
          >
            Login
          </Link>
        </p>
      </section>
    </div>
  </main>
);
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      <p className="text-sm font-semibold text-neutral-700">{text}</p>
    </div>
  );
}