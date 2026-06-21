"use client";

import React, { useState } from "react";
import { ShieldCheck, Key, Lock, Globe, Smartphone, UserX, Network, } from "lucide-react";

export default function SecurityControls() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={28} /> Advanced Security Controls
          </h1>
          <p className="text-zinc-400">Manage 2FA, API keys, active sessions, and IP whitelisting for the entire organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Policy Settings */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30">
              <h2 className="text-xl font-medium flex items-center gap-2"><Lock size={20} className="text-blue-400"/> Authentication Policies</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                <div>
                  <h3 className="text-white font-medium mb-1 flex items-center gap-2">Enforce Multi-Factor Auth (MFA) <Smartphone size={16} className="text-zinc-500"/></h3>
                  <p className="text-sm text-zinc-400">Require all users to use an Authenticator app (TOTP) to log in.</p>
                </div>
                <button onClick={() => setMfaEnabled(!mfaEnabled)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black bg-blue-500">
                  <span className={`${mfaEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                <div>
                  <h3 className="text-white font-medium mb-1 flex items-center gap-2">Strict IP Whitelisting <Globe size={16} className="text-zinc-500"/></h3>
                  <p className="text-sm text-zinc-400">Only allow logins from recognized corporate office IP addresses.</p>
                </div>
                <button onClick={() => setIpWhitelisting(!ipWhitelisting)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${ipWhitelisting ? 'bg-blue-500' : 'bg-zinc-600'}`}>
                  <span className={`${ipWhitelisting ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </button>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Session Timeout</h3>
                <p className="text-sm text-zinc-400 mb-3">Automatically log out inactive users after:</p>
                <select className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full max-w-xs">
                  <option>15 Minutes</option>
                  <option selected>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>Never (Not Recommended)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30 flex justify-between items-center">
              <h2 className="text-xl font-medium flex items-center gap-2"><Key size={20} className="text-amber-400"/> API Key Management</h2>
              <button className="text-sm bg-black border border-zinc-700 px-3 py-1.5 rounded text-white hover:border-amber-500 transition-colors">Generate New</button>
            </div>
            
            <div className="p-6">
              <div className="bg-black border border-zinc-800 rounded-xl p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white text-sm">Main Logistics Integration (Prod)</p>
                  <p className="font-mono text-xs text-amber-500/70 mt-1">pk_live_******************</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Last used: 2 mins ago</p>
                </div>
                <button className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors">Revoke</button>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4 flex justify-between items-center opacity-60">
                <div>
                  <p className="font-medium text-white text-sm">ERP Sync (Staging)</p>
                  <p className="font-mono text-xs text-zinc-500 mt-1">pk_test_******************</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Last used: 14 days ago</p>
                </div>
                <button className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors">Revoke</button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions & Network */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-black/30 flex justify-between items-center">
              <h2 className="text-xl font-medium flex items-center gap-2"><Network size={20} className="text-green-400"/> Active Admin Sessions</h2>
              <button className="text-xs text-red-400 hover:underline">Revoke All Except Current</button>
            </div>
            
            <div className="divide-y divide-zinc-800/50">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white flex items-center gap-2">MacBook Pro 16" (Current Session)</p>
                  <p className="text-xs text-zinc-500 mt-1">IP: 103.45.22.11 • Mumbai, India</p>
                  <p className="text-xs text-zinc-500 mt-1">Chrome on macOS</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">Active</span>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white flex items-center gap-2">iPhone 14 Pro Max</p>
                  <p className="text-xs text-zinc-500 mt-1">IP: 49.36.12.44 • Mumbai, India</p>
                  <p className="text-xs text-zinc-500 mt-1">Maal-Material Mobile App (iOS)</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Revoke Session">
                  <UserX size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 text-white">Whitelisted IPs</h3>
            
            <div className="space-y-2 mb-4">
              <div className="bg-black border border-zinc-800 px-4 py-2 rounded-lg flex justify-between items-center text-sm font-mono text-zinc-300">
                <span>103.45.22.0/24</span>
                <span className="text-xs text-zinc-500 font-sans">HQ Office (Mumbai)</span>
              </div>
              <div className="bg-black border border-zinc-800 px-4 py-2 rounded-lg flex justify-between items-center text-sm font-mono text-zinc-300">
                <span>192.168.1.50</span>
                <span className="text-xs text-zinc-500 font-sans">Bhiwandi Central Hub Router</span>
              </div>
            </div>

            <button className="text-sm bg-black border border-dashed border-zinc-700 w-full py-2 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
              + Add IP Range
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
