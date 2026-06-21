"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Package, ArrowRight, Check, X } from "lucide-react";
import { RFQ } from "@/types/marketplace";

import { apiClient } from "@/lib/apiClient";

export default function SellerLeadsDashboard() {
  const [leads, setLeads] = useState<RFQ[]>([]);
  
  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await apiClient.get('/rfq-exchange');
        const apiData = response.data?.data?.items || response.data?.data || [];
        // Map backend RFQ to frontend type if necessary
        const mappedLeads: RFQ[] = Array.isArray(apiData) ? apiData.map((rfq: any) => ({
          id: rfq.id,
          title: rfq.title || "RFQ Lead",
          projectCode: rfq.projectCode || "General",
          status: rfq.status || "PUBLISHED",
          createdAt: rfq.createdAt || new Date().toISOString(),
          expiresAt: rfq.expiresAt || new Date().toISOString(),
          bidsCount: rfq.bidsCount || 0,
          items: rfq.items || []
        })) : [];
        setLeads(mappedLeads);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      }
    };
    fetchLeads();
  }, []);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<RFQ | null>(null);

  const handleOpenQuote = (lead: RFQ) => {
    setSelectedLead(lead);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Active Leads</h1>
        <p className="text-zinc-400">Buyers in your region are looking for materials you sell.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {leads.map((lead, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={lead.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md border border-purple-400/20">
                NEW LEAD
              </span>
              <span className="text-xs text-zinc-500">Closes in 3 days</span>
            </div>
            
            <h3 className="text-xl font-medium mb-4">{lead.title}</h3>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Package size={16} className="text-zinc-500" />
                <span>{lead.items?.[0]?.quantity} {lead.items?.[0]?.unit} Required</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <MapPin size={16} className="text-zinc-500" />
                <span>{lead.projectCode}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Calendar size={16} className="text-zinc-500" />
                <span>Delivery by {lead.items?.[0]?.expectedDeliveryDate}</span>
              </div>
            </div>

            <button 
              onClick={() => handleOpenQuote(lead)}
              className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Submit Quote <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Submit Quote Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsQuoteModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-8"
            >
              <button onClick={() => setIsQuoteModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-light mb-2">Submit Quotation</h2>
              <p className="text-sm text-zinc-400 mb-8">For {selectedLead.items?.[0]?.quantity} {selectedLead.items?.[0]?.unit} of {selectedLead.items?.[0]?.materialName}</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Unit Price (₹)</label>
                  <input type="number" placeholder="e.g. 380" className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Freight Charges (₹)</label>
                    <input type="number" placeholder="0 for Free Delivery" className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">GST (%)</label>
                    <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-zinc-600 appearance-none text-white">
                      <option>28%</option>
                      <option>18%</option>
                      <option>12%</option>
                      <option>5%</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                  <button onClick={() => setIsQuoteModalOpen(false)} className="px-6 py-3 rounded-full text-zinc-400 hover:text-white font-medium">Cancel</button>
                  <button onClick={() => setIsQuoteModalOpen(false)} className="bg-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-400 flex items-center gap-2">
                    <Check size={18} /> Submit Quote
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
