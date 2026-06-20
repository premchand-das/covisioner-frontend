"use client";

import TalentNavbar from "@/components/TalentNavbar";

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <TalentNavbar />
      {children}
    </div>
  );
}