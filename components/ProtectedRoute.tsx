"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: "talent" | "startup";
}) {
  const router = useRouter();
  const { user, authChecked, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, checkAuth]);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      router.replace("/");
    }
  }, [authChecked, user, allowedRole, router]);

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A12] text-white">
        Loading...
      </main>
    );
  }

  if (!user) return null;

  if (allowedRole && user.role !== allowedRole) return null;

  return <>{children}</>;
}