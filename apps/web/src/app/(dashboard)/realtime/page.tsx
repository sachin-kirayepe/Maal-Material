"use client";

import React, { useState, useEffect } from "react";

import { Activity, Radio, Wifi, Zap } from "lucide-react";

export default function RealtimeMonitor() {
  const [messages, setMessages] = useState<string[]>([]);
  const [activeConnections, setActiveConnections] = useState(1243);

  useEffect(() => {
    // Await real socket.io implementation
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Radio className="text-emerald-500 animate-pulse" size={28} /> Live Websocket Monitor
          </h1>
          <p className="text-zinc-400">Monitor real-time bidirectional communication channels and latency metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Metrics Bar */}
        <div className="lg:col-span-4 grid grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Active Connections</p>
              <h3 className="text-3xl font-light text-white">{activeConnections.toLocaleString()}</h3>
            </div>
            <Wifi size={24} className="text-emerald-500" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Msg Throughput</p>
              <h3 className="text-3xl font-light text-white">4.2k <span className="text-sm text-zinc-500">/sec</span></h3>
            </div>
            <Zap size={24} className="text-yellow-500" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Avg Latency</p>
              <h3 className="text-3xl font-light text-white">12 <span className="text-sm text-zinc-500">ms</span></h3>
            </div>
            <Activity size={24} className="text-blue-500" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Dropped Packets</p>
              <h3 className="text-3xl font-light text-white">0.01 <span className="text-sm text-zinc-500">%</span></h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Live Stream Terminal */}
        <div className="lg:col-span-3 bg-black border border-zinc-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> STREAM: ACTIVE</span>
            <span className="text-xs font-mono text-zinc-500">ws://api.constructos.com/v1/socket</span>
          </div>
          <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-hidden text-zinc-400 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none z-10 h-16 top-auto bottom-0"></div>
            <div className="space-y-1">
              {messages.map((msg, i) => (
                <div key={i} className={`${i === 0 ? 'text-white' : i < 5 ? 'text-zinc-300' : 'text-zinc-600'} transition-colors duration-500 whitespace-nowrap`}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Health Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-6">Namespace Health</h3>
            <div className="space-y-4">
              {[
                { name: "/telemetry", load: 85, color: "bg-red-500" },
                { name: "/chat", load: 42, color: "bg-emerald-500" },
                { name: "/notifications", load: 15, color: "bg-emerald-500" },
                { name: "/ledger", load: 60, color: "bg-amber-500" },
              ].map((ns) => (
                <div key={ns.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-mono">{ns.name}</span>
                    <span className="text-white">{ns.load}%</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-1.5">
                    <div className={`${ns.color} h-1.5 rounded-full`} style={{ width: `${ns.load}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
