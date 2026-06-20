"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();

  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(res.data.message || "Password reset successful");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FAFC] px-4 py-8 text-[#181C1E]">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(0,32,69,0.08)] sm:p-8">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#66737F] transition hover:text-[#002045]"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F4F6] text-[#002045]">
            <ShieldCheck size={26} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#F1F4F6] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#002045]">
            Account Security
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#181C1E]">
            Reset password
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#66737F]">
            Create a new secure password for your account.
          </p>
        </div>

        {success && (
          <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <PasswordInput
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] px-5 py-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(0,32,69,0.18)] transition hover:bg-[#0B2B54] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting password..." : "Reset password"}
            {!loading && (
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-[#2C343A]">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#66737F]"
        />

        <input
          type="password"
          required
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-xl bg-[#F7FAFC] px-4 py-4 pl-12 text-sm font-semibold text-[#181C1E] outline-none transition placeholder:text-[#9AA5AF] focus:bg-white focus:ring-4 focus:ring-[#002045]/10"
        />
      </div>
    </div>
  );
}