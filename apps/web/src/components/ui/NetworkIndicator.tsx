"use client";

import React, { useEffect, useState } from "react";
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  RefreshCw as RefreshCwIcon,
  AlertTriangle as AlertTriangleIcon,
} from "lucide-react";
const Wifi = WifiIcon as any;
const WifiOff = WifiOffIcon as any;
const RefreshCw = RefreshCwIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
import { useSyncStore } from "../../stores/syncStore";

export const NetworkIndicator = () => {
  const { isOnline, queue, syncStatus } = useSyncStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isOnline && queue.length === 0 && syncStatus === "IDLE") {
    return null; // Hidden when everything is perfect
  }

  return (
    <div
      className={`fixed bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-all duration-300 ${
        !isOnline
          ? "bg-orange-100 text-orange-800 border border-orange-300"
          : syncStatus === "SYNCING"
            ? "bg-blue-100 text-blue-800 border border-blue-300"
            : syncStatus === "ERROR"
              ? "bg-red-100 text-red-800 border border-red-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff size={16} />
          <span>Offline - {queue.length} items queued</span>
        </>
      ) : syncStatus === "SYNCING" ? (
        <>
          <RefreshCw size={16} className="animate-spin" />
          <span>Syncing {queue.length} items to cloud...</span>
        </>
      ) : syncStatus === "ERROR" ? (
        <>
          <AlertTriangle size={16} />
          <span>Sync failed. Retrying later.</span>
        </>
      ) : (
        <>
          <Wifi size={16} />
          <span>Back online. Sync pending...</span>
        </>
      )}
    </div>
  );
};
