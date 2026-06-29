"use client";

import React, { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authStore";
import { 
  Briefcase, Clock, CalendarDays, CheckCircle2, ChevronRight, Truck, Plus, FileText, AlertCircle
} from "lucide-react";
import { Button } from "@constructos/ui";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ContractorRentalsDashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const contractorId = user?.id || "";
        const tenantId = user?.tenantId || "";
        
        const [bookingsRes, rfqsRes] = await Promise.all([
          ApiClient.get(`/api/v1/rentals?contractorId=${contractorId}`),
          ApiClient.get(`/api/v1/rental-rfq?tenantId=${tenantId}`)
        ]);
        
        setBookings(bookingsRes.data || []);
        // In reality we should filter rfqs by contractorId, assuming api does or we do it here
        setRfqs((rfqsRes || []).filter((r: any) => r.contractorId === contractorId));
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white font-sans p-6 md:p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Rentals</h1>
          <p className="text-zinc-400">Manage your active machine bookings and RFQs.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/equipment">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
              Rent Machine
            </Button>
          </Link>
          <Link href="/rental-rfq/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Plus className="w-4 h-4 mr-2" /> Bulk RFQ
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border border-zinc-800 rounded-3xl">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Active Bookings (Model A) */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-500" /> Active Bookings
            </h2>
            
            {bookings.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
                <Truck className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">No active bookings found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                        <Truck className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{booking.equipment?.name || "Equipment"}</h3>
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> 
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="text-amber-500 font-medium">{booking.totalAmount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'REQUESTED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        booking.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {booking.status}
                      </div>
                      <Button variant="ghost" className="text-zinc-400 hover:text-white shrink-0">
                        Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active RFQs (Model B) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Active RFQs
            </h2>
            
            {rfqs.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400 text-sm">You haven't broadcasted any RFQs yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.map((rfq: any) => (
                  <div key={rfq.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{rfq.quantity}x {rfq.equipmentType.replace("_", " ")}</h3>
                        <p className="text-xs text-zinc-500 mt-1">ID: {rfq.id.split("-")[0]}</p>
                      </div>
                      <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-bold">
                        {rfq.status}
                      </span>
                    </div>
                    
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-4">
                      <p className="text-xs text-zinc-500 mb-1">Quotes Received</p>
                      <p className="text-xl font-bold text-blue-500">{rfq.bidsReceived || 0}</p>
                    </div>
                    
                    <Link href={`/rental-rfq/${rfq.id}/quotes`}>
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                        Compare Quotes
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
