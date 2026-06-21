"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <div className="relative w-16 h-16">
        {/* Sleek rotating industrial steel crane themed loader */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-sm font-semibold tracking-widest text-slate-400 uppercase animate-pulse">
        Initializing Maal-Material...
      </p>
    </div>
  );
}
