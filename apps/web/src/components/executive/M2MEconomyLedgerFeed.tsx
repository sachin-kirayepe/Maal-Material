"use client";

import { useCivilizationStore } from "../../store/civilization-state";
import { Database, ArrowRightLeft } from "lucide-react";

export function M2MEconomyLedgerFeed() {
  const { transactions } = useCivilizationStore();

  return (
    <div className="glass-panel p-0 rounded-2xl relative overflow-hidden flex flex-col h-[400px]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-background/50 relative z-10">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold text-white tracking-widest">M2M ECONOMIC LEDGER</h3>
        </div>
        <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
          LIVE SYNC
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {transactions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-mono opacity-50">
            AWAITING LEDGER TRANSACTIONS...
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-background/40 border border-white/5 p-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <div className="flex flex-col">
                <span className="text-xs font-mono text-muted-foreground mb-1">
                  {tx.timestamp?.split("T")[1]?.split(".")[0]}
                </span>
                <span className="text-sm font-bold text-white tracking-wider">
                  {tx.serviceType}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground">BUYER</span>
                  <span className="text-xs font-mono text-primary">{tx.buyerId}</span>
                </div>

                <ArrowRightLeft className="w-4 h-4 text-white/20" />

                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-muted-foreground">SELLER</span>
                  <span className="text-xs font-mono text-accent">{tx.sellerId}</span>
                </div>
              </div>

              <div className="text-lg font-mono text-white font-light">
                {tx.value.toFixed(3)}
                <span className="text-xs text-primary ml-1">CR</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Industrial Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-20"
        style={{
          backgroundImage: "linear-gradient(transparent 50%, rgba(255,255,255,1) 50%)",
          backgroundSize: "100% 4px",
        }}
      ></div>
    </div>
  );
}
