import type { Metadata } from "next";
import SocketProvider from "@/components/SocketProvider";
import AuthProvider from "@/components/AuthProvider";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: "%s | CoVisioner",
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,

  applicationName: "CoVisioner",
  authors: [{ name: "CoVisioner" }],
  creator: "CoVisioner",
  publisher: "CoVisioner",

  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "CoVisioner",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "CoVisioner startup discovery and co-founder network",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <SocketProvider>
          <AuthProvider>{children}</AuthProvider>
        </SocketProvider>
      </body>
    </html>
  );
}