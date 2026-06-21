import { create } from "zustand";
import { ApiClient } from "@/lib/api-client";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, _get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const res = await ApiClient.get<any>("/notifications");
      const notifications = res?.data || res || [];
      set({
        notifications,
        unreadCount: notifications.filter((n: Notification) => !n.isRead).length,
      });
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (id: string) => {
    try {
      await ApiClient.post<any>(`/notifications/${id}/read`, {});
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        );
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        };
      });
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  },

  markAllAsRead: async () => {
    try {
      await ApiClient.post<any>("/notifications/read-all", {});
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  },
}));
