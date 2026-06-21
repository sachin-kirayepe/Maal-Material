import React from "react";
import { useMultiplayerStore } from "../../store/multiplayer-state";
import {
  X as XIcon,
  Activity as ActivityIcon,
  ShoppingCart as ShoppingCartIcon,
  Truck as TruckIcon,
  ShieldAlert as ShieldAlertIcon,
  Cpu as CpuIcon,
  Clock as ClockIcon,
} from "lucide-react";
const X = XIcon as any;
const Activity = ActivityIcon as any;
const ShoppingCart = ShoppingCartIcon as any;
const Truck = TruckIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const Cpu = CpuIcon as any;
const Clock = ClockIcon as any;
import { formatDistanceToNow } from "date-fns";

export function OperationalActivityFeed() {
  const { isActivityFeedOpen, setActivityFeedOpen, activityStream } = useMultiplayerStore();

  if (!isActivityFeedOpen) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "procurement":
        return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case "logistics":
        return <Truck className="w-4 h-4 text-blue-400" />;
      case "intelligence":
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case "system":
        return <Cpu className="w-4 h-4 text-primary" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case "procurement":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "logistics":
        return "bg-blue-500/10 border-blue-500/20";
      case "intelligence":
        return "bg-amber-500/10 border-amber-500/20";
      case "system":
        return "bg-primary/10 border-primary/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setActivityFeedOpen(false)}
      />
      <div className="fixed top-16 right-0 bottom-0 w-80 bg-black/90 border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              Global Operations
            </h2>
          </div>
          <button
            onClick={() => setActivityFeedOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activityStream.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Clock className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Awaiting Events
              </p>
            </div>
          ) : (
            activityStream.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-xl border ${getEventBg(event.type)} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-300 leading-snug">
                      <span className="font-bold text-white">{event.userName}</span> {event.action}{" "}
                      <span className="font-mono text-primary">{event.target}</span>
                    </p>
                    <p className="text-[9px] font-mono text-muted-foreground mt-1 uppercase">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
