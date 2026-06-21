"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Send, Building2, Calendar, MapPin, Package } from "lucide-react";

export default function RentalRFQ() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans flex items-center justify-center">
      <div className="w-full max-w-3xl">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center justify-center gap-3">
            <FileText className="text-purple-500" size={28} /> Request Equipment Quote (RFQ)
          </h1>
          <p className="text-zinc-400">Submit your requirements to receive competitive bids from verified rental partners.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-800 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-purple-500 -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : '100%' }}></div>
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-4 border-black ${step >= 1 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>1</div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-4 border-black ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>2</div>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-zinc-800/30"><Building2 size={120} /></div>
          
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
              <h2 className="text-xl font-medium mb-6">Equipment Specifications</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2"><Package size={16}/> Category</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white text-sm">
                    <option>Earthmoving Equipment</option>
                    <option>Lifting & Hoisting</option>
                    <option>Concreting Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Specific Machine Type</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white text-sm">
                    <option>JCB 3DX Excavator</option>
                    <option>Bulldozer</option>
                    <option>Motor Grader</option>
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-zinc-400 mb-2">Technical Requirements (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="E.g. Required bucket capacity, reach, attachments needed..." 
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-purple-500 text-white resize-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
              <h2 className="text-xl font-medium mb-6">Logistics & Deployment</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2"><MapPin size={16}/> Delivery Site</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white text-sm">
                    <option>Project Alpha (Bandra Kurla Complex)</option>
                    <option>Project Beta (Andheri East)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2"><Calendar size={16}/> Rental Duration</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white text-sm">
                    <option>1 Week (Short-term)</option>
                    <option>1 Month</option>
                    <option>3 Months+</option>
                  </select>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-4 bg-black border border-zinc-800 p-4 rounded-xl">
                <input type="checkbox" id="operator" className="w-5 h-5 accent-purple-500 cursor-pointer" defaultChecked />
                <label htmlFor="operator" className="text-sm cursor-pointer select-none">Include certified machine operator in the quote.</label>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-zinc-400 hover:text-white px-4 py-2 font-medium transition-colors"
                >
                  Back
                </button>
                <button className="bg-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  Submit RFQ to Vendors <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
