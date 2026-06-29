"use client";

import React from "react";
import { toast } from "sonner";
import { Lightbulb, ShoppingCart, Percent, TrendingDown, ArrowRight, Loader2 } from "lucide-react";
import { usePurchaseIntelligenceStore } from "@/stores/purchaseIntelligenceStore";
import { useTenantId } from "@/hooks/useTenantId";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";

export default function PurchaseIntelligence() {
  const tenantId = useTenantId();
  const router = useRouter();
  const { analytics, isLoading, fetchAnalytics } = usePurchaseIntelligenceStore();

  React.useEffect(() => {
    if (tenantId) fetchAnalytics(tenantId);
  }, [fetchAnalytics, tenantId]);

  const recommendations = analytics?.recommendations || [];

  const handleDraftPO = (recommendation: any) => {
    toast.info("Navigating to PO creation...");
    router.push(`/procurement/po/new?material=${encodeURIComponent(recommendation.material || "")}&vendor=${encodeURIComponent(recommendation.vendor || "")}`);
  };

  const handleReviewAlternatives = (recommendation: any) => {
    toast.info("Opening vendor comparison...");
    router.push(`/sourcing?material=${encodeURIComponent(recommendation.material || "")}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PRICE_DROP": return { Icon: TrendingDown, color: "yellow", label: "Price Drop Alert" };
      case "BULK_DISCOUNT": return { Icon: Percent, color: "blue", label: "Bulk Discount" };
      case "VENDOR_SWITCH": return { Icon: ArrowRight, color: "zinc", label: "Vendor Switch" };
      default: return { Icon: Lightbulb, color: "purple", label: "AI Recommendation" };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Lightbulb className="text-yellow-500" size={28} /> Smart Sourcing Recommendations
          </h1>
          <p className="text-zinc-400">AI-driven suggestions to optimize procurement, timing, and vendor selection.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No Recommendations Yet"
          description="AI is continuously analyzing your purchase patterns, market prices, and vendor performance. Recommendations will appear here when actionable insights are available."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec: any, i: number) => {
            const { Icon: RecIcon, color, label } = getIcon(rec.type);
            const colorMap: Record<string, string> = {
              yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
              blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
              zinc: "text-zinc-400 bg-zinc-800 border-zinc-700",
              purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            };
            const styles = colorMap[color] || colorMap.purple;

            return (
              <div key={rec.id || i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShoppingCart size={80} className={styles.split(" ")[0]} />
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium w-fit px-2 py-1 rounded border mb-4 uppercase tracking-widest ${styles}`}>
                  <RecIcon size={14} /> {label}
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{rec.title || rec.material || "Recommendation"}</h3>
                <p className="text-sm text-zinc-400 mb-6">{rec.description || rec.reason || "AI-generated recommendation based on your purchase history."}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <div className="text-sm">
                    {rec.vendor && (
                      <>
                        <span className="text-zinc-500 block text-xs">{rec.type === "VENDOR_SWITCH" ? "Suggested Vendor" : "Recommended Vendor"}</span>
                        <span className="text-white font-medium">{rec.vendor} {rec.vendorScore ? `(${rec.vendorScore}/100 Score)` : ""}</span>
                      </>
                    )}
                    {rec.savings && (
                      <>
                        <span className="text-zinc-500 block text-xs">Estimated Savings</span>
                        <span className="text-green-400 font-medium">{rec.savings.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  {rec.type === "VENDOR_SWITCH" ? (
                    <button onClick={() => handleReviewAlternatives(rec)} className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
                      Review Alternatives
                    </button>
                  ) : (
                    <button onClick={() => handleDraftPO(rec)} className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors">
                      Draft PO
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
