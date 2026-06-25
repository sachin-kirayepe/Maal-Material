"use client";

import React from "react";
import { Filter, Star, Truck, User as UserIcon, Fuel } from "lucide-react";
import { Button } from "@constructos/ui";

export function EquipmentSearchSidebar() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Filter className="w-5 h-5 text-amber-500" /> Filters
        </h2>
        <button className="text-sm text-zinc-500 hover:text-white transition-colors">Clear all</button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-white">Pricing (Daily Rate)</h3>
        <div className="space-y-3">
          {["Under ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹20,000", "Above ₹20,000"].map((range) => (
            <label key={range} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                <input type="checkbox" className="opacity-0 w-0 h-0" />
              </div>
              <span className="text-zinc-400 group-hover:text-white transition-colors">{range}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-800/50"></div>

      <div className="space-y-4">
        <h3 className="font-semibold text-white">Included Services</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <input type="checkbox" className="opacity-0 w-0 h-0" />
            </div>
            <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Operator Included
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <input type="checkbox" className="opacity-0 w-0 h-0" />
            </div>
            <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2">
              <Fuel className="w-4 h-4" /> Fuel Included (Wet Lease)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-amber-500 flex items-center justify-center transition-colors">
              <input type="checkbox" className="opacity-0 w-0 h-0" />
            </div>
            <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2">
              <Truck className="w-4 h-4" /> Free Transport
            </span>
          </label>
        </div>
      </div>

      <div className="w-full h-px bg-zinc-800/50"></div>

      <div className="space-y-4">
        <h3 className="font-semibold text-white">Minimum Rating</h3>
        <div className="space-y-3">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                <input type="radio" name="rating" className="opacity-0 w-0 h-0" />
              </div>
              <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-amber-500 text-amber-500" : "text-zinc-700"}`} />
                ))}
                <span className="ml-2 text-sm">& Up</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-6 rounded-xl border border-zinc-700/50">
        Apply Filters
      </Button>
    </div>
  );
}
