"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertOctagon, Search } from "lucide-react";

import { useFraudStore } from "../../../stores/fraudStore";

export default function FraudDetection() {
  const { signals: alerts, isLoading, fetchSignals } = useFraudStore();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  React.useEffect(() => {
    fetchSignals("tenant-1");
  }, [fetchSignals]);

  React.useEffect(() => {
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, [alerts, selectedAlert]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={28} /> AI Fraud & Anomaly Detection
          </h1>
          <p className="text-zinc-400">Suspicious activity alerts, double invoicing flags, and phantom vendor detection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Alerts Feed */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input type="text" placeholder="Search anomalies..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white" />
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-zinc-500 text-center py-8">Loading anomaly signals...</div>
            ) : alerts.length === 0 ? (
              <div className="text-zinc-500 text-center py-8 border border-dashed border-zinc-800">No anomalies detected.</div>
            ) : (
              alerts.map((alert: any, i) => (
              <div 
                key={alert.id || i}
                onClick={() => setSelectedAlert(alert)}
                className={`bg-zinc-900 border rounded-xl p-4 cursor-pointer transition-all ${selectedAlert?.id === alert.id ? 'border-red-500 bg-red-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded ${alert.severity === 'Critical' || alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : alert.severity === 'High' || alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {alert.severity || "MEDIUM"}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{alert.id?.slice(0,8) || `FRAUD-${i}`}</span>
                </div>
                <h3 className="font-medium text-white mb-1">{alert.signalType || alert.type || "Suspicious Activity"}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1">{alert.entityId || alert.target}</p>
              </div>
            )))}
          </div>
        </div>

        {/* Alert Details & Action Panel */}
        <div className="lg:col-span-2">
          {selectedAlert ? (
          <motion.div 
            key={selectedAlert.id}
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
          >
            <div className="flex items-start gap-6 border-b border-zinc-800 pb-8 mb-8">
              <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/50 rounded-2xl flex items-center justify-center shrink-0">
                {selectedAlert.icon ? <selectedAlert.icon className="text-red-500" size={32} /> : <AlertOctagon className="text-red-500" size={32} />}
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white mb-2">{selectedAlert.signalType || selectedAlert.type || "Suspicious Activity"}</h2>
                <p className="text-zinc-400 mb-2">Target Entity: <span className="text-white font-medium">{selectedAlert.entityId || selectedAlert.target}</span></p>
                <p className="text-sm text-zinc-500">Detected on: {selectedAlert.detectedAt ? new Date(selectedAlert.detectedAt).toLocaleString() : selectedAlert.date}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3">AI Analysis Report</h3>
              <div className="bg-black border border-zinc-800 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed">
                {selectedAlert.description || selectedAlert.desc}
              </div>
            </div>

            {selectedAlert.type === "Double Invoicing" && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black border border-zinc-800 rounded-xl p-4 opacity-50">
                  <p className="text-xs text-zinc-500 mb-1">Original Invoice (Paid)</p>
                  <p className="font-mono text-sm">INV-1092-A</p>
                  <p className="text-xs text-zinc-400 mt-2">Amount: ₹1,45,000</p>
                  <p className="text-xs text-zinc-400">Date: 10 Jun 2026</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-4">
                  <p className="text-xs text-red-400 mb-1">Duplicate Invoice (Flagged)</p>
                  <p className="font-mono text-sm text-white">INV-2991</p>
                  <p className="text-xs text-zinc-400 mt-2">Amount: ₹1,45,000</p>
                  <p className="text-xs text-zinc-400">Date: 15 Jun 2026</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-500 transition-colors flex items-center justify-center gap-2">
                <AlertOctagon size={18}/> Block Payment & Vendor
              </button>
              <button className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-700 transition-colors">
                Mark as False Positive
              </button>
            </div>
          </motion.div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center h-full text-zinc-500">
              Select an anomaly alert to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
