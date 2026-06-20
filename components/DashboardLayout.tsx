"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { socket } from "@/lib/socket";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { unreadCount, fetchUnreadCount, incrementUnread } =
    useNotificationStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const links =
    user?.role === "talent"
      ? [

        { label: "Dashboard", href: "/talent/dashboard" },
        { label: "Profile", href: "/talent/profile" },
        { label: "Applications", href: "/talent/applications" },
        { label: "Saved Jobs", href: "/talent/saved-jobs" },
        { label: "Connections", href: "/connections" },
        { label: "Messages", href: "/messages" },
        { label: "Notifications", href: "/notifications" },

      ]
      : [
        { label: "Dashboard", href: "/startup/dashboard" },
        { label: "Profile", href: "/startup/profile" },
        { label: "Applications", href: "/startup/applications" },
        { label: "Discover Talent", href: "/startup/talent" },
        { label: "Connections", href: "/connections" },
        { label: "Messages", href: "/messages" },
        { label: "Notifications", href: "/notifications" },
      ];

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", user._id);

    socket.on("notification", () => {
      incrementUnread();
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id, incrementUnread]);

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-black/20 p-6 lg:block">
        <Link href="/" className="text-2xl font-bold">
          Zero
        </Link>

        <p className="mt-2 text-sm text-white/40 capitalize">
          {user?.role} account
        </p>

        <nav className="mt-10 grid gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white"
            >
              <span>{link.label}</span>

              {link.label === "Notifications" && unreadCount > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-black">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10"
        >
          Logout
        </button>
      </aside>

      <div className="lg:pl-64">{children}</div>
    </div>
  );
}