"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Inbox,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import SharedNavbar from "@/components/SharedNavbar";
import api from "@/lib/api";
import { useNotificationStore } from "@/store/notificationStore";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    username: string;
    avatar?: string;
    role: string;
  };
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [readingId, setReadingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const { resetUnread } = useNotificationStore();

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const readCount = notifications.length - unreadCount;

  const getNotificationHref = (item: Notification) => {
    const type = item.type?.toLowerCase() || "";
    const title = item.title?.toLowerCase() || "";
    const message = item.message?.toLowerCase() || "";

    const isMessageNotification =
      type.includes("message") ||
      title.includes("message") ||
      message.includes("message");

    if (isMessageNotification) {
      if (item.sender?.role === "startup") return "/talent/messages";
      if (item.sender?.role === "talent") return "/startup/messages";
      return "";
    }

    return item.link || "";
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      setError("");

      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to refresh notifications. Please try again."
      );
    }
  };

  const markAsRead = async (id: string) => {
    const previousNotifications = notifications;

    try {
      setReadingId(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );

      await api.patch(`/notifications/${id}/read`);
    } catch (err: any) {
      setNotifications(previousNotifications);
      setError(
        err?.response?.data?.message ||
          "Unable to mark this notification as read."
      );
    } finally {
      setReadingId("");
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    const previousNotifications = notifications;

    try {
      setMarkingAll(true);

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      resetUnread();

      await api.patch("/notifications/read-all");
    } catch (err: any) {
      setNotifications(previousNotifications);
      setError(
        err?.response?.data?.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm("Delete this notification?")) return;

    const previousNotifications = notifications;

    try {
      setDeletingId(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      await api.delete(`/notifications/${id}`);
    } catch (err: any) {
      setNotifications(previousNotifications);
      setError(
        err?.response?.data?.message || "Unable to delete this notification."
      );
    } finally {
      setDeletingId("");
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!confirm("Clear all notifications?")) return;

    const previousNotifications = notifications;

    try {
      setClearingAll(true);

      setNotifications([]);
      resetUnread();

      await api.delete("/notifications");
    } catch (err: any) {
      setNotifications(previousNotifications);
      setError(
        err?.response?.data?.message || "Unable to clear notifications."
      );
    } finally {
      setClearingAll(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <SharedNavbar />

      <main className="min-h-screen bg-[#F6F5F0] text-neutral-950">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
          <section className="rounded-[34px] border border-black/[0.06] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.07)] sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F5F0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  <Bell className="h-4 w-4" />
                  Notification Center
                </div>

                <h1 className="mt-5 text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">
                  Updates that matter.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-500">
                  Track applications, messages, job activity, and important
                  platform updates in one clean place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={refreshNotifications}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-[16px] border border-black/[0.06] bg-[#F6F5F0] px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </button>

                <button
                  onClick={markAllAsRead}
                  disabled={markingAll || unreadCount === 0}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCheck className="h-4 w-4" />
                  {markingAll ? "Marking..." : "Mark all read"}
                </button>

                <button
                  onClick={clearAllNotifications}
                  disabled={clearingAll || notifications.length === 0}
                  className="inline-flex items-center gap-2 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {clearingAll ? "Clearing..." : "Clear all"}
                </button>
              </div>
            </div>


          </section>

          <section className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Recent Activity
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {notifications.length} notifications
                  {unreadCount > 0 && (
                    <span className="ml-3 text-base font-medium tracking-normal text-neutral-400">
                      {unreadCount} unread
                    </span>
                  )}
                </h2>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="rounded-full p-1 transition hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid gap-3">
              {loading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex gap-4">
                      <div className="h-14 w-14 rounded-[18px] bg-[#F6F5F0]" />

                      <div className="flex-1">
                        <div className="h-4 w-48 rounded-full bg-[#F6F5F0]" />
                        <div className="mt-3 h-3 w-full max-w-xl rounded-full bg-[#F6F5F0]" />
                        <div className="mt-2 h-3 w-72 rounded-full bg-[#F6F5F0]" />
                      </div>
                    </div>
                  </div>
                ))}

              {!loading &&
                notifications.map((item) => {
                  const href = getNotificationHref(item);

                  return (
                    <article
                      key={item._id}
                      className={`group rounded-[28px] border bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.07)] ${
                        item.isRead
                          ? "border-black/[0.06] opacity-80"
                          : "border-neutral-950/10 ring-1 ring-neutral-950/5"
                      }`}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#F6F5F0] text-neutral-700">
                            {item.sender?.avatar ? (
                              <img
                                src={item.sender.avatar}
                                alt={item.sender.username}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6" />
                            )}

                            {!item.isRead && (
                              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-950 ring-2 ring-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className={`text-lg font-semibold tracking-[-0.03em] ${
                                  item.isRead
                                    ? "text-neutral-500"
                                    : "text-neutral-950"
                                }`}
                              >
                                {item.title}
                              </h3>

                              {!item.isRead ? (
                                <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                  New
                                </span>
                              ) : (
                                <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                                  Read
                                </span>
                              )}
                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
                              {item.message}
                            </p>

                            <p className="mt-3 text-xs font-medium text-neutral-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                          {href && (
                            <Link
                              href={href}
                              onClick={() => {
                                if (!item.isRead) {
                                  markAsRead(item._id);
                                }
                              }}
                              className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-black/[0.06] bg-[#F6F5F0] px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200"
                            >
                              
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}

                          {!item.isRead && (
                            <button
                              onClick={() => markAsRead(item._id)}
                              disabled={readingId === item._id}
                              className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-neutral-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {readingId === item._id ? "Reading..." : "Read"}
                            </button>
                          )}

                          <button
                            onClick={() => deleteNotification(item._id)}
                            disabled={deletingId === item._id}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

              {!loading && notifications.length === 0 && (
                <div className="rounded-[34px] border border-black/[0.06] bg-white px-6 py-20 text-center shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F6F5F0]">
                    <Inbox className="h-7 w-7 text-neutral-700" />
                  </div>

                  <h3 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">
                    You’re all caught up.
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Applications, messages, jobs, and platform alerts will
                    appear here.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-[#FBFAF7] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white text-neutral-700">
          {icon}
        </div>

        <p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}