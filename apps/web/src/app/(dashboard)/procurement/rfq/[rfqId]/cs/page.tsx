"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, MessageSquare, Download, Trophy, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { Quotation } from "@/types/marketplace";

import { apiClient } from "@/lib/apiClient";

// MOCK DATA REMOVED

export default function ComparativeStatement({ params }: { params: { rfqId: string } }) {
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  React.useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await apiClient.get(`/rfq-exchange/${params.rfqId}/quotes`);
        const data = response.data?.data || [];
        if (Array.isArray(data)) {
          setQuotes(data.sort((a, b) => a.totalCost - b.totalCost));
        }
      } catch (error) {
        console.error("Failed to fetch quotes", error);
      }
    };
    fetchQuotes();
  }, [params.rfqId]);

  const handleIssuePo = (quote: Quotation) => {
    setSelectedQuote(quote);
    setIsPoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/procurement/rfq">
          <button className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Comparative Statement (CS)</h1>
          <p className="text-zinc-400">Comparing 3 quotes for {params.rfqId} (500 Bags OPC 43 Cement)</p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 gap-6">
        {quotes.map((quote, i) => {
          const isL1 = i === 0;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={quote.id} 
              className={`relative bg-zinc-900 border rounded-2xl p-8 overflow-hidden transition-all
                ${isL1 ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-zinc-800'}`}
            >
              {isL1 && (
                <div className="absolute top-0 right-0 bg-green-500 text-black px-4 py-1.5 rounded-bl-2xl font-bold text-sm flex items-center gap-1.5">
                  <Trophy size={16} /> L1 BIDDER (RECOMMENDED)
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-medium">{quote.supplier.name}</h3>
                    {quote.supplier.verified && (
                      <span className="text-blue-400 flex items-center gap-1 text-xs border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-zinc-400 mb-8">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {quote.supplier.location}</span>
                    <span>★ {quote.supplier.rating}/5.0</span>
                    <span>Delivery in {quote.supplier.deliveryTimeDays} Days</span>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Unit Price</p>
                      <p className="text-xl font-light">₹{quote.unitPrice}<span className="text-sm text-zinc-500">/bag</span></p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Freight</p>
                      <p className="text-xl font-light">{quote.freightCharges === 0 ? 'Free' : `₹${quote.freightCharges}`}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">GST (28%)</p>
                      <p className="text-xl font-light">Included</p>
                    </div>
                    <div className="pl-6 border-l border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">Landed Total Cost</p>
                      <p className={`text-3xl font-medium ${isL1 ? 'text-green-400' : 'text-white'}`}>
                        ₹{quote.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 ml-8">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-full font-medium transition-colors">
                    <MessageSquare size={18} />
                    Negotiate
                  </button>
                  <button 
                    onClick={() => handleIssuePo(quote)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors
                      ${isL1 ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-white hover:bg-zinc-200 text-black'}`}
                  >
                    <CheckCircle2 size={18} />
                    Issue Digital PO
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Issue PO Modal */}
      <AnimatePresence>
        {isPoModalOpen && selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsPoModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-medium mb-2">Confirm Purchase Order</h2>
              <p className="text-zinc-400 mb-8">
                You are about to issue a legally binding Digital PO to <strong>{selectedQuote.supplier.name}</strong> for ₹{selectedQuote.totalCost.toLocaleString()}.
              </p>
              
              <div className="flex justify-center gap-4">
                <button onClick={() => setIsPoModalOpen(false)} className="px-6 py-3 rounded-full text-zinc-400 hover:text-white font-medium">Cancel</button>
                <button onClick={() => setIsPoModalOpen(false)} className="bg-green-500 text-black px-8 py-3 rounded-full font-medium hover:bg-green-400 flex items-center gap-2">
                  <Download size={18} /> Generate & Send PO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
