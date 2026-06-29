"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ApiClient } from "@/lib/api-client";
import { FileText, MapPin, CalendarDays, ArrowRight, Loader2, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@constructos/ui";

export default function CreateRentalRFQ() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    equipmentType: "EXCAVATOR",
    quantity: "1",
    location: "",
    requiredFrom: "",
    requiredUntil: "",
  });

  const categories = [
    "EXCAVATOR", "JCB", "CRANE", "HYDRA", "BULLDOZER", "ROLLER", 
    "TRANSIT_MIXER", "CONCRETE_PUMP", "DUMPER", "TIPPER", 
    "GENERATOR", "SCAFFOLDING", "BATCHING_PLANT"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentType || !formData.location || !formData.requiredFrom || !formData.requiredUntil) {
      toast.error("Please fill all required fields");
      return;
    }

    if (new Date(formData.requiredFrom) > new Date(formData.requiredUntil)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsLoading(true);
    try {
      await ApiClient.post("/rental-rfq", {
        tenantId: user?.tenantId || "",
        contractorId: user?.id || "",
        equipmentType: formData.equipmentType,
        quantity: parseInt(formData.quantity) || 1,
        location: formData.location,
        requiredFrom: formData.requiredFrom,
        requiredUntil: formData.requiredUntil,
      });
      
      toast.success("Rental RFQ Broadcasted Successfully!");
      router.push("/rentals/contractor"); // Assuming we have a dashboard tab for RFQs
    } catch (error) {
      toast.error("Failed to broadcast RFQ");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ListPlus size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Broadcast Rental RFQ
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Need multiple machines or long-term rentals? Broadcast your requirement to our verified network of fleet owners and receive competitive bids.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 shadow-xl">
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Equipment Category *</label>
              <select value={formData.equipmentType} onChange={e => setFormData({...formData, equipmentType: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-blue-500 text-white">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Quantity Required *</label>
              <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-blue-500 text-white" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Delivery Location / Site Address *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Metro Line 3, BKC Station" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 pl-12 focus:outline-none focus:border-blue-500 text-white" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Required From *</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="date" value={formData.requiredFrom} onChange={e => setFormData({...formData, requiredFrom: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 pl-12 focus:outline-none focus:border-blue-500 text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Required Until *</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="date" value={formData.requiredUntil} onChange={e => setFormData({...formData, requiredUntil: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 pl-12 focus:outline-none focus:border-blue-500 text-white" required />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-sm text-blue-100/80">
              <p className="font-semibold text-blue-400 mb-1">What happens next?</p>
              <p>Your requirement will be broadcasted to verified fleet owners in your region. They will submit competitive bids (quotes) which you can compare in your dashboard before awarding the rental contract.</p>
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-zinc-400 hover:text-white">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoading ? "Broadcasting..." : "Broadcast RFQ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
