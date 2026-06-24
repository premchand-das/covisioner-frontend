import Link from "next/link";
import { Mail } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function HomeFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#FBFAF7] px-5 py-12 text-neutral-950 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr]">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
            CoVisioner
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-neutral-500">
            A startup discovery platform for founders, talent, learners, and
            the future startup ecosystem.
          </p>
        </div>

        <FooterGroup
          title="Platform"
          links={[
            ["Startups", "/talent/explore/startups"],
            ["Jobs", "/talent/explore/jobs"],
            ["Create Profile", "/signup"],
          ]}
        />

        <FooterGroup
          title="Learn"
          links={[
            ["Case Studies", "/case-studies"],
            ["Blog", "/blog"],
            ["Founder Stories", "/founder-stories"],
          ]}
        />

<div>
  <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
    Contact
  </p>

  <a
    href="mailto:support@covisioner.com"
    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
  >
    <Mail size={16} />
    support@covisioner.com
  </a>

  <div className="mt-6">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
      Follow Us
    </p>

    <div className="flex items-center gap-3">
      <a
        href="https://www.linkedin.com/company/covisioner"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
      >
        <FaLinkedinIn size={18} />
      </a>

      <a
        href="https://www.instagram.com/covisioner"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
      >
        <FaInstagram size={18} />
      </a>
      <a
        href="https://www.x.com/covisioner"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="x"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
      >
        <FaXTwitter size={18} />
      </a>
    </div>
  </div>
</div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-black/[0.06] pt-6 text-xs text-neutral-400 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} CoVisioner</span>
        <span>Built for people who want to discover, join, and build startups.</span>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
        {title}
      </p>

      <div className="space-y-3 text-sm font-medium text-neutral-500">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="block hover:text-neutral-950">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}