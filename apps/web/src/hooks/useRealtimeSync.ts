import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";
// Use granular stores or a master dispatcher depending on the architecture
import { useWarehouseStore } from "../stores/warehouseStore";
import { useFleetStore } from "../stores/fleetStore";
let socket: Socket | null = null;

export const useRealtimeSync = () => {
  const token = useAuthStore((state: any) => state.token);
  const tenantId = useAuthStore((state: any) => state.tenantId);
  const updateWarehouse = useWarehouseStore(
    (state: any) => state.updateWarehouse || state.createWarehouse,
  );
  const updateVehicle = useFleetStore((state: any) => state.updateVehicle || state.addVehicle);
  // Add other store updaters as needed...

  useEffect(() => {
    if (!token || !tenantId) return;

    // Connect to the unified Realtime Gateway
    socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", {
      auth: { token, tenantId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[RealtimeSync] Connected to workspace channel.");
    });

    /**
     * Standardized Enterprise Domain Event Payload Structure
     * Expected Payload: { eventId, domain, action, payload, timestamp }
     */
    socket.on("domain_event", (event) => {
      console.log(`[RealtimeSync] Received event: ${event.domain}.${event.action}`, event);

      // Route the domain event to the appropriate Zustand store
      switch (event.domain) {
        case "warehouse":
          if (event.action === "updated") {
            updateWarehouse(event.payload.id, event.payload);
          }
          break;
        case "fleet":
          if (event.action === "status_changed") {
            updateVehicle(event.payload.id, event.payload);
          }
          break;
        // Extensible mapping layer for universal commerce entities
        case "inventory":
          // Handle inventory generic events
          break;
        default:
          console.warn(`[RealtimeSync] Unhandled domain event: ${event.domain}`);
      }
    });

    socket.on("disconnect", () => {
      console.warn("[RealtimeSync] Disconnected. Waiting for auto-reconnect.");
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [token, tenantId]);
};
