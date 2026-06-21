"use client";

import React from "react";
import { Bell, Mail, MessageSquare, Smartphone, Clock } from "lucide-react";

export default function RemindersCenter() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Bell className="text-orange-500" size={28} /> Notification & Reminder Center
          </h1>
          <p className="text-zinc-400">Configure global triggers for SMS, Email, and Push notifications across all modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Purchase Order Triggers */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800">
              <h2 className="font-medium text-white">Purchase & Procurement</h2>
            </div>
            <div className="p-0">
              {[
                { event: "PO requires approval (Over 1Cr)", email: true, sms: true, push: true },
                { event: "Vendor rejects a PO", email: true, sms: false, push: true },
                { event: "Material Delivery delayed by > 2 hours", email: false, sms: true, push: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <p className="text-sm text-zinc-300 font-medium">{row.event}</p>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.email ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <Mail size={14}/> <span className="text-xs">Email</span>
                    </label>
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.sms ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <MessageSquare size={14}/> <span className="text-xs">SMS</span>
                    </label>
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.push ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <Smartphone size={14}/> <span className="text-xs">Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Triggers */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800">
              <h2 className="font-medium text-white">Compliance & Security</h2>
            </div>
            <div className="p-0">
              {[
                { event: "Suspicious Login Detected (New IP)", email: true, sms: true, push: true },
                { event: "Vendor Insurance Expiring in 7 days", email: true, sms: false, push: false },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <p className="text-sm text-zinc-300 font-medium">{row.event}</p>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.email ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <Mail size={14}/> <span className="text-xs">Email</span>
                    </label>
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.sms ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <MessageSquare size={14}/> <span className="text-xs">SMS</span>
                    </label>
                    <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${row.push ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                      <Smartphone size={14}/> <span className="text-xs">Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminders / Schedulers Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white flex items-center gap-2 mb-6"><Clock className="text-orange-500" size={18}/> Scheduled Reminders</h3>
            
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-sm font-medium text-white mb-1">Daily Site Attendance Report</p>
                <p className="text-xs text-zinc-400 mb-3">Sends a consolidated PDF of all worker attendance to Project Managers.</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300 font-mono">Everyday at 06:00 PM</span>
                  <button className="text-orange-500 hover:text-orange-400 font-medium">Edit</button>
                </div>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-4">
                <p className="text-sm font-medium text-white mb-1">Weekly Financial Summary</p>
                <p className="text-xs text-zinc-400 mb-3">Sends burn rate vs budget metrics to CxO level roles.</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300 font-mono">Friday at 08:00 AM</span>
                  <button className="text-orange-500 hover:text-orange-400 font-medium">Edit</button>
                </div>
              </div>

              <button className="w-full py-2 border-2 border-dashed border-zinc-800 text-zinc-500 rounded-xl text-sm font-medium hover:border-zinc-600 hover:text-white transition-colors">
                + Add Scheduled Report
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
