"use client";

import React, { useState } from "react";
import { Link as LinkIcon, CheckCircle2, Search, Settings } from "lucide-react";

import { useEcosystemStore } from "../../../stores/ecosystemStore";

export default function Ecosystem() {
  const [filter, setFilter] = useState("All");
  const { connections: integrations, fetchConnections } = useEcosystemStore();

  React.useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <LinkIcon className="text-purple-500" size={28} /> Third-Party Ecosystem
          </h1>
          <p className="text-zinc-400">Extend Maal-Material by connecting to your existing ERPs, Accounting software, and Communication tools.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input type="text" placeholder="Search apps..." className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-purple-500 text-sm" />
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {["All", "Accounting", "ERP", "Communication", "Payments"].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.length === 0 ? (
          <div className="col-span-full p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No integrations found.</div>
        ) : (
          integrations.filter((i: any) => filter === "All" || i.category === filter).map((app: any) => (
          <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center font-bold text-lg text-zinc-300">
                {app.icon || app.name?.charAt(0) || "A"}
              </div>
              {app.status === "Connected" || app.status === "CONNECTED" ? (
                <span className="flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
                  <CheckCircle2 size={12}/> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full border border-zinc-700">
                  Available
                </span>
              )}
            </div>
            
            <h3 className="font-medium text-lg text-white mb-1">{app.name}</h3>
            <p className="text-xs text-purple-400 mb-3">{app.category || "General"}</p>
            <p className="text-sm text-zinc-400 mb-6 flex-1 leading-relaxed">{app.desc || app.description}</p>
            
            {app.status === "Connected" || app.status === "CONNECTED" ? (
              <div className="flex gap-2">
                <button className="flex-1 bg-black border border-zinc-700 hover:border-zinc-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                  <Settings size={16}/> Configure
                </button>
              </div>
            ) : (
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Install App
              </button>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}
