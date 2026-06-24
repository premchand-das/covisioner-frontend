import type { Metadata } from "next";
import { Geist } from "next/font/google";

import SocketProvider from "@/components/SocketProvider";
import AuthProvider from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/seo";
import Script from "next/script";

import "./globals.css";

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
  authors: [{ name: "CoVisioner", url: siteConfig.url }],
  creator: "CoVisioner",
  publisher: "CoVisioner",
  category: "technology",

  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

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
    creator: "@covisioner",
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

verification: {
  google: "lzkuoWzi2mfECTUagCMZLTmpqGjsgTcTSN9OTRqfUNo",
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={cn("font-sans", geist.variable)}>
      <body>
        <Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `}
</Script>
        <SocketProvider>
          <AuthProvider>{children}</AuthProvider>
        </SocketProvider>
      </body>
    </html>
  );
}