"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone, MapPin, Clock, ArrowRight, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useRfqExchangeStore } from "@/stores/rfqExchangeStore";
import { toast } from "sonner";

export default function RFQExchange() {
  const { rfqs, isLoading, fetchRfqs, submitBid } = useRfqExchangeStore();

  useEffect(() => {
    fetchRfqs("GLOBAL_CORP_01");
  }, [fetchRfqs]);

  const handlePlaceBid = async (rfqId: string) => {
    try {
      // In a real app this would open a modal to enter bid details
      await submitBid(rfqId, 0, "");
      alert("Bid placed successfully!");
      // Re-fetch or optimistically update UI here
      fetchRfqs("GLOBAL_CORP_01");
    } catch (err) {
      console.error(err);
      toast.error("Action failed", { description: err?.message || "An unexpected error occurred" });
      alert("Failed to place bid. See console.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Megaphone className="text-purple-500" size={28} /> Public RFQ Bidding Wall
          </h1>
          <p className="text-zinc-400">Discover public procurement requests and submit your competitive bids.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
          <FileText size={18} /> Post a New RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RFQ Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 mb-4">
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium">All Open</button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">My Bids</button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Awarded</button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 border border-zinc-800 rounded-2xl bg-zinc-900/50">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="flex justify-center items-center h-64 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 text-zinc-500">
              No RFQs found.
            </div>
          ) : rfqs.map((rfq: any, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={rfq.id || i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                     <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{rfq.id || ""}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${rfq.status === 'Active' || rfq.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : rfq.status === 'Closing Soon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                      {rfq.status || ""}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white">{rfq.title || rfq.requirements || ""}</h3>
                  <p className="text-sm text-zinc-400 mt-1">Posted by <span className="text-zinc-300">{rfq.company || rfq.buyerId || ""}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light">{rfq.bids || rfq.bidsReceived || 0}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Bids</p>
                </div>
              </div>

              <div className="flex justify-between items-end mt-6 pt-4 border-t border-zinc-800">
                <div className="flex gap-6">
                  <p className="text-sm text-zinc-400 flex items-center gap-1.5"><MapPin size={16}/> {rfq.location || ""}</p>
                  <p className="text-sm text-zinc-400 flex items-center gap-1.5"><Clock size={16}/> {rfq.expires ? `Expires in ${rfq.expires}` : ''}</p>
                </div>
                <button 
                  onClick={() => handlePlaceBid(rfq.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${rfq.status === 'Closed' || rfq.status === 'Awarded' || rfq.status === 'CLOSED' ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white group-hover:bg-purple-500 group-hover:text-white'}`}
                >
                  {rfq.status === 'Awarded' ? 'View Details' : 'Submit Bid'} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bidding Stats / Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg">Your Bidding Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="text-zinc-400">Total Bids Submitted</div>
                <div className="text-xl font-medium">-</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="text-zinc-400">Win Rate</div>
                <div className="text-xl font-medium text-green-400">-</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-zinc-400">Revenue Won</div>
                <div className="text-xl font-medium text-purple-400">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
