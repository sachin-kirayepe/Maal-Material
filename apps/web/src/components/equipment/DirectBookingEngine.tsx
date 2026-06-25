"use client";

import React, { useState } from "react";
import { CalendarDays, Truck, User, Zap, ArrowRight, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@constructos/ui";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function DirectBookingEngine({ equipment }: { equipment: any }) {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeOperator, setIncludeOperator] = useState(false);
  const [includeTransport, setIncludeTransport] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const dailyRate = equipment?.pricing?.dailyRate || 12000;
  const operatorRate = equipment?.pricing?.operatorCharge || 1000;
  const transportRate = 5000; // Flat estimate
  
  // Calculate Days
  let days = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start <= end) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    }
  }

  const equipmentCost = days * dailyRate;
  const operatorCost = includeOperator ? (days * operatorRate) : 0;
  const transportCost = includeTransport ? transportRate : 0;
  const subtotal = equipmentCost + operatorCost + transportCost;
  const platformFee = subtotal * 0.05; // 5% fee
  const gst = (subtotal + platformFee) * 0.18; // 18% GST
  const grandTotal = subtotal + platformFee + gst;

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select booking dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsBooking(true);
    try {
      await ApiClient.post("/rentals/intent", {
        equipmentId: equipment.id,
        contractorId: user?.id || "contractor-1",
        startDate,
        endDate,
        totalAmount: grandTotal,
        extras: {
          operatorAssigned: includeOperator,
          transportRequired: includeTransport
        }
      });
      toast.success("Booking Request Sent to Owner!");
      router.push("/rentals/contractor");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit booking request. The machine might be unavailable for these dates.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-zinc-400 text-sm mb-1">Rental Rate</p>
          <p className="text-3xl font-bold text-white">₹{dailyRate.toLocaleString()} <span className="text-sm font-normal text-zinc-500">/day</span></p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-white text-sm" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={includeOperator} onChange={e => setIncludeOperator(e.target.checked)} className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950" />
              <div>
                <p className="text-sm font-medium text-white flex items-center gap-2"><User className="w-4 h-4 text-zinc-400" /> Need Operator</p>
                <p className="text-xs text-zinc-500">₹{operatorRate.toLocaleString()} / day</p>
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between p-3 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={includeTransport} onChange={e => setIncludeTransport(e.target.checked)} className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950" />
              <div>
                <p className="text-sm font-medium text-white flex items-center gap-2"><Truck className="w-4 h-4 text-zinc-400" /> Transport to Site</p>
                <p className="text-xs text-zinc-500">Est. ₹{transportRate.toLocaleString()} flat</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {days > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6 space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>₹{dailyRate.toLocaleString()} x {days} days</span>
            <span className="text-white">₹{equipmentCost.toLocaleString()}</span>
          </div>
          {includeOperator && (
            <div className="flex justify-between text-zinc-400">
              <span>Operator (x{days})</span>
              <span className="text-white">₹{operatorCost.toLocaleString()}</span>
            </div>
          )}
          {includeTransport && (
            <div className="flex justify-between text-zinc-400">
              <span>Transport</span>
              <span className="text-white">₹{transportCost.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400">
            <span>Platform Fee (5%)</span>
            <span className="text-white">₹{platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>GST (18%)</span>
            <span className="text-white">₹{gst.toLocaleString()}</span>
          </div>
          <div className="w-full h-px bg-zinc-800"></div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-white">Total</span>
            <span className="text-amber-500">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      )}

      <Button 
        disabled={equipment.status !== 'AVAILABLE' || isBooking || !startDate || !endDate}
        onClick={handleBooking}
        className={`w-full py-6 text-lg font-bold rounded-xl transition-all shadow-lg ${
          equipment.status === 'AVAILABLE' 
          ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
        }`}
      >
        {isBooking ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
        ) : equipment.status === 'AVAILABLE' ? (
          <>Book Now <ArrowRight className="w-5 h-5 ml-2" /></>
        ) : (
          "Unavailable"
        )}
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
        <Zap className="w-3 h-3 text-emerald-500" /> Instant confirmation subject to availability
      </div>
    </div>
  );
}
