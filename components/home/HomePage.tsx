"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import {
  audiences,
  blogs,
  caseStudies,
  faqs,
  features,
  steps,
} from "./home.data";
import HomeFooter from "./HomeFooter";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23FBFAF7'/%3E%3Ccircle cx='280' cy='220' r='120' fill='%23ECE7DC' fill-opacity='.18'/%3E%3Ccircle cx='820' cy='460' r='220' fill='%23ECE7DC' fill-opacity='.10'/%3E%3Cpath d='M180 560 C360 340 520 680 720 430 S980 310 1060 210' stroke='%230A0A0A' stroke-width='3' fill='none' opacity='.45'/%3E%3C/svg%3E";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <Reveal>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="max-w-6xl font-sans text-[44px] font-semibold leading-[0.9] tracking-[-0.045em] text-neutral-950 sm:text-[72px] lg:text-[112px]">
        {title}
      </h2>
      {text && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-500 md:text-lg">
          {text}
        </p>
      )}
    </Reveal>
  );
}

function ContentCard({
  item,
}: {
  item: { title: string; category: string; image: string };
}) {
  const [imageSrc, setImageSrc] = useState(item.image || FALLBACK_IMAGE);

  return (
    <Reveal>
      <article className="group overflow-hidden rounded-[22px] bg-neutral-950 text-white ring-1 ring-black/[0.06]">
        <div className="relative h-56 overflow-hidden bg-neutral-950 md:h-64">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            unoptimized={imageSrc.startsWith("data:") || imageSrc.startsWith("http")}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
            className="object-cover opacity-90 grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent" />
        </div>

        <div className="p-5">
          <p className="mb-8 text-xs uppercase tracking-[0.18em] text-white/70">
            {item.category}
          </p>
          <h3 className="text-3xl font-semibold leading-[0.95] tracking-[-0.04em]">
            {item.title}
          </h3>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/60">
            Coming soon <ArrowUpRight size={14} aria-hidden="true" />
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -55]);
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.97]);

const [contactForm, setContactForm] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const [contactLoading, setContactLoading] = useState(false);
const [contactSuccess, setContactSuccess] = useState("");
const [contactError, setContactError] = useState("");

const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setContactLoading(true);
  setContactSuccess("");
  setContactError("");

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "ace40591-d3b1-469f-a485-ddda878db474",
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject || "New CoVisioner Contact Message",
        message: contactForm.message,
        from_name: "CoVisioner Website",
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to send message");
    }

    setContactSuccess("Message sent successfully.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch {
    setContactError("Message failed. Please try again.");
  } finally {
    setContactLoading(false);
  }
};

  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F5F0] text-neutral-950">
      {/* NAV */}
      <nav className="fixed left-0 right-0 top-0 z-50 bg-[#F6F5F0]/90 px-5 py-4 backdrop-blur md:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[-0.01em]">
            Co<span className="text-neutral-950">Visioner</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-neutral-950/75 md:flex">
            <Link href="/talent/explore/startups" className="hover:text-neutral-950">
              Startups
            </Link>
            <Link href="/talent/explore/jobs" className="hover:text-neutral-950">
              Jobs
            </Link>
            <Link href="/login" className="hover:text-neutral-950">
              Login
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
            >
              Join
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="rounded-full border border-black/[0.06] p-3 md:hidden"
            >
              {mobileMenuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mx-auto mt-4 grid max-w-[1440px] gap-2 rounded-[22px] border border-black/[0.06] bg-white/90 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
            <Link
              href="/talent/explore/startups"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-[#F6F5F0] hover:text-neutral-950"
            >
              Startups
            </Link>
            <Link
              href="/talent/explore/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-[#F6F5F0] hover:text-neutral-950"
            >
              Jobs
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-[#F6F5F0] hover:text-neutral-950"
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-28 md:px-12 md:pt-32">
        <motion.div style={{ y: heroY, scale: heroScale }}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Startup discovery, hiring, and learning.
          </p>

          <h1 className="max-w-7xl font-sans text-[62px] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[104px] md:text-[142px] lg:text-[184px]">
            Find startups
            <br />
            worth building
            <br />
            with.
          </h1>

          <div className="mt-7 grid gap-6 md:grid-cols-[430px_1fr]">
            <p className="max-w-md text-base leading-7 text-neutral-500 md:text-lg">
              CoVisioner helps founders explain their startups, talent discover
              meaningful opportunities, and curious people learn how startups
              are actually built.
            </p>

            <div className="flex flex-wrap items-start gap-4 md:justify-end">
              <Link
                href="/talent/explore/startups"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
              >
                Explore Startups <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/talent/explore/jobs"
                className="rounded-full border border-black/[0.06] px-7 py-4 text-sm text-neutral-950"
              >
                View Jobs
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HERO STRIP */}
      <section className="mx-auto grid max-w-[1440px] gap-4 px-5 py-6 md:grid-cols-3 md:px-12">
        {[
          ["For founders", "Tell the story behind your company."],
          ["For talent", "Find roles with context and meaning."],
          ["For learners", "Study the companies shaping the future."],
        ].map(([title, text]) => (
          <Reveal key={title}>
            <div className="rounded-[22px] bg-neutral-950 p-5 text-white">
              <div className="mb-12 h-1 w-12 bg-white" />
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/60">{text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">
        <SectionTitle
          eyebrow="What is CoVisioner?"
          title="A clearer way to discover the startup world."
          text="Most platforms show a logo, a job title, and a form. CoVisioner is being built to show the context: the mission, the people, the work, the lessons, and the opportunity."
        />
      </section>

      {/* FEATURES */}
      <section className="mx-auto grid max-w-[1440px] gap-4 px-5 py-8 md:grid-cols-2 md:px-12 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title}>
            <div className="h-full min-h-[220px] rounded-[22px] border border-black/[0.06] bg-white/70 p-5">
              <div className="mb-10 h-1 w-12 bg-neutral-950" />
              <p className="mb-3 text-xs text-neutral-500">0{index + 1}</p>
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-neutral-500">
                {feature.text}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* HOW */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">
        <SectionTitle
          eyebrow="How it works"
          title="From discovery to conversation."
        />

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title}>
                <div className="h-full min-h-[190px] rounded-[22px] bg-neutral-950 p-5 text-white">
                  <Icon className="h-7 w-7 text-white" />
                  <span className="mt-10 block text-xs text-white/40">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* AUDIENCE */}
      {audiences.map((item, index) => {
        const Icon = item.icon;
        return (
          <section
            key={item.eyebrow}
            className="mx-auto grid max-w-[1440px] gap-7 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-12 md:py-20"
          >
            <Reveal className={index % 2 ? "md:order-2" : ""}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {item.eyebrow}
              </p>

              <h2 className="font-sans text-[46px] font-semibold leading-[0.9] tracking-[-0.045em] sm:text-[72px] lg:text-[104px]">
                {item.title}
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-500 md:text-lg">
                {item.text}
              </p>
            </Reveal>

            <Reveal>
              <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-neutral-950 p-6 text-white md:min-h-[390px]">
                <Icon className="h-10 w-10 text-white" />

                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      x: [0, Math.sin(i) * 34, 0],
                      y: [0, Math.cos(i) * 34, 0],
                      opacity: [0.2, 0.85, 0.2],
                    }}
                    transition={{
                      duration: 4 + (i % 5),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute h-1.5 w-1.5 rounded-full bg-white"
                    style={{
                      left: `${8 + ((i * 17) % 84)}%`,
                      top: `${14 + ((i * 23) % 72)}%`,
                    }}
                  />
                ))}

                <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-6 text-white/60">
                  {item.eyebrow} becomes part of the wider CoVisioner network.
                </p>
              </div>
            </Reveal>
          </section>
        );
      })}

      {/* CASE STUDIES */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">
        <SectionTitle
          eyebrow="Case studies"
          title="Learn how companies are built."
          text="Static for now. Later this section should use your backend case-study API."
        />

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {caseStudies.map((item) => (
            <ContentCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">
        <SectionTitle
          eyebrow="Blog"
          title="Startup stories, hiring lessons, and ecosystem notes."
          text="Static now. Later this section should use your backend blog API."
        />

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {blogs.map((item) => (
            <ContentCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      
{/* CONTACT */}


<section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">

  <Reveal>
    <div className="grid gap-10 rounded-[32px] bg-neutral-950 p-8 text-white lg:grid-cols-[1fr_520px] lg:p-12">

      {/* Left */}
      <div className="flex flex-col justify-between">
        <div>
          <Mail className="mb-8 h-10 w-10" />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Contact
          </p>

          <h2 className="mt-4 max-w-3xl text-[46px] font-semibold leading-[0.9] tracking-[-0.045em] sm:text-[78px]">
            Have a startup,
            <br />
            question or idea?
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/60">
            Whether you're a founder, talent, student, partner, or simply
            curious about CoVisioner, we'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 space-y-3 text-sm text-white/60">
          <p>📧 support@covisioner.com</p>
          <p>Usually replies within 24 hours.</p>
        </div>
      </div>

      {/* Right */}
<form
  onSubmit={handleContactSubmit}
  className="rounded-[28px] bg-white p-7 text-neutral-950 shadow-2xl"
>
  <div className="space-y-5">
    <input
      required
      value={contactForm.name}
      onChange={(e) =>
        setContactForm({ ...contactForm, name: e.target.value })
      }
      placeholder="Your name"
      className="h-14 w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-5 outline-none focus:border-neutral-950"
    />

    <input
      required
      type="email"
      value={contactForm.email}
      onChange={(e) =>
        setContactForm({ ...contactForm, email: e.target.value })
      }
      placeholder="Your email"
      className="h-14 w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-5 outline-none focus:border-neutral-950"
    />

    <input
      value={contactForm.subject}
      onChange={(e) =>
        setContactForm({ ...contactForm, subject: e.target.value })
      }
      placeholder="Subject"
      className="h-14 w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-5 outline-none focus:border-neutral-950"
    />

    <textarea
      required
      rows={6}
      value={contactForm.message}
      onChange={(e) =>
        setContactForm({ ...contactForm, message: e.target.value })
      }
      placeholder="Your message"
      className="w-full rounded-2xl border border-black/[0.06] bg-[#F6F5F0] p-5 outline-none focus:border-neutral-950"
    />

    {contactSuccess && (
      <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        {contactSuccess}
      </p>
    )}

    {contactError && (
      <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {contactError}
      </p>
    )}

    <button
      type="submit"
      disabled={contactLoading}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {contactLoading ? "Sending..." : "Send Message"}
      <ArrowUpRight size={18} />
    </button>
  </div>
</form>

    </div>
  </Reveal>
</section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20">
        <SectionTitle eyebrow="FAQ" title="Simple answers." />

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {faqs.map((faq) => (
            <Reveal key={faq.q}>
              <div className="h-full rounded-[22px] border border-black/[0.06] bg-white/70 p-5">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  {faq.q}
                </h3>
                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  {faq.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Start here
          </p>

          <h2 className="max-w-6xl font-sans text-[54px] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[96px] lg:text-[145px]">
            Discover startups before everyone else.
          </h2>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-neutral-950 px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
            >
              Create Profile →
            </Link>

            <Link
              href="/talent/explore/startups"
              className="rounded-full border border-black/[0.06] px-7 py-4 text-sm"
            >
              Explore Startups
            </Link>
          </div>
        </Reveal>
      </section>

      <HomeFooter />
    </main>
  );
}