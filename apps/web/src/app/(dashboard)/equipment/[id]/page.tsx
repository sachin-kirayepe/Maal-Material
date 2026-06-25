"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api-client";
import { 
  Tractor, Star, ShieldCheck, MapPin, Settings, User as UserIcon, Calendar, CheckCircle2, Heart
} from "lucide-react";
import { Button } from "@constructos/ui";
import { DirectBookingEngine } from "@/components/equipment/DirectBookingEngine";

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [equipment, setEquipment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await ApiClient.get(`/api/v1/equipment/${params.id}`);
        setEquipment(response);
      } catch (e) {
        console.error("Failed to load equipment", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <Tractor className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Machine Not Found</h2>
        <p>The equipment you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} className="mt-6 bg-zinc-800 text-white">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white font-sans p-6 md:p-10">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <span className="hover:text-white cursor-pointer" onClick={() => router.push('/equipment')}>Marketplace</span>
        <span>/</span>
        <span className="hover:text-white cursor-pointer">{equipment.category.replace("_", " ")}</span>
        <span>/</span>
        <span className="text-amber-500 font-medium">{equipment.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Gallery placeholder */}
          <div className="relative h-96 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center">
            <Tractor size={120} className="text-zinc-800" />
            <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
              <Heart className="w-6 h-6 text-zinc-400 hover:text-rose-500 transition-colors" />
            </button>
            <div className="absolute bottom-6 left-6 flex gap-3">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="w-20 h-20 bg-zinc-950 border border-zinc-800/50 rounded-xl flex items-center justify-center hover:border-amber-500 cursor-pointer transition-colors">
                  <Tractor size={30} className="text-zinc-700" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{equipment.name}</h1>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {equipment.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg font-bold"><Star className="w-4 h-4 fill-amber-500"/> 4.8 (124 Reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500 mb-1">Owner</p>
                <p className="font-semibold text-emerald-400 flex items-center justify-end gap-1"><ShieldCheck className="w-4 h-4"/> Verified Partner</p>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-800/50"></div>

          <div>
            <h2 className="text-xl font-bold mb-6">Specifications & Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <Settings className="w-6 h-6 text-amber-500 mb-2" />
                <p className="text-xs text-zinc-500">Brand / Model</p>
                <p className="font-semibold">{equipment.model || "Standard"}</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <Calendar className="w-6 h-6 text-amber-500 mb-2" />
                <p className="text-xs text-zinc-500">Year of Make</p>
                <p className="font-semibold">{equipment.yearOfMake || "N/A"}</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <UserIcon className="w-6 h-6 text-amber-500 mb-2" />
                <p className="text-xs text-zinc-500">Operator</p>
                <p className="font-semibold">Optional</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <CheckCircle2 className="w-6 h-6 text-amber-500 mb-2" />
                <p className="text-xs text-zinc-500">Status</p>
                <p className={`font-semibold ${equipment.status === 'AVAILABLE' ? 'text-emerald-500' : 'text-blue-500'}`}>{equipment.status}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Booking Engine */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <DirectBookingEngine equipment={equipment} />
          </div>
        </div>

      </div>
    </div>
  );
}
