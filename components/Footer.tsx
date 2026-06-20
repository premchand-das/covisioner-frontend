"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#E5E9ED] bg-[#F7FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* CTA Section */}
       

        {/* Footer Links */}
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002045] text-lg font-bold text-white">
                C
              </div>

              <div>
                <h3 className="font-[Manrope] text-xl font-bold text-[#181C1E]">
                  coVisioner
                </h3>

                <p className="text-sm text-[#5F666B]">
                  Startup hiring reimagined.
                </p>
              </div>
            </div>

            <p className="max-w-md leading-relaxed text-[#5F666B]">
              A trust-first hiring platform where startups and talent connect
              directly, transparently, and efficiently.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-[Manrope] text-sm font-bold uppercase tracking-wider text-[#181C1E]">
              Product
            </h4>

            <div className="space-y-3">
              <Link
                href="/explore/jobs"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                Explore Jobs
              </Link>

              <Link
                href="/explore/startups"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                Explore Startups
              </Link>

              <Link
                href="/login"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-[Manrope] text-sm font-bold uppercase tracking-wider text-[#181C1E]">
              Company
            </h4>

            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                About
              </Link>

              <Link
                href="/privacy"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="block text-[#5F666B] transition hover:text-[#181C1E]"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-[#E5E9ED] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#5F666B]">
            © 2026 coVisioner. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-[#5F666B] transition hover:text-[#181C1E]"
            >
              X
            </Link>

            <Link
              href="#"
              className="text-sm text-[#5F666B] transition hover:text-[#181C1E]"
            >
              LinkedIn
            </Link>

            <Link
              href="#"
              className="text-sm text-[#5F666B] transition hover:text-[#181C1E]"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}