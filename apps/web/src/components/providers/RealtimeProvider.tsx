"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useWebsocketStore } from "../../stores/websocketStore";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore() as any;
  const { connect, disconnect, isConnected } = useWebsocketStore();

  useEffect(() => {
    // Connect globally when we have a token
    if (token && !isConnected) {
      connect(token);
    }
    
    // Disconnect globally on unmount or token removal
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [token, connect, disconnect, isConnected]);

  return <>{children}</>;
}
