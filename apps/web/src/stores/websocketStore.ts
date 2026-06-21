import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface WebsocketState {
  socket: Socket | null;
  isConnected: boolean;
  metrics: any;
  notifications: any[];
  connect: (token: string) => void;
  disconnect: () => void;
  clearNotifications: () => void;
}

const SOCKET_URL =
  typeof window !== "undefined"
    ? window.location.protocol + "//" + window.location.hostname + ":3001"
    : "http://localhost:3001";

export const useWebsocketStore = create<WebsocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  metrics: null,
  notifications: [],

  connect: (token: string) => {
    if (get().socket) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
      query: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to WS");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WS");
      set({ isConnected: false });
    });

    socket.on("notification", (data: any) => {
      set((state) => ({ notifications: [data, ...state.notifications] }));
      // Optional: integration with sonner toast can be done in components
    });

    socket.on("telemetry_update", (data: any) => {
      set({ metrics: data });
    });

    set({ socket });
  },

  clearNotifications: () => set({ notifications: [] }),

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
