"use client";

import React from "react";
import { motion } from "framer-motion";
import { Landmark, ArrowRightLeft, Shield, Wallet, ArrowUpRight, Plus, RefreshCw } from "lucide-react";

import { useTreasuryStore } from "@/stores/treasuryStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useTenantId } from "@/hooks/useTenantId";

export default function TreasuryManagement() {
  const tenantId = useTenantId();
  const { bankAccounts, treasuryBalance, loading, fetchTreasuryData } = useTreasuryStore();

  React.useEffect(() => {
    if (tenantId) fetchTreasuryData();
  }, [tenantId, fetchTreasuryData]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Landmark className="text-purple-500" size={28} /> Corporate Treasury
          </h1>
          <p className="text-zinc-400">Manage bank accounts, liquidity, and short-term corporate investments.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors">
            <ArrowRightLeft size={16} /> Inter-Account Transfer
          </button>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
            <Plus size={18} /> Link Bank Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Total Liquidity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-purple-500/20"><Wallet size={120} /></div>
            <p className="text-purple-300 text-sm mb-2 relative z-10">Total Company Liquidity</p>
            <h2 className="text-4xl font-light text-white mb-4 relative z-10">{loading ? "—" : `${(treasuryBalance?.totalLiquidity || 0).toLocaleString()}`}</h2>
            
            <div className="space-y-3 relative z-10 border-t border-purple-500/20 pt-4 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200/70">Operating Cash</span>
                <span className="text-white font-medium">{loading ? "—" : `${(treasuryBalance?.operatingCash || 0).toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200/70">Restricted/Escrow</span>
                <span className="text-white font-medium">{loading ? "—" : `${(treasuryBalance?.escrow || 0).toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200/70">Investments</span>
                <span className="text-white font-medium">{loading ? "—" : `${(treasuryBalance?.investments || 0).toLocaleString()}`}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Shield size={18} className="text-green-400"/> Security & Compliance</h3>
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Maker-Checker Rule</span>
                <span className="text-xs bg-zinc-500/10 text-zinc-400 px-2 py-0.5 rounded border border-zinc-500/20">Unavailable</span>
              </div>
              <p className="text-xs text-zinc-500">Security rule status not fetched.</p>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-medium">Connected Accounts</h2>
              <button className="text-zinc-400 hover:text-white"><RefreshCw size={18} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              {loading ? (
                <><SkeletonCard className="h-24"/><SkeletonCard className="h-24"/></>
              ) : bankAccounts.length === 0 ? (
                <EmptyState icon={Landmark} title="No Bank Accounts" description="Connect your corporate bank accounts to view balances." />
              ) : (
                bankAccounts.map((acc: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="bg-black border border-zinc-800 rounded-xl p-5 flex items-center justify-between hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <Landmark size={24} className="text-zinc-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-lg">{acc.bankName || acc.bank || 'Unknown Bank'}</h3>
                      <p className="text-sm text-zinc-500">{acc.accountNumber || acc.acc} • {acc.accountType || acc.type || 'Standard'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-medium">{(acc.balance || 0).toLocaleString()}</p>
                    {acc.apy && acc.apy !== "0.0%" ? (
                      <p className="text-sm text-green-400 flex items-center justify-end gap-1"><ArrowUpRight size={14}/> {acc.apy} Yield</p>
                    ) : (
                      <p className="text-sm text-zinc-600">0% Yield</p>
                    )}
                  </div>
                </motion.div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
