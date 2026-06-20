"use client";


import { usePathname, useRouter } from "next/navigation";
import SharedNavbar from "@/components/SharedNavbar";


export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();




  return (
    <>
    
      <main>
      
        {children}
      
        </main>
        </>
    
  );
}