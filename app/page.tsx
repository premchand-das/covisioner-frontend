"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, MessageSquare, Shield, Mail, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    setFeedbackSubmitted(true);

    setTimeout(() => {
      setFeedback({ name: "", email: "", message: "" });
      setFeedbackSubmitted(false);
    }, 3000);
  };

  const inputClass =
    "mt-2 w-full rounded-xl bg-[#F7FAFC] px-4 py-3 text-sm text-[#181C1E] outline-none ring-1 ring-[#C4C6CF]/30 transition placeholder:text-[#8A9298] focus:bg-white focus:ring-[#002045]/40";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7FAFC] text-[#181C1E]">
      <Navbar />

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28 lg:py-32">
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#66AFFE]/20 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1A365D] shadow-[0_24px_40px_rgba(24,28,30,0.05)]">
            Modern hiring platform for startups
          </div>

          <h1 className="font-[Manrope] text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl md:text-7xl">
            The startup hiring platform built on trust.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-[Inter] text-base leading-8 text-[#5F666B] sm:text-lg">
            Connect transparent startups with verified talent. Skip the noise,
            discover serious builders, and start meaningful conversations.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup?role=talent"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#002045] to-[#1A365D] px-7 py-4 font-semibold text-white shadow-[0_24px_40px_rgba(0,32,69,0.18)] transition hover:-translate-y-0.5"
            >
              Join as Talent
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/signup?role=startup"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 font-semibold text-[#181C1E] shadow-[0_24px_40px_rgba(24,28,30,0.06)] transition hover:-translate-y-0.5 hover:bg-[#F1F4F6]"
            >
              Join as Startup
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 rounded-3xl bg-[#F1F4F6] p-3 sm:grid-cols-3">
          {[
            ["Verified", "Talent profiles with real credibility"],
            ["Transparent", "Startup details without hidden noise"],
            ["Direct", "Message founders and builders directly"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-white p-6 text-left">
              <p className="font-[Manrope] text-2xl font-bold text-[#002045]">
                {title}
              </p>
              <p className="mt-2 font-[Inter] text-sm leading-6 text-[#5F666B]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F1F4F6] px-5 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1A365D]">
              Why it works
            </p>
            <h2 className="font-[Manrope] text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
              Built on transparency, not noise.
            </h2>
            <p className="mt-4 font-[Inter] leading-7 text-[#5F666B]">
              A cleaner hiring experience for startups and serious talent.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Transparent Profiles",
                text: "Startups share vision, metrics, funding, and roles clearly.",
              },
              {
                icon: CheckCircle,
                title: "Verified Talent",
                text: "Real people, real skills, real projects, and real experience.",
              },
              {
                icon: MessageSquare,
                title: "Direct Communication",
                text: "No agencies. No gatekeepers. Just focused conversations.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-7 transition hover:-translate-y-1 hover:bg-[#FAFCFD]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3FF]">
                  <Icon className="h-6 w-6 text-[#002045]" />
                </div>
                <h3 className="font-[Manrope] text-xl font-bold">{title}</h3>
                <p className="mt-3 font-[Inter] text-sm leading-7 text-[#5F666B]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1A365D]">
              Process
            </p>
            <h2 className="font-[Manrope] text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
              Three simple steps to find your match.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              ["01", "Explore Startups", "Browse transparent startup profiles, vision, and open roles."],
              ["02", "Apply & Connect", "Apply directly or message teams with your verified profile."],
              ["03", "Build Together", "Chat, negotiate, and begin the journey with the right team."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl bg-[#F1F4F6] p-5 sm:p-6">
                <div className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#002045] font-[Manrope] text-sm font-bold text-white">
                    {number}
                  </div>
                  <div>
                    <h3 className="font-[Manrope] text-xl font-bold">{title}</h3>
                    <p className="mt-2 font-[Inter] text-sm leading-7 text-[#5F666B]">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-2xl rounded-3xl bg-[#F1F4F6] p-3">
          <div className="rounded-3xl bg-white p-6 shadow-[0_24px_40px_rgba(24,28,30,0.05)] sm:p-8">
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1A365D]">
                Feedback
              </p>
              <h2 className="font-[Manrope] text-3xl font-bold tracking-[-0.04em]">
                We'd love your feedback
              </h2>
              <p className="mt-3 font-[Inter] text-sm leading-7 text-[#5F666B]">
                Help us improve Zerofundventure. Share your thoughts and suggestions.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold">Your Name</label>
                <input
                  className={inputClass}
                  type="text"
                  name="name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold">Email Address</label>
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold">Your Feedback</label>
                <textarea
                  className={`${inputClass} min-h-[150px] resize-none`}
                  name="message"
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                  placeholder="Tell us what you think..."
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#002045] to-[#1A365D] font-semibold text-white transition hover:-translate-y-0.5"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Feedback
              </button>

              {feedbackSubmitted && (
                <div className="rounded-xl bg-[#E7F7EE] p-4">
                  <p className="text-sm font-bold text-[#003F23]">
                    Thank you for your feedback! We appreciate your input.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}