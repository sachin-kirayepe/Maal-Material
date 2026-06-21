import React, { useState } from "react";
import { useOmniCopilotStore, ChatMessage } from "../../store/omni-copilot-state";
import {
  Truck as TruckIcon,
  ShieldAlert as ShieldAlertIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronRight as ChevronRightIcon,
  Loader2 as Loader2Icon,
} from "lucide-react";
const Truck = TruckIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;
const ChevronRight = ChevronRightIcon as any;
const Loader2 = Loader2Icon as any;
import { Button } from "@constructos/ui";

interface GenerativeActionCardProps {
  messageId: string;
  action: NonNullable<ChatMessage["generativeAction"]>;
}

export function GenerativeActionCard({ messageId, action }: GenerativeActionCardProps) {
  const { updateMessage } = useOmniCopilotStore();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    updateMessage(messageId, { generativeAction: { ...action, status: "EXECUTING" } });

    // Simulate backend execution
    setTimeout(() => {
      setIsExecuting(false);
      updateMessage(messageId, { generativeAction: { ...action, status: "COMPLETED" } });
    }, 2000);
  };

  const renderPayloadDetails = () => {
    return Object.entries(action.payload).map(([key, value]) => (
      <div
        key={key}
        className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 text-xs"
      >
        <span className="text-muted-foreground uppercase">{key}</span>
        <span className="font-mono font-medium text-white">{String(value)}</span>
      </div>
    ));
  };

  const renderIcon = () => {
    switch (action.type) {
      case "DISPATCH_FLEET":
        return <Truck className="w-4 h-4 text-primary" />;
      case "RESOLVE_ANOMALY":
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      default:
        return <ChevronRight className="w-4 h-4 text-primary" />;
    }
  };

  const getButtonText = () => {
    if (action.status === "COMPLETED") return "EXECUTED";
    if (action.status === "EXECUTING") return "AUTHORIZING...";
    return "AUTHORIZE ACTION";
  };

  return (
    <div className="mt-4 border border-white/10 rounded-xl bg-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
        {renderIcon()}
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white">
          ACTION: {action.type.replace("_", " ")}
        </span>
      </div>

      <div className="p-4 space-y-2">{renderPayloadDetails()}</div>

      <div className="p-3 bg-background/50 border-t border-white/10">
        <Button
          variant={action.status === "COMPLETED" ? "outline" : "default"}
          className={`w-full font-mono text-[10px] tracking-widest uppercase h-8 ${
            action.status === "COMPLETED"
              ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10 pointer-events-none"
              : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
          }`}
          onClick={handleExecute}
          disabled={action.status !== "PENDING" || isExecuting}
        >
          {isExecuting && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
          {action.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3 mr-2" />}
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
