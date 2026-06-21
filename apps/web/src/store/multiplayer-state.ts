import { create } from "zustand";

export interface RemoteUser {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  currentRoute: string;
  status: "active" | "idle" | "busy";
  lastActive: number;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: number;
  type: "procurement" | "system" | "intelligence" | "logistics";
}

export interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  isClicking: boolean;
  route: string;
}

interface MultiplayerState {
  // Presence
  activeUsers: Record<string, RemoteUser>;
  updateUserPresence: (user: RemoteUser) => void;
  removeUser: (userId: string) => void;

  // Cursors (using a fast, transient ref-friendly approach for UI)
  cursors: Record<string, CursorPosition>;
  updateCursor: (cursor: CursorPosition) => void;
  removeCursor: (userId: string) => void;

  // Activity Feed
  activityStream: ActivityEvent[];
  addActivity: (activity: ActivityEvent) => void;
  clearActivityStream: () => void;

  // Feed UI State
  isActivityFeedOpen: boolean;
  toggleActivityFeed: () => void;
  setActivityFeedOpen: (isOpen: boolean) => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  activeUsers: {},
  updateUserPresence: (user) =>
    set((state) => ({
      activeUsers: { ...state.activeUsers, [user.id]: user },
    })),
  removeUser: (userId) =>
    set((state) => {
      const newUsers = { ...state.activeUsers };
      delete newUsers[userId];
      return { activeUsers: newUsers };
    }),

  cursors: {},
  updateCursor: (cursor) =>
    set((state) => ({
      cursors: { ...state.cursors, [cursor.userId]: cursor },
    })),
  removeCursor: (userId) =>
    set((state) => {
      const newCursors = { ...state.cursors };
      delete newCursors[userId];
      return { cursors: newCursors };
    }),

  activityStream: [],
  addActivity: (activity) =>
    set((state) => ({
      activityStream: [activity, ...state.activityStream].slice(0, 50), // Keep last 50 events
    })),
  clearActivityStream: () => set({ activityStream: [] }),

  isActivityFeedOpen: false,
  toggleActivityFeed: () => set((state) => ({ isActivityFeedOpen: !state.isActivityFeedOpen })),
  setActivityFeedOpen: (isOpen) => set({ isActivityFeedOpen: isOpen }),
}));
