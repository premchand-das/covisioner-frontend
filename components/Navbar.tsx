"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#002045] text-sm font-bold text-white">
            C
          </div>

          <span className="font-[Manrope] text-base font-bold tracking-tight text-[#181C1E] sm:text-lg">
            coVisioner
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-sm font-medium text-[#5F666B] hover:text-[#181C1E]">
            How it works
          </Link>

          <Link href="#startups" className="text-sm font-medium text-[#5F666B] hover:text-[#181C1E]">
            For Startups
          </Link>

          <Link href="#talent" className="text-sm font-medium text-[#5F666B] hover:text-[#181C1E]">
            For Talent
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#5F666B] hover:bg-[#F1F4F6] hover:text-[#181C1E]"
          >
            Login
          </Link>

          <Link
            href="/signup?role=talent"
            className="rounded-lg bg-[#002045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A365D]"
          >
            Join as Talent
          </Link>

          <Link
            href="/signup?role=startup"
            className="rounded-lg bg-[#F1F4F6] px-4 py-2 text-sm font-semibold text-[#002045] hover:bg-white"
          >
            Join as Startup
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[#181C1E] hover:bg-[#F1F4F6] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#C4C6CF]/20 bg-white px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#5F666B] hover:bg-[#F1F4F6] hover:text-[#181C1E]"
            >
              How it works
            </Link>

            <Link
              href="#startups"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#5F666B] hover:bg-[#F1F4F6] hover:text-[#181C1E]"
            >
              For Startups
            </Link>

            <Link
              href="#talent"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#5F666B] hover:bg-[#F1F4F6] hover:text-[#181C1E]"
            >
              For Talent
            </Link>
          </nav>

          <div className="mt-4 grid gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#F1F4F6] px-4 py-3 text-center text-sm font-semibold text-[#181C1E]"
            >
              Login
            </Link>

            <Link
              href="/signup?role=talent"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#002045] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Join as Talent
            </Link>

            <Link
              href="/signup?role=startup"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[#002045] shadow-[0_12px_24px_rgba(24,28,30,0.05)]"
            >
              Join as Startup
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}