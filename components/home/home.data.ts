import {
  Building2,
  Users,
  BookOpen,
  BriefcaseBusiness,
  Newspaper,
  Landmark,
  Network,
  Search,
} from "lucide-react";

export const features = [
  {
    title: "Startup Discovery",
    text: "Explore startups by mission, team, industry, stage, and open roles.",
  },
  {
    title: "Startup Jobs",
    text: "Find early opportunities where your work can shape the company.",
  },
  {
    title: "Case Studies",
    text: "Learn how startups grow, fail, pivot, and win.",
  },
  {
    title: "Founder Visibility",
    text: "Help people understand your startup before they apply.",
  },
];

export const audiences = [
  {
    icon: Building2,
    eyebrow: "For Founders",
    title: "Show more than a job post.",
    text: "Build a startup profile that explains your mission, team, product, traction, culture, and open roles.",
  },
  {
    icon: Users,
    eyebrow: "For Talent",
    title: "Join startups with context.",
    text: "Understand the company, the people, and the opportunity before you apply.",
  },
  {
    icon: BookOpen,
    eyebrow: "For Learners",
    title: "Study how startups are built.",
    text: "Read case studies, founder stories, growth breakdowns, and startup lessons.",
  },
  {
    icon: Landmark,
    eyebrow: "Future Investors",
    title: "Discover signals early.",
    text: "A future layer for investors to discover promising startups and follow traction.",
  },
];

export const steps = [
  { icon: Search, title: "Discover", text: "Find startups worth knowing." },
  { icon: Network, title: "Understand", text: "Read their story and context." },
  { icon: BriefcaseBusiness, title: "Apply", text: "Join roles aligned with your goals." },
  { icon: Newspaper, title: "Learn", text: "Follow startup stories and lessons." },
];

export const caseStudies = [
  {
    title: "How Airbnb built trust into a marketplace",
    category: "Marketplace",
    image: "/home/case-study-1.jpg",
  },
  {
    title: "Why Stripe became loved by developers",
    category: "Fintech",
    image: "/home/case-study-2.jpg",
  },
  {
    title: "How Notion turned product into community",
    category: "Product",
    image: "/home/case-study-3.jpg",
  },
];

export const blogs = [
  {
    title: "What early startups should show before hiring",
    category: "Hiring",
    image: "/home/blog-1.jpg",
  },
  {
    title: "Why talent wants mission clarity",
    category: "Talent",
    image: "/home/blog-2.jpg",
  },
  {
    title: "The future of startup discovery",
    category: "Ecosystem",
    image: "/home/blog-3.jpg",
  },
];

export const faqs = [
  {
    q: "Is CoVisioner only a job board?",
    a: "No. Jobs are one layer. CoVisioner is built for startup discovery, hiring, learning, and future ecosystem intelligence.",
  },
  {
    q: "Can early-stage startups join?",
    a: "Yes. CoVisioner is especially useful for early teams that need visibility, credibility, and talent.",
  },
  {
    q: "Will blogs and case studies come from backend?",
    a: "Yes. Right now they are static. Later they can come from your blog and case-study APIs.",
  },
];