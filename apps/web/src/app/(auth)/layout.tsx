import React from "react";
import { HardHat as HardHatIcon } from "lucide-react";
const HardHat = HardHatIcon as any;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-slate-950">
      {/* Visual branding column - shown only on desktop */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-slate-900/40 border-r border-slate-800/60 overflow-hidden">
        {/* Glow vector details */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none translate-y-20 -translate-x-20"></div>

        {/* Branding header */}
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <HardHat className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            Construct<span className="text-amber-500">OS</span>
          </span>
        </div>

        {/* Dynamic description or copy */}
        <div className="z-10 mt-auto max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            The Industrial Commerce Operating System.
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Maal-Material integrates heavy materials procurement, multi-tenant contractor ERP, smart
            B2B billing flows, and complex site logistics inside a unified, secure platform.
          </p>
          <div className="flex items-center gap-2 mt-8 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Platform Kernel v1.0.0 Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Authentication container */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-8 bg-slate-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03),transparent_70%)] pointer-events-none"></div>
        <div className="w-full max-w-md z-10">{children}</div>
      </div>
    </div>
  );
}
