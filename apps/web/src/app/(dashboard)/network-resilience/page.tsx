"use client";

import React from "react";
import { WifiOff, Database, ArrowDownUp, RefreshCcw, Smartphone } from "lucide-react";

export default function NetworkResilience() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <WifiOff className="text-teal-500" size={28} /> Offline Mode & Sync Policies
          </h1>
          <p className="text-zinc-400">Configure which Maal-Material modules work without internet access on remote construction sites.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Module Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2"><Smartphone className="text-zinc-400" size={20}/> Mobile App Offline Capabilities</h3>
            
            <div className="space-y-4">
              {[
                { module: "Worker Attendance (Face ID)", enabled: true, cache: "7 Days", conflict: "Local Wins" },
                { module: "Inventory Log (Stock Out)", enabled: true, cache: "24 Hours", conflict: "Server Wins" },
                { module: "Purchase Order Approvals", enabled: false, cache: "N/A", conflict: "N/A" },
                { module: "Safety Checklists", enabled: true, cache: "30 Days", conflict: "Local Wins" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                  <div>
                    <h4 className={`font-medium ${item.enabled ? 'text-white' : 'text-zinc-500'}`}>{item.module}</h4>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Cache: {item.cache}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Conflict: {item.conflict}</span>
                    </div>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.enabled ? 'bg-teal-500' : 'bg-zinc-700'}`}>
                    <span className={`${item.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2"><ArrowDownUp className="text-zinc-400" size={20}/> Sync Conflict Resolution</h3>
            <p className="text-sm text-zinc-400 mb-6">When a remote device reconnects to the internet and pushes offline data, how should we handle conflicts where the server data has also changed?</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-500/10 border-2 border-teal-500 rounded-xl p-4 cursor-pointer">
                <h4 className="font-medium text-teal-400 mb-1">Merge & Manual Review</h4>
                <p className="text-xs text-zinc-400">Combine non-conflicting fields. Flag conflicting rows for a project manager to review.</p>
                <div className="mt-4 flex justify-end">
                  <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                </div>
              </div>
              <div className="bg-black border-2 border-zinc-800 hover:border-zinc-700 rounded-xl p-4 cursor-pointer transition-colors">
                <h4 className="font-medium text-white mb-1">Server Always Wins</h4>
                <p className="text-xs text-zinc-500">The cloud database is the ultimate source of truth. Overwrite local device changes.</p>
                <div className="mt-4 flex justify-end">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-white flex items-center gap-2"><Database className="text-teal-500" size={18}/> Edge DB Sync Status</h3>
              <button className="text-zinc-400 hover:text-white transition-colors"><RefreshCcw size={16}/></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-white mb-2">Pending Upstream Syncs</p>
                <div className="text-3xl font-light text-amber-500">142 <span className="text-sm text-zinc-500">Rows</span></div>
                <p className="text-xs text-zinc-500 mt-1">Data created offline waiting for internet.</p>
              </div>

              <div className="w-full h-px bg-zinc-800"></div>

              <div>
                <p className="text-sm font-medium text-white mb-4">Device Connectivity Status</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</span>
                    <span className="font-medium text-white">45</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Syncing</span>
                    <span className="font-medium text-white">12</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Offline</span>
                    <span className="font-medium text-white">8</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
