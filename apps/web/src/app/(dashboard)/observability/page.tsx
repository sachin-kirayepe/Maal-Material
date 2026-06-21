"use client";

import React from "react";
import { Activity, Server, Database, Cloud } from "lucide-react";

export default function Observability() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Activity className="text-cyan-500" size={28} /> System Health & Observability
          </h1>
          <p className="text-zinc-400">DevOps dashboard for monitoring cloud infrastructure, Kubernetes pods, and database performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Core Infrastructure Nodes */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Server className="text-blue-500" size={20}/>
              <h3 className="font-medium text-white">App Cluster (k8s)</h3>
            </div>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">ap-south-1</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">CPU Usage</span><span className="text-white">42%</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-[42%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Memory</span><span className="text-white">12.4 GB / 32 GB</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-[38%]"></div></div>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Active Pods</span>
              <span className="text-white font-medium">24 / 24 Running</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Database className="text-purple-500" size={20}/>
              <h3 className="font-medium text-white">PostgreSQL Primary</h3>
            </div>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">RDS Multi-AZ</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Storage IOPS</span><span className="text-white">8,420 / 10,000</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full w-[84%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Active Connections</span><span className="text-amber-400">412 / 500</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full w-[82%]"></div></div>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Replication Lag</span>
              <span className="text-green-400 font-medium">0.4 ms</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Cloud className="text-amber-500" size={20}/>
              <h3 className="font-medium text-white">Redis Cache</h3>
            </div>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">ElastiCache</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Cache Hit Ratio</span><span className="text-green-400">98.2%</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[98%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Evictions</span><span className="text-white">0</span></div>
              <div className="w-full bg-black rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full w-[0%]"></div></div>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Uptime</span>
              <span className="text-white font-medium">45 Days, 12 Hrs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-medium text-white mb-6">Application Error Traces (Last 1 Hour)</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-800">
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Service</th>
              <th className="pb-3 font-medium">Error Code</th>
              <th className="pb-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
              <td className="py-3 text-zinc-400 font-mono text-xs">14:22:05</td>
              <td className="py-3"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 text-xs">api-gateway</span></td>
              <td className="py-3 text-amber-400 font-mono text-xs">ERR_RATE_LIMIT</td>
              <td className="py-3 text-zinc-300">Rate limit exceeded for tenant ID: t_9921</td>
            </tr>
            <tr className="hover:bg-zinc-800/20">
              <td className="py-3 text-zinc-400 font-mono text-xs">14:15:12</td>
              <td className="py-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 text-xs">invoice-worker</span></td>
              <td className="py-3 text-red-400 font-mono text-xs">ERR_OCR_TIMEOUT</td>
              <td className="py-3 text-zinc-300">Google Vision API timed out processing invoice_092.pdf</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
