"use client";

import React, { useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { IndianRupee, FileText, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@constructos/ui";
import { useRouter } from "next/navigation";

export function RentalQuoteSubmission({ rfq }: { rfq: any }) {
  const router = useRouter();
  const [quoteAmount, setQuoteAmount] = useState("");
  const [terms, setTerms] = useState("Standard equipment lease terms apply. Transport not included.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteAmount) {
      toast.error("Please enter a quote amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiClient.post(`/rental-rfq/${rfq.id}/quotes`, {
        quoteAmount: parseFloat(quoteAmount),
        terms
      });
      toast.success("Quote submitted successfully!");
      router.push("/equipment-owner/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Submit Your Quote</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Your Proposed Total Rate (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            <input 
              type="number" 
              value={quoteAmount} 
              onChange={e => setQuoteAmount(e.target.value)} 
              placeholder="e.g. 150000" 
              className="w-full bg-zinc-950 border border-emerald-500/50 rounded-xl p-4 pl-12 focus:outline-none focus:border-emerald-500 text-white font-bold" 
              required 
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">Include operator and transport costs if applicable to your business model.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Terms & Conditions</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
            <textarea 
              value={terms} 
              onChange={e => setTerms(e.target.value)} 
              rows={4} 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 pl-12 focus:outline-none focus:border-amber-500 text-white resize-none" 
              required 
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Quote...</>
        ) : (
          <><Send className="w-5 h-5 mr-2" /> Submit Competitive Quote</>
        )}
      </Button>
    </form>
  );
}
