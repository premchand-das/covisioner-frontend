"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Bookmark,
  Menu,
  MessageCircle,
  User,
  X,
} from "lucide-react";

import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export default function SharedNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount, incrementUnread } =
    useNotificationStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const role = user?.role;
  const isStartup = role === "startup";

  const dashboardHref = isStartup
  ? "/startup/dashboard"
  : "/talent/saved-jobs";
  const profileHref = isStartup ? "/startup/profile" : "/talent/profile";
  const applicationsHref = isStartup
    ? "/startup/applications"
    : "/talent/applications";
  const messagesHref = isStartup ? "/startup/messages" : "/talent/messages";
  const notificationsHref = isStartup
    ? "/startup/notifications"
    : "/talent/notifications";

  const navItems = isStartup
    ? [
        {
          label: "Explore Startups",
          href: "/startup/startups",
          icon: Building2,
        },
        // {
        //   label: "Explore Jobs",
        //   href: "/startup/jobs",
        //   icon: Briefcase,
        // },
      ]
    : [
        {
          label: "Explore Startups",
          href: "/talent/explore/startups",
          icon: Building2,
        },
        {
          label: "Explore Jobs",
          href: "/talent/explore/jobs",
          icon: Briefcase,
        },
      ];

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", user._id);

    fetchUnreadCount();

    socket.on("notification", () => {
      incrementUnread();
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id, fetchUnreadCount, incrementUnread]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleLogout = async () => {
    await logout();
    socket.disconnect();
    router.push("/login");
  };

  const closeAll = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={dashboardHref}
          onClick={closeAll}
          className="flex items-center gap-3"
        >


          <div>
            <h1 className="text-lg font-black tracking-tight text-[#181C1E]">
              CoVisioner
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              {isStartup ? "Startup Hiring" : "Talent Network"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-[#002045] text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-[#002045]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={messagesHref}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#002045]"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>

          <Link
            href={notificationsHref}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#002045]"
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-2xl bg-slate-100 px-2 py-2 hover:bg-blue-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#002045] text-sm font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10">
                <div className="bg-slate-50 p-5">
                  <h3 className="truncate font-bold text-[#181C1E]">
                    {user?.username || "User"}
                  </h3>
                  <p className="truncate text-sm text-slate-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="p-2">
                {isStartup ? (
  <MenuLink
    href="/startup/dashboard"
    icon={Building2}
    label="Dashboard"
    onClick={closeAll}
  />
) : (
  <MenuLink
    href="/talent/saved-jobs"
    icon={Bookmark}
    label="Saved Jobs"
    onClick={closeAll}
  />
)}
                  <MenuLink
                    href={applicationsHref}
                    icon={FileText}
                    label="Applications"
                    onClick={closeAll}
                  />
                  <MenuLink
                    href={profileHref}
                    icon={User}
                    label="Profile"
                    onClick={closeAll}
                  />
                  <MenuLink
                    href={messagesHref}
                    icon={MessageCircle}
                    label="Messages"
                    onClick={closeAll}
                  />
                  <MenuLink
                    href={notificationsHref}
                    icon={Bell}
                    label="Notifications"
                    onClick={closeAll}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[#002045] md:hidden"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 md:hidden">
          <div className="mt-4 rounded-3xl bg-slate-50 p-3">
            {navItems.map((item) => (
              <MobileMenuLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                pathname={pathname}
                onClick={closeAll}
              />
            ))}

{isStartup ? (
  <MobileMenuLink
    href="/startup/dashboard"
    icon={Building2}
    label="Dashboard"
    pathname={pathname}
    onClick={closeAll}
  />
) : (
  <MobileMenuLink
    href="/talent/saved-jobs"
    icon={Bookmark}
    label="Saved Jobs"
    pathname={pathname}
    onClick={closeAll}
  />
)}
            <MobileMenuLink
              href={applicationsHref}
              icon={FileText}
              label="Applications"
              pathname={pathname}
              onClick={closeAll}
            />
            <MobileMenuLink
              href={messagesHref}
              icon={MessageCircle}
              label="Messages"
              pathname={pathname}
              onClick={closeAll}
            />
            <MobileMenuLink
              href={notificationsHref}
              icon={Bell}
              label="Notifications"
              pathname={pathname}
              onClick={closeAll}
            />
            <MobileMenuLink
              href={profileHref}
              icon={User}
              label="Profile"
              pathname={pathname}
              onClick={closeAll}
            />

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-[#002045]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function MobileMenuLink({
  href,
  icon: Icon,
  label,
  pathname,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string;
  onClick: () => void;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
        active ? "bg-[#002045] text-white" : "text-[#181C1E] hover:bg-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}