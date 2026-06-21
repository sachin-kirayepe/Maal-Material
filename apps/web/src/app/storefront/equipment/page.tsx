"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Truck, MapPin, Search, ChevronRight, X, AlertCircle } from "lucide-react";
import { useEquipmentStore } from "@/stores/equipmentStore";
import { useRentalsStore } from "@/stores/rentalsStore";
import { useRouter } from "next/navigation";

export default function EquipmentRentals() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All Equipment");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("1 Day (8 Hrs)");
  const [siteAddress, setSiteAddress] = useState("");
  const router = useRouter();

  const { equipment, fetchEquipment, isLoading } = useEquipmentStore();
  const { fetchBookings } = useRentalsStore();

  useEffect(() => {
    fetchEquipment("tenant_123"); // Fetch globally or pass real tenant
  }, [fetchEquipment]);

  const handleBook = (eq: any) => {
    setSelectedEq(eq);
    setIsBookingOpen(true);
  };

  const submitRentalRequest = async () => {
    // In a real app, this will hit `rentalsStore.createBooking`
    // For now, redirect to login as a guest
    setIsBookingOpen(false);
    router.push("/login?redirect=/checkout");
  };

  const filteredEquipment = equipment.filter((eq) => {
    if (activeCategory === "All Equipment") return true;
    return eq.category === activeCategory;
  });

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Header Banner */}
      <div className="bg-zinc-950 border-b border-zinc-800 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Truck className="mx-auto text-blue-500 mb-6" size={48} />
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6">Heavy Equipment Rentals</h1>
          <p className="text-zinc-400 text-lg mb-8">
            Book excavators, cranes, transit mixers, and power generators on an hourly or daily basis. Operator and fuel options available.
          </p>
          <div className="flex bg-black border border-zinc-800 rounded-full p-2 max-w-xl mx-auto">
            <Search className="text-zinc-500 ml-4 mt-3" size={20} />
            <input 
              type="text" 
              placeholder="E.g. JCB 3DX in Mumbai..." 
              className="w-full bg-transparent border-none py-2 px-4 focus:outline-none text-white"
            />
            <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
          {["All Equipment", "Earthmoving", "Concrete", "Cranes & Lifting", "Power Generators", "Scaffolding"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? "bg-white text-black border-white" 
                  : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && <p className="text-zinc-500">Loading equipment catalog...</p>}
          {!isLoading && filteredEquipment.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 border border-zinc-800 rounded-2xl border-dashed">
              No equipment found in the "{activeCategory}" category.
            </div>
          )}
          {filteredEquipment.map((eq: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={eq.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col"
            >
              <div className="h-48 relative bg-zinc-800">
                <img src={eq.image} alt={eq.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-zinc-700 text-xs px-2 py-1 rounded text-white">
                  {eq.category}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-medium text-white mb-2 leading-tight">{eq.name}</h3>
                
                <div className="space-y-2 text-sm text-zinc-400 mb-6 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-zinc-500" /> {eq.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-zinc-500" /> {eq.operatorIncluded ? 'Operator Included' : 'Dry Rent (No Operator)'}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Daily Rate</p>
                    <p className="text-xl font-medium text-white">₹{eq.pricing?.dailyRate || eq.pricePerDay || "N/A"}</p>
                  </div>
                  <button 
                    onClick={() => handleBook(eq)}
                    className="flex items-center gap-1 text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Book Now <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && selectedEq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsBookingOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black"
            >
              <button onClick={() => setIsBookingOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white z-10 bg-black/50 rounded-full p-1">
                <X size={20} />
              </button>

              <div className="md:w-1/3 bg-zinc-950 p-6 border-r border-zinc-800">
                <img src={selectedEq.images?.[0] || selectedEq.image || "https://via.placeholder.com/300x200/333333/FFFFFF?text=Equipment"} alt={selectedEq.name} className="w-full h-32 object-cover rounded-xl mb-4 opacity-70" />
                <h3 className="font-medium text-white leading-tight mb-4">{selectedEq.name}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500">Daily Rate (8 hrs)</p>
                    <p className="text-lg font-medium text-white">₹{selectedEq.pricing?.dailyRate || selectedEq.pricePerDay || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Hourly Rate</p>
                    <p className="text-lg font-medium text-white">₹{selectedEq.pricing?.hourlyRate || selectedEq.pricePerHour || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-light mb-6">Rental Request</h2>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Start Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input type="date" className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500 text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Duration</label>
                      <select className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 appearance-none text-white">
                        <option>1 Day (8 Hrs)</option>
                        <option>3 Days</option>
                        <option>1 Week</option>
                        <option>1 Month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Delivery Site Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-zinc-500" size={16} />
                      <textarea rows={2} placeholder="Enter full site address..." className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500 text-white resize-none"></textarea>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button onClick={submitRentalRequest} className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto">
                      Submit Rental Request
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
