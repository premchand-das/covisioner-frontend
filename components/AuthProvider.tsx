"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export  function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, fetchUser } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        checkAuth();
        await fetchUser();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [checkAuth, fetchUser]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A12] text-white">
        Loading...
      </main>
    );
  }

  return <>{children}</>;
}
export default AuthProvider;