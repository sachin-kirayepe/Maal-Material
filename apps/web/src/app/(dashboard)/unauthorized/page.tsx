"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-black font-sans p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your current security clearance level does not permit access to this module. 
          Please contact your system administrator if you require elevated privileges.
        </p>

        <button 
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
