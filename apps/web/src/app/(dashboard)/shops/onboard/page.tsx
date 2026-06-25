"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Store, User, FileCheck, MapPin, ArrowRight, ShieldCheck, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useUploadStore } from "../../../stores/uploadStore";

export default function SMBOnboarding() {
  const uploadState = useUploadStore();
  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({ pan: false, aadhar: false });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'aadhar') => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadState.uploadFile('constructos-kyc', e.target.files[0], type);
      if (url) {
        setUploadedDocs(prev => ({ ...prev, [type]: true }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Store className="text-purple-500" size={24} />
          <span className="font-bold tracking-widest uppercase text-lg">Maal-Material <span className="text-zinc-500">Retail</span></span>
        </div>
        <button className="text-sm text-zinc-400 hover:text-white transition-colors">Save & Exit</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-4xl flex gap-12">
          {/* Progress Tracker Sidebar */}
          <div className="w-64 shrink-0 space-y-8">
            <h2 className="text-xl font-light mb-8">Seller Registration</h2>
            
            <div className="space-y-6">
              {[
                { id: 1, label: "Business Profile", icon: <Store size={18}/> },
                { id: 2, label: "Location Setup", icon: <MapPin size={18}/> },
                { id: 3, label: "KYC & Verification", icon: <FileCheck size={18}/> },
              ].map((s) => (
                <div key={s.id} className="flex items-center gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>
                    {step > s.id ? <Check size={18} /> : s.icon}
                  </div>
                  <span className={`font-medium ${step >= s.id ? 'text-white' : 'text-zinc-600'}`}>{s.label}</span>
                  {s.id !== 3 && <div className={`absolute top-10 left-5 w-px h-10 -ml-[0.5px] ${step > s.id ? 'bg-green-500' : 'bg-zinc-800'}`}></div>}
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3 text-sm text-purple-200">
              <ShieldCheck size={20} className="text-purple-400 shrink-0" />
              <p>Your data is encrypted. Maal-Material verifies sellers to maintain a trusted ecosystem.</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Tell us about your shop</h3>
                <p className="text-zinc-400 text-sm mb-8">This information will be displayed to contractors on the marketplace.</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Shop/Company Name</label>
                    <input type="text" placeholder="e.g. Metro Hardware Supply" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Primary Category</label>
                    <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white">
                      <option>Electrical & Lighting</option>
                      <option>Plumbing & Sanitary</option>
                      <option>Paints & Chemicals</option>
                      <option>Heavy Building Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">GSTIN (Optional for turnover &lt; ₹40L)</label>
                    <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white font-mono uppercase" />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button onClick={() => setStep(2)} className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Where is your shop located?</h3>
                <p className="text-zinc-400 text-sm mb-8">Helps buyers find you for quick local deliveries.</p>
                
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-zinc-400 mb-2">Pincode</label>
                      <input type="text" placeholder="400001" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-zinc-400 mb-2">City</label>
                      <input type="text" placeholder="Mumbai" className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white bg-zinc-950" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Complete Address</label>
                    <textarea rows={3} placeholder="Shop No, Building, Street..." className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-white resize-none"></textarea>
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Verification & KYC</h3>
                <p className="text-zinc-400 text-sm mb-8">Last step! Upload required documents to verify your business identity.</p>
                
                <div className="space-y-4">
                  <label className="block border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-purple-500 hover:bg-purple-500/5 transition-colors cursor-pointer">
                    {uploadState.isUploading && !uploadedDocs.pan ? <Loader2 size={32} className="mx-auto text-purple-500 mb-2 animate-spin" /> : uploadedDocs.pan ? <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2" /> : <FileCheck size={32} className="mx-auto text-zinc-500 mb-2" />}
                    <p className="text-sm font-medium text-white">{uploadedDocs.pan ? 'PAN/GST Uploaded' : 'Upload PAN Card / GST Certificate'}</p>
                    <p className="text-xs text-zinc-500 mt-1">PDF, JPG or PNG up to 5MB</p>
                    <input type="file" accept=".pdf,.jpg,.png" className="hidden" disabled={uploadState.isUploading} onChange={(e) => handleDocUpload(e, 'pan')} />
                  </label>
                  <label className="block border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-purple-500 hover:bg-purple-500/5 transition-colors cursor-pointer">
                    {uploadState.isUploading && !uploadedDocs.aadhar ? <Loader2 size={32} className="mx-auto text-purple-500 mb-2 animate-spin" /> : uploadedDocs.aadhar ? <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2" /> : <User size={32} className="mx-auto text-zinc-500 mb-2" />}
                    <p className="text-sm font-medium text-white">{uploadedDocs.aadhar ? 'Aadhar Uploaded' : "Upload Owner's Aadhar (Optional)"}</p>
                    <p className="text-xs text-zinc-500 mt-1">For faster trust badge verification</p>
                    <input type="file" accept=".pdf,.jpg,.png" className="hidden" disabled={uploadState.isUploading} onChange={(e) => handleDocUpload(e, 'aadhar')} />
                  </label>
                </div>

                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button className="bg-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    Submit Registration
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
