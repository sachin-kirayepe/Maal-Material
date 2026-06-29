"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ApiClient } from "@/lib/api-client";
import { Tractor, Loader2, IndianRupee, ImagePlus, User, ArrowRight, Save, ReceiptText, Banknote, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@constructos/ui";

export default function NewMachineListing() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "EXCAVATOR",
    model: "",
    vinOrSerial: "",
    yearOfMake: new Date().getFullYear().toString(),
    location: "",
    hourlyRate: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    operatorCharge: "",
    dieselCharge: "",
    depositAmount: "",
    isOperatorIncluded: false,
    isFuelIncluded: false,
    isTransportIncluded: false
  });

  const categories = [
    "EXCAVATOR", "JCB", "CRANE", "HYDRA", "BULLDOZER", "ROLLER", 
    "TRANSIT_MIXER", "CONCRETE_PUMP", "DUMPER", "TIPPER", 
    "GENERATOR", "SCAFFOLDING", "BATCHING_PLANT"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.dailyRate) {
      toast.error("Please fill required fields (Name, Category, Daily Rate)");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Equipment Asset
      const payload = {
        name: formData.name,
        category: formData.category,
        model: formData.model,
        vinOrSerial: formData.vinOrSerial || `VIN-${Date.now()}`,
        yearOfMake: parseInt(formData.yearOfMake),
        location: formData.location,
        pricing: {
          hourlyRate: parseFloat(formData.hourlyRate) || null,
          dailyRate: parseFloat(formData.dailyRate),
          weeklyRate: parseFloat(formData.weeklyRate) || null,
          monthlyRate: parseFloat(formData.monthlyRate) || null,
          operatorCharge: parseFloat(formData.operatorCharge) || 0,
          dieselCharge: parseFloat(formData.dieselCharge) || 0,
          depositAmount: parseFloat(formData.depositAmount) || 0,
        },
        metadata: {
          operatorIncluded: formData.isOperatorIncluded,
          fuelIncluded: formData.isFuelIncluded,
          transportIncluded: formData.isTransportIncluded
        }
      };

      await ApiClient.post("/equipment", payload);
      toast.success("Machine successfully listed in Marketplace!");
      router.push("/equipment-owner/dashboard");
    } catch (error) {
      toast.error("Failed to list machine");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            List New Machine
          </h1>
          <p className="text-zinc-400 mt-1">
            Add a new asset to your fleet and publish it to the ConstructOS marketplace.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Details */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Tractor className="w-5 h-5 text-amber-500" /> Equipment Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Machine Title *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Machine Name" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-white" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Category *</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-white">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Brand / Model</label>
              <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. EX200 LC" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Year of Make</label>
              <input type="number" value={formData.yearOfMake} onChange={e => setFormData({...formData, yearOfMake: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-white" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Current Location (Yard/Site)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, Area" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 pl-12 focus:outline-none focus:border-amber-500 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Engine */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-500" /> Rental Pricing ()
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Hourly Rate</label>
              <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} placeholder="1,800" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Daily Rate *</label>
              <input type="number" value={formData.dailyRate} onChange={e => setFormData({...formData, dailyRate: e.target.value})} placeholder="12,000" className="w-full bg-zinc-950/50 border border-emerald-500/50 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Weekly Rate</label>
              <input type="number" value={formData.weeklyRate} onChange={e => setFormData({...formData, weeklyRate: e.target.value})} placeholder="70,000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Monthly Rate</label>
              <input type="number" value={formData.monthlyRate} onChange={e => setFormData({...formData, monthlyRate: e.target.value})} placeholder="2,50,000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white" />
            </div>
          </div>

          <hr className="border-zinc-800/50 my-8" />
          
          <h3 className="text-lg font-medium text-white mb-4">Extras & Add-ons</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4">
              <input type="checkbox" checked={formData.isOperatorIncluded} onChange={e => setFormData({...formData, isOperatorIncluded: e.target.checked})} className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500" />
              <div>
                <label className="font-medium text-white flex items-center gap-2"><UserIcon className="w-4 h-4 text-zinc-400"/> Operator Included</label>
                <p className="text-xs text-zinc-500 mt-1">Base price includes operator.</p>
                {!formData.isOperatorIncluded && (
                  <div className="mt-3">
                    <label className="text-xs text-zinc-400">Extra Charge per shift ()</label>
                    <input type="number" value={formData.operatorCharge} onChange={e => setFormData({...formData, operatorCharge: e.target.value})} placeholder="1000" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 mt-1 text-sm text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4">
              <input type="checkbox" checked={formData.isFuelIncluded} onChange={e => setFormData({...formData, isFuelIncluded: e.target.checked})} className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500" />
              <div>
                <label className="font-medium text-white flex items-center gap-2"><Fuel className="w-4 h-4 text-zinc-400"/> Fuel Included (Dry/Wet)</label>
                <p className="text-xs text-zinc-500 mt-1">If un-checked, it's a dry lease.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4">
              <input type="checkbox" checked={formData.isTransportIncluded} onChange={e => setFormData({...formData, isTransportIncluded: e.target.checked})} className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500" />
              <div>
                <label className="font-medium text-white flex items-center gap-2"><Truck className="w-4 h-4 text-zinc-400"/> Transport Included</label>
                <p className="text-xs text-zinc-500 mt-1">Free delivery to site.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Photos & Media</h2>
          
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700/50 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-xl cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-zinc-500 mb-3" />
            <p className="text-white font-medium">Click or drag machine photos here</p>
            <p className="text-xs text-zinc-500 mt-1">At least one photo required for marketplace listing</p>
            <input type="file" className="hidden" multiple accept="image/*" />
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pb-12">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-zinc-400 hover:text-white">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-8">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoading ? "Publishing..." : "Publish to Marketplace"}
          </Button>
        </div>

      </form>
    </div>
  );
}
