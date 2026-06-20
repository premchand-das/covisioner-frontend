"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  MessageCircle,
  User,
  Menu,
  X,
  Briefcase,
  Building2,
  Bookmark,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function TalentNavbar() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(24,28,30,0.05)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/explore/jobs"
          className="font-manrope text-xl font-bold tracking-tight text-[#002045]"
        >
          coVisioner
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/explore/jobs"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#5A6673] transition hover:bg-[#F1F4F6] hover:text-[#002045]"
          >
            Explore Jobs
          </Link>

          <Link
            href="/explore/startups"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#5A6673] transition hover:bg-[#F1F4F6] hover:text-[#002045]"
          >
             Startups
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/messages"
            className="rounded-xl bg-[#F1F4F6] p-2.5 text-[#5A6673] transition hover:bg-[#EAF2FF] hover:text-[#002045]"
          >
            <MessageCircle size={19} />
          </Link>

          <Link
            href="/notifications"
            className="rounded-xl bg-[#F1F4F6] p-2.5 text-[#5A6673] transition hover:bg-[#EAF2FF] hover:text-[#002045]"
          >
            <Bell size={19} />
          </Link>

          <div className="group relative">
            <button className="rounded-xl bg-[#002045] p-2.5 text-white transition hover:bg-[#1A365D]">
              <User size={19} />
            </button>

            <div className="invisible absolute right-0 mt-3 w-56 rounded-2xl bg-white p-2 opacity-0 shadow-[0_20px_60px_rgba(24,28,30,0.12)] transition group-hover:visible group-hover:opacity-100">
              <Link
                href="/talent/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5A6673] hover:bg-[#F1F4F6] hover:text-[#002045]"
              >
                <User size={16} />
                Profile
              </Link>

              <Link
                href="/talent/applications"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5A6673] hover:bg-[#F1F4F6] hover:text-[#002045]"
              >
                <FileText size={16} />
                Applications
              </Link>

              <Link
                href="/talent/saved-jobs"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5A6673] hover:bg-[#F1F4F6] hover:text-[#002045]"
              >
                <Bookmark size={16} />
                Saved Jobs
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl bg-[#F1F4F6] p-2.5 text-[#002045] md:hidden"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white px-4 pb-5 shadow-[0_18px_50px_rgba(24,28,30,0.08)]">
          <div className="space-y-2 rounded-2xl bg-[#F7FAFC] p-3">
            <Link
              href="/explore/jobs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <Briefcase size={18} />
              Explore Jobs
            </Link>

            <Link
              href="/explore/startups"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <Building2 size={18} />
              Startups
            </Link>

            <Link
              href="/messages"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <MessageCircle size={18} />
              Messages
            </Link>

            <Link
              href="/notifications"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <Bell size={18} />
              Notifications
            </Link>

            <Link
              href="/talent/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <User size={18} />
              Profile
            </Link>

            <Link
              href="/talent/applications"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <FileText size={18} />
              Applications
            </Link>

            <Link
              href="/talent/saved-jobs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#181C1E] hover:bg-white"
            >
              <Bookmark size={18} />
              Saved Jobs
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Log
            </button>
          </div>
        </div>
      )}
    </header>
  );
}