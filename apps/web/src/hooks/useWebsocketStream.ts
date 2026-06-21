import { useEffect } from "react";
import { useLiveOrchestratorStore } from "../store/live-orchestration-state";
import { useWebsocketStore } from "../stores/websocketStore";
import { useAuthStore } from "../stores/authStore";

export const useWebsocketStream = () => {
  const { appendMetrics, addAnomaly, addOrchestrationEvent, updateNodes } =
    useLiveOrchestratorStore();
  const { socket, connect } = useWebsocketStore();
  const { accessToken } = useAuthStore() as any;

  useEffect(() => {
    if (accessToken && !socket) {
      connect(accessToken);
    }

    return () => {
      // Opt to leave socket connected for global state or disconnect on unmount
    };
  }, [accessToken, connect, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("metrics", (data) => {
      appendMetrics(data);
    });

    socket.on("anomaly", (data) => {
      addAnomaly(data);
    });

    socket.on("orchestration", (data) => {
      addOrchestrationEvent(data);
    });

    socket.on("nodes", (data) => {
      updateNodes(data);
    });

    return () => {
      socket.off("metrics");
      socket.off("anomaly");
      socket.off("orchestration");
      socket.off("nodes");
    };
  }, [socket, appendMetrics, addAnomaly, addOrchestrationEvent, updateNodes]);
};
