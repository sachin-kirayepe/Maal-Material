import React from 'react';
import { Hammer, HardHat, Settings, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0D0D12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Industrial Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping opacity-20 bg-orange-500 rounded-full"></div>
          <div className="w-24 h-24 bg-[#1A1D24] border border-white/10 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl">
            <HardHat className="w-12 h-12 text-orange-500" />
          </div>
          
          {/* Floating Tools */}
          <Wrench className="absolute -left-8 top-0 w-8 h-8 text-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <Settings className="absolute -right-8 top-4 w-8 h-8 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
          <Hammer className="absolute -left-4 bottom-0 w-8 h-8 text-slate-400 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          System <span className="text-orange-500">Upgrades</span> in Progress
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
          ConstructOS is currently undergoing scheduled industrial-grade maintenance. 
          We are deploying powerful new enterprise features to improve your supply chain experience.
        </p>

        <div className="bg-[#1A1D24] border border-white/10 rounded-xl p-6 mb-10 w-full max-w-md backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Maintenance Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Core Systems
              </span>
              <span className="text-slate-200 text-sm font-medium">Secured</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div> Network Upgrade
              </span>
              <span className="text-orange-500 text-sm font-medium">Deploying...</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-orange-500 h-full w-2/3 rounded-full relative">
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Expected completion shortly. Please check back later.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
