"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, Search, Link as LinkIcon, Building2, Store, Factory, ArrowRightLeft } from "lucide-react";
import { useCommerceNetworkStore } from "@/stores/commerceNetworkStore";
import { useTenantId } from "@/hooks/useTenantId";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CommerceNetwork() {
  const tenantId = useTenantId();
  const { nodes, edges, isLoading, fetchGraph } = useCommerceNetworkStore();

  React.useEffect(() => {
    if (tenantId) fetchGraph(tenantId);
  }, [fetchTenantId, tenantId]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Network className="text-purple-500" size={28} /> Commerce Network
          </h1>
          <p className="text-zinc-400">Visualize real-time B2B trade connections between suppliers, distributors, and buyers.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search network nodes..." 
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-purple-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden h-[600px] flex items-center justify-center">

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-20"></div>
          
          <div className="relative w-full h-full">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">Loading network graph...</div>
            ) : nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                 <EmptyState icon={Network} title="No Network Data" description="No commerce network nodes found for this tenant." />
              </div>
            ) : null}
          </div>
        </div>

        {/* Network Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg">Ecosystem Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400"><Factory size={16}/> Active Nodes</div>
                <div className="text-xl font-medium">{nodes.length}</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400"><Store size={16}/> Connections (Edges)</div>
                <div className="text-xl font-medium">{edges.length}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-400"><ArrowRightLeft size={16}/> Transactions</div>
                <div className="text-xl font-medium text-purple-400">N/A</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><LinkIcon size={18} className="text-purple-400"/> Recent Connections</h3>
            <div className="space-y-4">
              {edges.length === 0 ? (
                <div className="text-zinc-500 text-sm">No connections formed yet.</div>
              ) : edges.slice(0, 3).map((conn: any, i: number) => (
                <div key={i} className="bg-black border border-zinc-800 p-3 rounded-xl text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{conn.sourceNodeId?.slice(0,8) || "Node A"}</span>
                    <ArrowRightLeft size={12} className="text-zinc-500" />
                    <span className="font-medium text-white">{conn.targetNodeId?.slice(0,8) || "Node B"}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{conn.relationshipType || "Connected"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
