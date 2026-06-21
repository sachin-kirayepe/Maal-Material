import React from "react";
import { Bot as BotIcon, User as UserIcon } from "lucide-react";
const Bot = BotIcon as any;
const User = UserIcon as any;

export interface MessageBubbleProps {
  sender: "SYSTEM" | "AI" | "USER";
  text: string;
  time: string;
  isCyberpunk?: boolean;
}

export function MessageBubble({ sender, text, time, isCyberpunk = false }: MessageBubbleProps) {
  if (sender === "SYSTEM") {
    return (
      <div className="flex justify-center my-4">
        <div
          className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase border ${
            isCyberpunk
              ? "bg-emerald-950/30 text-emerald-500 border-emerald-900/50"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {text}
        </div>
      </div>
    );
  }

  const isAI = sender === "AI";

  return (
    <div className={`flex w-full ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-2`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
            isAI
              ? isCyberpunk
                ? "bg-emerald-950 border border-emerald-500/50 text-emerald-400"
                : "bg-blue-600 text-white"
              : isCyberpunk
                ? "bg-slate-800 text-slate-400"
                : "bg-slate-200 text-slate-600"
          }`}
        >
          {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        <div className="flex flex-col">
          <div
            className={`p-3 rounded-2xl text-sm ${
              isAI
                ? isCyberpunk
                  ? "bg-slate-900 border border-emerald-900/50 text-emerald-50 rounded-bl-none shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                : isCyberpunk
                  ? "bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 rounded-br-none"
                  : "bg-blue-600 text-white rounded-br-none shadow-sm"
            }`}
          >
            {text}
          </div>
          <span
            className={`text-[10px] mt-1 ${isAI ? "text-left" : "text-right"} ${isCyberpunk ? "text-emerald-500/50" : "text-slate-400"}`}
          >
            {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
