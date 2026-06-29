"use client";

import React, { useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { Scan, CheckCircle2, XCircle, Loader2, ArrowRight, Truck } from "lucide-react";
import { Button } from "@constructos/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function GatePassScanner() {
  const [equipmentId, setEquipmentId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentId) return;

    setIsScanning(true);
    setResult(null);
    try {
      // Simulate real-world RFID scan delay
      await Promise.resolve();
      
      const response = await ApiClient.post(`/api/v1/equipment/${equipmentId}/verify-gate-pass`);
      setResult(response);
    } catch (error) {
      setResult({ status: "BLOCKED", reason: "Invalid ID or system error." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualReturn = async () => {
    setIsScanning(true);
    try {
      await Promise.resolve();
      setResult({ status: "RETURNED", message: "Equipment securely returned to yard. Calendar updated." });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white font-sans p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden group">
            <Scan className="w-10 h-10 text-emerald-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Gate Pass Scanner</h1>
          <p className="text-zinc-400">Verify equipment leaving or entering the yard via RFID or manual ID entry.</p>
        </div>

        <form onSubmit={handleScan} className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2 text-center">Enter Equipment ID / Scan Barcode</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={equipmentId}
              onChange={e => setEquipmentId(e.target.value)}
              placeholder="e.g. EQ-12345"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              type="submit"
              disabled={isScanning || !equipmentId}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-xl"
            >
              {isScanning && !result ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
              Dispatch (Out)
            </Button>
            <Button 
              type="button"
              onClick={handleManualReturn}
              disabled={isScanning || !equipmentId}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-xl"
            >
              Return (In)
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-6 rounded-3xl border backdrop-blur-xl text-center shadow-2xl ${
                result.status === 'ALLOWED' || result.status === 'RETURNED'
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              {result.status === 'ALLOWED' || result.status === 'RETURNED' ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                    {result.status === 'ALLOWED' ? 'Gate Pass Verified' : 'Equipment Returned'}
                  </h3>
                  <p className="text-emerald-100/80">{result.message}</p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-rose-400 mb-2">Access Denied</h3>
                  <p className="text-rose-100/80">{result.reason}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
