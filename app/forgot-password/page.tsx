"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(
        res.data.message || "If an account exists, a reset link has been sent."
      );

      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F5F0] px-4 py-4 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[460px] items-center justify-center">
        <section className="w-full rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.07)] sm:p-6">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <div className="mb-6">
            

            <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Password Recovery
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-neutral-950">
              Forgot password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Enter your account email. We’ll send reset instructions.
            </p>
          </div>

          {success && (
            <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3.5 pl-12 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending reset link..." : "Send reset link"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Remember your password?{" "}
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