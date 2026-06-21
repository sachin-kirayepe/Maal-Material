import React from "react";
import { useLiveCommerceStore } from "../../store/live-commerce-state";
import {
  ShieldCheck as ShieldCheckIcon,
  Truck as TruckIcon,
  Clock as ClockIcon,
  AlertTriangle as AlertTriangleIcon,
  FileText as FileTextIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
} from "lucide-react";
const ShieldCheck = ShieldCheckIcon as any;
const Truck = TruckIcon as any;
const Clock = ClockIcon as any;
const AlertTriangle = AlertTriangleIcon as any;
const FileText = FileTextIcon as any;
const ChevronRight = ChevronRightIcon as any;
const X = XIcon as any;
import { Button } from "@constructos/ui";

export function ProcurementCommandPanel() {
  const {
    procurementDraft,
    products,
    removeItemFromDraft,
    setDraftPriority,
    setDraftDestination,
    setCheckoutOpen,
  } = useLiveCommerceStore();

  const totalItems = procurementDraft.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = procurementDraft.items.reduce((acc, item) => {
    const product = products[item.productId];
    return acc + (product ? product.currentPrice * item.quantity : 0);
  }, 0);

  if (procurementDraft.items.length === 0) {
    return (
      <div className="h-full w-full glass-panel border border-white/5 flex flex-col items-center justify-center p-8 text-center bg-black/40">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">Procurement Command Empty</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Add industrial assets from the marketplace to initiate an enterprise RFQ or direct
          purchase workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass-panel border border-white/10 bg-black/60 shadow-2xl relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between z-10">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Active Draft
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground">
            ID: PRQ-{Date.now().toString().slice(-6)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono text-primary">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground uppercase">
            {totalItems} Assets
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10">
        {procurementDraft.items.map((item) => {
          const product = products[item.productId];
          if (!product) return null;

          return (
            <div
              key={item.productId}
              className="flex gap-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white truncate pr-2">{product.name}</h4>
                  <button
                    onClick={() => removeItemFromDraft(item.productId)}
                    className="text-muted-foreground hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
                  <span className="text-slate-400">
                    QTY: <span className="text-white font-bold">{item.quantity}</span>
                  </span>
                  <span className="text-slate-400">@ ${product.currentPrice.toFixed(2)}</span>
                  <span className="text-primary ml-auto">
                    ${(product.currentPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routing & Execution Controls */}
      <div className="p-4 bg-black/40 border-t border-white/10 z-10 space-y-4">
        {/* Destination & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              <Truck className="w-3 h-3" /> Routing Destination
            </label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-md text-xs text-white p-2 focus:outline-none focus:border-primary/50 font-mono"
              value={procurementDraft.destination}
              onChange={(e) => setDraftDestination(e.target.value)}
            >
              <option value="Sector 4 Depot" className="bg-slate-900">
                Sector 4 Depot
              </option>
              <option value="Alpha Hub Operations" className="bg-slate-900">
                Alpha Hub Operations
              </option>
              <option value="Global Distribution Network" className="bg-slate-900">
                Global Dist Network
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Priority Class
            </label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-md text-xs text-white p-2 focus:outline-none focus:border-primary/50 font-mono"
              value={procurementDraft.priority}
              onChange={(e) => setDraftPriority(e.target.value as any)}
            >
              <option value="ROUTINE" className="bg-slate-900">
                ROUTINE (Standard SLA)
              </option>
              <option value="EXPEDITED" className="bg-slate-900">
                EXPEDITED (+15% Cost)
              </option>
              <option value="CRITICAL" className="bg-slate-900">
                CRITICAL (AOG / Emergency)
              </option>
            </select>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-md p-3 flex gap-3 items-start">
          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-primary/80 leading-relaxed font-mono uppercase">
            Estimated execution capability verified. Global inventory levels indicate a 98%
            fulfillment probability within 72 hours for selected destination.
          </p>
        </div>

        <Button
          className="w-full bg-primary text-black hover:bg-primary/90 font-bold tracking-widest uppercase text-xs h-10"
          onClick={() => setCheckoutOpen(true)}
        >
          Initialize Checkout <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
