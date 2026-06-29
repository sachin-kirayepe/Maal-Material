"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, ThumbsUp, MessageSquare, AlertCircle, Building2, ChevronDown } from "lucide-react";

import { useTrustStore } from "../../../stores/trustStore";
import { useTenantId } from "@/hooks/useTenantId";

export default function SupplierReputation() {
  const tenantId = useTenantId();

  const { profiles: reviews, isLoading, fetchTrustProfiles } = useTrustStore();

  React.useEffect(() => {
    fetchTrustProfiles(tenantId);
  }, [fetchTrustProfiles]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Star className="text-amber-500" size={28} /> Public Supplier Reputation
          </h1>
          <p className="text-zinc-400">View community ratings, manage feedback, and monitor supplier trust scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Network Trust Score Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500">
            Network Trust Score unavailable
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500">
            Trust Factors unavailable
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 border-b border-zinc-800 pb-4">
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium">All Reviews</button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Verified Purchases Only</button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1">Rating <ChevronDown size={14}/></button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="p-12 text-center text-zinc-500">Loading trust profiles...</div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No profiles found.</div>
            ) : (
              reviews.map((review: any, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={review.id || i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative">
                
                {(review.verified || review.gstVerified) && (
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-medium uppercase tracking-widest">
                    <ShieldCheck size={14}/> Verified Order
                  </div>
                )}

                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-black border border-zinc-700 rounded flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-zinc-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">{review.supplier || review.entityId || ""}</h3>
                    <div className="flex items-center gap-3 text-sm mt-1">
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < (review.rating || Math.round(review.trustScore / 20) || 0) ? "fill-amber-500" : "text-zinc-700"} />
                        ))}
                      </div>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Reviewed by {review.reviewer || ""}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500">{review.date || ""}</span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4 pl-16">
                  {review.comment || ""}
                </p>

                <div className="flex items-center gap-4 pl-16 text-xs text-zinc-500">
                  <button className="flex items-center gap-1.5 hover:text-white transition-colors"><ThumbsUp size={14}/> Helpful (12)</button>
                  <button className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageSquare size={14}/> Reply</button>
                  {(review.rating <= 2 || review.trustScore < 50) && (
                    <button className="flex items-center gap-1.5 text-red-500/70 hover:text-red-400 transition-colors ml-auto"><AlertCircle size={14}/> Report Issue</button>
                  )}
                </div>
              </motion.div>
            )))}
          </div>
        </div>

      </div>
    </div>
  );
}
