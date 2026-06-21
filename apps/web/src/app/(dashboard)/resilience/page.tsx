"use client";

import React, { useState } from "react";
import { ShieldAlert, Database, RefreshCw, AlertTriangle, Server } from "lucide-react";

export default function DisasterRecovery() {
  const [triggerFailover, setTriggerFailover] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={28} /> Disaster Recovery & Failover
          </h1>
          <p className="text-zinc-400">High-stakes control panel for triggering database failovers, restoring backups, and managing multi-region redundancy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Architecture Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-medium text-white mb-6 flex items-center gap-2"><Server className="text-blue-500" size={20}/> Multi-Region Architecture</h3>
          
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Primary Region (Active)</h4>
                  <p className="text-xl text-white font-medium">ap-south-1 (Mumbai)</p>
                  <p className="text-sm text-zinc-400 mt-2">Serving 100% of global traffic.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded border border-blue-500/30 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> HEALTHY
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex flex-col items-center text-zinc-600">
                <div className="w-px h-6 bg-zinc-700"></div>
                <RefreshCw size={16} className="my-1 animate-spin-slow"/>
                <div className="w-px h-6 bg-zinc-700"></div>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-zinc-500">Async Replication (Lag: 42ms)</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-zinc-400 font-medium mb-1">Disaster Recovery Region (Standby)</h4>
                  <p className="text-xl text-white font-medium">ap-southeast-1 (Singapore)</p>
                  <p className="text-sm text-zinc-500 mt-2">Ready to take over in case of primary failure.</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-800 text-zinc-400 px-3 py-1 rounded border border-zinc-700 text-xs font-medium">
                  STANDBY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DR Controls */}
        <div className="space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-6 flex items-center gap-2"><Database className="text-emerald-500" size={20}/> Backup Management</h3>
            <div className="flex justify-between items-center bg-black border border-zinc-800 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-medium text-white">Latest Automated Snapshot</p>
                <p className="text-xs text-zinc-500 mt-1">constructos-prod-db-snap-20260615-0800</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">Today, 08:00 AM</p>
                <button className="text-emerald-500 hover:text-emerald-400 text-xs font-medium mt-1">Restore from this point</button>
              </div>
            </div>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Database size={16}/> Create Manual Snapshot Now
            </button>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-red-500/10">
              <AlertTriangle size={150} />
            </div>
            <h3 className="font-medium text-red-500 mb-2 flex items-center gap-2 relative z-10"><AlertTriangle size={20}/> Emergency Failover</h3>
            <p className="text-sm text-red-400/80 mb-6 relative z-10">Triggering a failover will promote the Singapore read-replica to Primary, and demote Mumbai. This will cause approximately 30-45 seconds of downtime.</p>
            
            {!triggerFailover ? (
              <button 
                onClick={() => setTriggerFailover(true)}
                className="w-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 text-red-500 px-4 py-3 rounded-xl text-sm font-bold transition-colors relative z-10"
              >
                Initiate Region Failover Protocol
              </button>
            ) : (
              <div className="bg-black/50 border border-red-500 rounded-xl p-4 relative z-10">
                <p className="text-sm font-medium text-white mb-4 text-center">Are you absolutely sure?</p>
                <div className="flex gap-4">
                  <button onClick={() => setTriggerFailover(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    CONFIRM FAILOVER
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
