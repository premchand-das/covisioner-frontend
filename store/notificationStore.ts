import { create } from "zustand";
import api from "@/lib/api";

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: () => Promise<void>;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async () => {
    const res = await api.get("/notifications");

    const unread = res.data.notifications.filter(
      (item: any) => !item.isRead
    ).length;

    set({ unreadCount: unread });
  },

  incrementUnread: () => {
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    }));
  },

  resetUnread: () => {
    set({ unreadCount: 0 });
  },
}));