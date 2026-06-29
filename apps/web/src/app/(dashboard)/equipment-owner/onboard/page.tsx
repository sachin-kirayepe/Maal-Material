"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, User, FileCheck, MapPin, ArrowRight, ShieldCheck, Check, Loader2, CheckCircle2, Building2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ApiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function EquipmentOwnerOnboarding() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({ pan: false, bank: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    fleetSize: "1-5 Machines",
    gstin: "",
    pincode: "",
    city: "Mumbai",
    address: "",
    bankAccount: "",
    ifsc: ""
  });

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'bank') => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Process upload for onboarding UI
      (() => {
        setUploadedDocs(prev => ({ ...prev, [type]: true }));
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    if (!formData.companyName) return;
    setIsLoading(true);
    
    try {
      // Create Tenant Profile mapping for Equipment Owner
      await ApiClient.post("/tenants/profile", {
        companyName: formData.companyName,
        industryType: "EQUIPMENT_RENTAL",
        taxId: formData.gstin || `EQP-${Date.now()}`,
        address: formData.address,
        city: formData.city,
        postalCode: formData.pincode,
        bankDetails: {
          accountNumber: formData.bankAccount,
          ifscCode: formData.ifsc
        }
      });

      // Assign the Equipment Owner role if they don't have it
      await ApiClient.post("/auth/assign-role", {
        role: "EQUIPMENT_OWNER",
        userId: user?.id
      });

      // Refresh session
      await useAuthStore.getState().checkAuth();

      // Navigate to Dashboard
      router.push("/equipment-owner/dashboard");
    } catch (err) {
      console.error("Onboarding failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-widest uppercase text-lg leading-none">ConstructOS <span className="text-zinc-500">Fleet</span></h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">EQUIPMENT OWNER PORTAL</p>
          </div>
        </div>
        <button className="text-sm text-zinc-400 hover:text-white transition-colors">Save & Exit</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-5xl flex gap-12">
          {/* Progress Tracker Sidebar */}
          <div className="w-72 shrink-0 space-y-8">
            <h2 className="text-2xl font-light mb-8">Partner Registration</h2>
            
            <div className="space-y-6">
              {[
                { id: 1, label: "Fleet Details", icon: <Building2 size={18}/> },
                { id: 2, label: "Location Setup", icon: <MapPin size={18}/> },
                { id: 3, label: "Payments & KYC", icon: <CreditCard size={18}/> },
              ].map((s) => (
                <div key={s.id} className="flex items-center gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${step > s.id ? 'bg-emerald-500 text-white' : step === s.id ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>
                    {step > s.id ? <Check size={18} /> : s.icon}
                  </div>
                  <span className={`font-medium ${step >= s.id ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
                  {s.id !== 3 && <div className={`absolute top-10 left-5 w-px h-10 -ml-[0.5px] ${step > s.id ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>}
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-sm text-amber-200/80">
              <ShieldCheck size={20} className="text-amber-500 shrink-0" />
              <p>ConstructOS securely verifies all fleet partners to ensure high-quality rentals for large enterprise contractors.</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-10 shadow-2xl">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Tell us about your Fleet</h3>
                <p className="text-zinc-400 text-sm mb-8">This information establishes your company profile in the marketplace.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Company / Owner Name</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Apex Earthmovers Pvt Ltd" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white transition-all" />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Fleet Size</label>
                      <select value={formData.fleetSize} onChange={e => setFormData({...formData, fleetSize: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white transition-all">
                        <option>1-5 Machines</option>
                        <option>6-15 Machines</option>
                        <option>16-50 Machines</option>
                        <option>50+ Heavy Equipment</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">GSTIN (Required for B2B billing)</label>
                      <input type="text" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} placeholder="22AAAAA0000A1Z5" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white font-mono uppercase transition-all" />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button onClick={() => setStep(2)} className="bg-white text-zinc-950 px-8 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Where is your primary yard?</h3>
                <p className="text-zinc-400 text-sm mb-8">Used to calculate transportation costs for direct bookings.</p>
                
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Pincode</label>
                      <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="400001" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Mumbai" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white bg-zinc-950 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Yard Address</label>
                    <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} placeholder="Plot No, Industrial Estate..." className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white resize-none transition-all"></textarea>
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="bg-white text-zinc-950 px-8 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-medium mb-2">Payments & Verification</h3>
                <p className="text-zinc-400 text-sm mb-8">We need your bank details to settle payments automatically after rentals.</p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Account Number</label>
                      <input type="text" value={formData.bankAccount} onChange={e => setFormData({...formData, bankAccount: e.target.value})} placeholder="0000 0000 0000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white font-mono transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">IFSC Code</label>
                      <input type="text" value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value})} placeholder="SBIN0000001" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white font-mono uppercase transition-all" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <label className="block border border-dashed border-zinc-700/50 bg-zinc-950/30 rounded-2xl p-6 text-center hover:border-amber-500 hover:bg-amber-500/5 transition-colors cursor-pointer group">
                    {isUploading && !uploadedDocs.pan ? <Loader2 size={32} className="mx-auto text-amber-500 mb-3 animate-spin" /> : uploadedDocs.pan ? <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" /> : <FileCheck size={32} className="mx-auto text-zinc-600 group-hover:text-amber-500 transition-colors mb-3" />}
                    <p className="text-sm font-medium text-white">{uploadedDocs.pan ? 'PAN Card Uploaded' : 'Upload Company PAN'}</p>
                    <p className="text-xs text-zinc-500 mt-1">PDF or JPG up to 5MB</p>
                    <input type="file" accept=".pdf,.jpg,.png" className="hidden" disabled={isUploading} onChange={(e) => handleDocUpload(e, 'pan')} />
                  </label>
                  <label className="block border border-dashed border-zinc-700/50 bg-zinc-950/30 rounded-2xl p-6 text-center hover:border-amber-500 hover:bg-amber-500/5 transition-colors cursor-pointer group">
                    {isUploading && !uploadedDocs.bank ? <Loader2 size={32} className="mx-auto text-amber-500 mb-3 animate-spin" /> : uploadedDocs.bank ? <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" /> : <CreditCard size={32} className="mx-auto text-zinc-600 group-hover:text-amber-500 transition-colors mb-3" />}
                    <p className="text-sm font-medium text-white">{uploadedDocs.bank ? 'Cancelled Cheque Uploaded' : "Upload Cancelled Cheque"}</p>
                    <p className="text-xs text-zinc-500 mt-1">For bank account verification</p>
                    <input type="file" accept=".pdf,.jpg,.png" className="hidden" disabled={isUploading} onChange={(e) => handleDocUpload(e, 'bank')} />
                  </label>
                </div>

                <div className="mt-12 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button onClick={handleSubmit} disabled={isLoading || (!uploadedDocs.pan && !uploadedDocs.bank)} className="bg-amber-500 text-zinc-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:shadow-none hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
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
