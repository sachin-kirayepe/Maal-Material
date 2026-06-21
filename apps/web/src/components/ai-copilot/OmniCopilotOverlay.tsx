"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOmniCopilotStore } from "../../store/omni-copilot-state";
import { useAIStreamSimulator } from "../../hooks/useAIStreamSimulator";
import { CognitionStreamNode } from "./CognitionStreamNode";
import { GenerativeActionCard } from "./GenerativeActionCard";
import {
  X as XIcon,
  Send as SendIcon,
  Cpu as CpuIcon,
  Bot as BotIcon,
  User as UserIcon,
  Sparkles as SparklesIcon,
} from "lucide-react";
const X = XIcon as any;
const Send = SendIcon as any;
const Cpu = CpuIcon as any;
const Bot = BotIcon as any;
const User = UserIcon as any;
const Sparkles = SparklesIcon as any;

export function OmniCopilotOverlay() {
  const { isOpen, setIsOpen, messages, clearHistory } = useOmniCopilotStore();
  const { simulateRequest, isProcessing } = useAIStreamSimulator();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    simulateRequest(input.trim());
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] z-50 flex flex-col glass-panel shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-ping"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
              Omni-Copilot <Sparkles className="w-3 h-3 text-cyan-400" />
            </h2>
            <p className="text-[10px] font-mono text-primary/70 uppercase">
              Enterprise Cognition Core Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearHistory}
            className="text-[10px] font-mono text-muted-foreground hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
          >
            RESET
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === "user"
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                  : "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(0,255,255,0.2)]"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content */}
            <div
              className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50">
                <span className="text-[9px] font-mono tracking-widest uppercase">{msg.role}</span>
                <span className="text-[9px] font-mono">
                  {msg.timestamp?.split("T")[1]?.split(".")[0]}
                </span>
              </div>

              {msg.role === "assistant" && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                <CognitionStreamNode
                  steps={msg.reasoningSteps}
                  isStreaming={msg.isStreaming || false}
                />
              )}

              {msg.content && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-50"
                      : "bg-white/5 border border-white/10 text-slate-200"
                  }`}
                >
                  {msg.content}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                  )}
                </div>
              )}

              {msg.generativeAction && (
                <GenerativeActionCard messageId={msg.id} action={msg.generativeAction} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command or ask Omni-Copilot..."
            disabled={isProcessing}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 p-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-black disabled:opacity-50 disabled:hover:bg-primary/20 disabled:hover:text-primary transition-all"
          >
            {isProcessing ? <Cpu className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            Try: "Fix thermal anomaly" or "Dispatch fleet"
          </span>
        </div>
      </div>
    </div>
  );
}
