"use client";

import React, { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  Bell as BellIcon,
  CheckCircle2 as CheckCircle2Icon,
  Clock as ClockIcon,
} from "lucide-react";
const Bell = BellIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;
const Clock = ClockIcon as any;
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="w-6 h-6 text-indigo-500" />
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your alerts and system messages</p>
        </div>
        <button
          onClick={() => markAllAsRead()}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              You're all caught up!
            </h3>
            <p className="text-sm text-slate-500">No new notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors ${!n.isRead ? "bg-amber-50/30 dark:bg-amber-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h4
                      className={`text-sm ${!n.isRead ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}
                    >
                      {n.title}
                    </h4>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.body}</p>

                  {n.actionUrl && (
                    <a
                      href={n.actionUrl}
                      className="inline-block mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Details &rarr;
                    </a>
                  )}
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
