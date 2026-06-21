import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMultiplayerStore } from "../store/multiplayer-state";

// MOCK DATA REMOVED

export function useMultiplayerEngine() {
  const pathname = usePathname();
  const { updateUserPresence, addActivity, updateCursor, removeCursor } = useMultiplayerStore();

  useEffect(() => {
    // TODO: Connect to Realtime Websocket Gateway
    // const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    // socket.on('cursor_move', handleCursorMove);
    // socket.on('user_joined', handleUserJoined);
    
    return () => {
      // socket.disconnect();
    };
  }, [pathname, updateUserPresence, addActivity, updateCursor, removeCursor]);
}
