import React, { useState } from "react";
import { useLiveCommerceStore } from "../../store/live-commerce-state";
import {
  X as XIcon,
  Network as NetworkIcon,
  Globe2 as Globe2Icon,
  ShieldCheck as ShieldCheckIcon,
  Cpu as CpuIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle2 as CheckCircle2Icon,
} from "lucide-react";
import { Button } from "@constructos/ui";
const ArrowRight = ArrowRightIcon as any;
const X = XIcon as any;
const Network = NetworkIcon as any;
const Globe2 = Globe2Icon as any;
const ShieldCheck = ShieldCheckIcon as any;
const Cpu = CpuIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;
import { useProcurementStore } from "@/stores/procurementStore";
import { toast } from "sonner";
import { useTenantId } from "@/hooks/useTenantId";

export function CinematicCheckout() {
  const { isCheckoutOpen, setCheckoutOpen, procurementDraft, clearDraft, products } = useLiveCommerceStore();
  const { createPurchaseOrder } = useProcurementStore();
  const [step, setStep] = useState(0);

  if (!isCheckoutOpen) return null;

  const totalItems = procurementDraft.items.reduce((acc, item) => acc + item.quantity, 0);

  const steps = [
    { title: "Verifying Network Integrity", icon: <Network className="w-6 h-6" /> },
    { title: "Routing Global Logistics", icon: <Globe2 className="w-6 h-6" /> },
    { title: "Applying Procurement Governance", icon: <ShieldCheck className="w-6 h-6" /> },
    { title: "Orchestrating Order", icon: <Cpu className="w-6 h-6" /> },
  ];

  const advanceStep = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (step === steps.length - 1) {
      // Execute the order creation just before the final success step
      try {
        const payload = {
          tenantId,
          destination: procurementDraft.destination,
          priority: procurementDraft.priority,
          items: procurementDraft.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products[item.productId]?.currentPrice || 0
          }))
        };
        await createPurchaseOrder(payload);
        toast.success("Purchase Order Orchestrated Successfully!");
        setStep(step + 1);
      } catch (e) {
        toast.error("Failed to orchestrate purchase order");
        setCheckoutOpen(false);
        setStep(0);
      }
    } else {
      clearDraft();
      setCheckoutOpen(false);
      setStep(0);
    }
  };

  const isComplete = step === steps.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Abyssal Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-2xl bg-black/60 border border-white/10 p-8 shadow-2xl glass-panel animate-in zoom-in-95 duration-500 rounded-2xl">
        {!isComplete && (
          <button
            onClick={() => setCheckoutOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
            {isComplete ? "Execution Confirmed" : "Enterprise Orchestration"}
          </h2>
          <p className="text-primary font-mono text-sm mt-2">
            {isComplete
              ? "Payload Delivered to Global Network"
              : `Processing ${totalItems} Assets -> ${procurementDraft.destination}`}
          </p>
        </div>

        <div className="space-y-6">
          {!isComplete ? (
            steps.map((s, i) => {
              const isActive = step === i;
              const isPast = step > i;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                    isActive
                      ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                      : isPast
                        ? "bg-white/5 border-emerald-500/30 text-emerald-500 opacity-70"
                        : "bg-white/5 border-white/5 text-muted-foreground opacity-30"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                      isActive
                        ? "border-primary/50 bg-primary/20"
                        : isPast
                          ? "border-emerald-500/50 bg-emerald-500/20"
                          : "border-white/10 bg-black/50"
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold tracking-widest uppercase text-sm">{s.title}</h3>
                    <p className="text-[10px] font-mono mt-1 opacity-80">
                      {isActive
                        ? "Processing node connection..."
                        : isPast
                          ? "Node execution successful"
                          : "Awaiting sequence"}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Order PRQ-{Date.now().toString().slice(-6)} Orchestrated
              </h3>
              <p className="text-sm text-slate-400 text-center max-w-md">
                The industrial assets have been allocated and logistics routing has commenced. View
                live tracking in the Logistics Hub.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={advanceStep}
            className={`font-bold tracking-widest uppercase h-12 px-8 ${
              isComplete
                ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                : "bg-primary hover:bg-primary/90 text-black"
            }`}
          >
            {isComplete
              ? "Return to Dashboard"
              : isActiveState()
                ? "Authorize Sequence"
                : "Acknowledge & Finalize"}
            {!isComplete && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );

  function isActiveState() {
    return step < steps.length - 1;
  }
}
