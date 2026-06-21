"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAICopilotStore } from "../../store/ai-copilot-state";
import { MessageBubble } from "./MessageBubble";
import {
  X as XIcon,
  Bot as BotIcon,
  Sparkles as SparklesIcon,
  Send as SendIcon,
  BrainCircuit as BrainCircuitIcon,
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  ShieldAlert as ShieldAlertIcon,
} from "lucide-react";
const X = XIcon as any;
const Bot = BotIcon as any;
const Sparkles = SparklesIcon as any;
const Send = SendIcon as any;
const BrainCircuit = BrainCircuitIcon as any;
const Maximize2 = Maximize2Icon as any;
const Minimize2 = Minimize2Icon as any;
const ShieldAlert = ShieldAlertIcon as any;

export function AICopilotOverlay() {
  const { isOpen, toggleCopilot, messages, sendMessage, isStreaming, currentContext } =
    useAICopilotStore();
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message or streaming tick
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isExpanded
          ? "w-full md:w-[600px] h-[100vh] md:h-[calc(100vh-2rem)] md:mr-4 md:mb-4"
          : "w-full md:w-[400px] h-[600px] md:mr-4 md:mb-4"
      }`}
    >
      <div className="w-full h-full bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/50">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              {isStreaming && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Maal-Material AI
                <Sparkles className="w-3 h-3 text-amber-400" />
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Autonomous Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleCopilot}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Context Pill */}
        {currentContext && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
            <BrainCircuit className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-slate-400">
              Context active: <span className="text-emerald-400 font-mono">{currentContext}</span>
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.role === "user" ? "USER" : msg.role === "assistant" ? "AI" : "SYSTEM"}
              text={msg.content}
              time={new Date(msg.timestamp).toISOString()}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isStreaming ? "AI is reasoning..." : "Ask Copilot or request action..."}
              disabled={isStreaming}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="absolute right-2 p-2 bg-primary hover:bg-primary/90 disabled:bg-slate-800 disabled:text-slate-500 text-primary-foreground rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Autonomous executions require manual approval
            </span>
            <span className="text-[10px] text-slate-600 font-mono">v2.4.1 (Stable)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
