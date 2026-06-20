import Link from "next/link";
import {
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";

export default function TalentExplorePage() {
  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F6F5F0]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-black/[0.06] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  Talent Network
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-neutral-950 md:text-6xl">
                  Explore opportunities.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500">
                  Discover innovative startups, ambitious founders and exciting
                  career opportunities all in one place.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F6F5F0] px-4 py-3">
                <Sparkles className="h-5 w-5 text-neutral-950" />
                <span className="text-sm font-semibold text-neutral-700">
                  Build your next chapter
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Link
              href="/talent/explore/startups"
              className="group overflow-hidden rounded-[32px] border border-black/[0.06] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F6F5F0]">
                <Building2 className="h-8 w-8 text-neutral-900" />
              </div>

              <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Explore Startups
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Discover startup profiles, founding teams, funding stages,
                technologies and hiring companies.
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-neutral-950">
                Browse Startups
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/talent/explore/jobs"
              className="group overflow-hidden rounded-[32px] border border-black/[0.06] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F6F5F0]">
                <Briefcase className="h-8 w-8 text-neutral-900" />
              </div>

              <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Explore Jobs
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Search startup jobs, remote opportunities, internships,
                co-founder positions and high-growth roles.
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-neutral-950">
                Browse Jobs
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}