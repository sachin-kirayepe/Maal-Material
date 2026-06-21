import { useState, useCallback } from "react";
import { useOmniCopilotStore } from "../store/omni-copilot-state";

// Pre-defined complex responses to simulate AI intelligence
const SCENARIOS = {
  dispatch: {
    reasoning: [
      "Analyzing global fleet telemetry...",
      "Identifying nearest available Class-A transport...",
      "Calculating optimal predictive routing via Edge Node Alpha...",
      "Drafting dispatch authorization...",
    ],
    text: "I have calculated the optimal route for Fleet Dispatch. Authorization is pending your approval.",
    action: {
      type: "DISPATCH_FLEET" as const,
      payload: { fleetId: "FLT-892", route: "Sector 7G -> Delta Hub", eta: "45 mins" },
      status: "PENDING" as const,
    },
  },
  anomaly: {
    reasoning: [
      "Scanning recent thermal anomalies in Sector 4...",
      "Cross-referencing with historical digital twin data...",
      "Isolating root cause: Main coolant valve latency...",
      "Generating resolution protocol...",
    ],
    text: "The anomaly is caused by a 400ms latency spike in the Sector 4 coolant logic controller. I can attempt an automated soft-reset.",
    action: {
      type: "RESOLVE_ANOMALY" as const,
      payload: { target: "VLV-CTRL-04", action: "SOFT_RESET", riskLevel: "LOW" },
      status: "PENDING" as const,
    },
  },
  default: {
    reasoning: ["Parsing query parameters...", "Accessing enterprise knowledge graph..."],
    text: "I understand. I am continually monitoring the enterprise network. How else may I optimize your workflows?",
  },
};

export const useAIStreamSimulator = () => {
  const { addMessage, updateMessage } = useOmniCopilotStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateRequest = useCallback(
    async (userQuery: string) => {
      setIsProcessing(true);

      // 1. Add User Message
      addMessage({
        id: `usr-${Date.now()}`,
        role: "user",
        content: userQuery,
        timestamp: new Date().toISOString(),
      });

      // 2. Initialize Assistant Message
      const assistantMsgId = `ast-${Date.now()}`;
      addMessage({
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
        reasoningSteps: [],
      });

      // 3. Determine Scenario
      const lowerQuery = userQuery.toLowerCase();
      let scenario = SCENARIOS.default;
      if (lowerQuery.includes("dispatch") || lowerQuery.includes("fleet"))
        scenario = SCENARIOS.dispatch;
      else if (
        lowerQuery.includes("anomaly") ||
        lowerQuery.includes("error") ||
        lowerQuery.includes("fix")
      )
        scenario = SCENARIOS.anomaly;

      // 4. Stream Reasoning Steps
      let currentSteps: string[] = [];
      for (const step of scenario.reasoning) {
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500)); // Simulate think time
        currentSteps = [...currentSteps, step];
        updateMessage(assistantMsgId, { reasoningSteps: currentSteps });
      }

      // 5. Stream Text Content
      let streamedText = "";
      const words = scenario.text.split(" ");

      for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 40 + Math.random() * 60)); // Token streaming speed
        streamedText += word + " ";
        updateMessage(assistantMsgId, { content: streamedText });
      }

      // 6. Inject Generative Action (if any) and finalize
      setTimeout(() => {
        updateMessage(assistantMsgId, {
          isStreaming: false,
          content: streamedText.trim(),
          generativeAction: (scenario as any).action,
        });
        setIsProcessing(false);
      }, 500);
    },
    [addMessage, updateMessage],
  );

  return {
    simulateRequest,
    isProcessing,
  };
};
