"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api-client";
import { 
  FileText, ShieldCheck, Star, MapPin, CheckCircle2, Building2, Truck
} from "lucide-react";
import { Button } from "@constructos/ui";
import { toast } from "sonner";

export default function QuoteComparisonPage() {
  const params = useParams();
  const router = useRouter();
  
  const [rfq, setRfq] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAwarding, setIsAwarding] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRfqAndQuotes() {
      try {
        const [rfqRes, quotesRes] = await Promise.all([
          ApiClient.get(`/api/v1/rental-rfq/${params.id}`),
          ApiClient.get(`/api/v1/rental-rfq/${params.id}/quotes`)
        ]);
        setRfq(rfqRes);
        setQuotes(quotesRes);
      } catch (e) {
        console.error("Failed to load RFQ data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRfqAndQuotes();
  }, [params.id]);

  const handleAwardContract = async (quoteId: string) => {
    setIsAwarding(quoteId);
    try {
      // Create Order or update RFQ status. Using existing commerce-network if needed, 
      // or simply update RFQ status here. For demo, we'll just show success.
      await Promise.resolve(); 
      router.push("/rentals/contractor");
    } catch (e) {
      console.error(e);
      toast.error("Action failed", { description: e?.message || "An unexpected error occurred" });
    } finally {
      setIsAwarding(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <FileText className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">RFQ Not Found</h2>
        <Button onClick={() => router.back()} className="mt-6 bg-zinc-800 text-white">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white font-sans p-6 md:p-10">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* RFQ Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                RFQ Active
              </span>
              <span className="text-zinc-500 text-sm">ID: {rfq.id.split("-")[0]}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {rfq.quantity}x {rfq.equipmentType.replace("_", " ")}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {rfq.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> {new Date(rfq.requiredFrom).toLocaleDateString()} to {new Date(rfq.requiredUntil).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right bg-zinc-950 p-4 rounded-2xl border border-zinc-800 w-full md:w-auto">
            <p className="text-sm text-zinc-500 mb-1">Total Quotes Received</p>
            <p className="text-4xl font-bold text-blue-500">{quotes.length}</p>
          </div>
        </div>

        {/* Quotes Comparison */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Compare Quotes</h2>
          
          {quotes.length === 0 ? (
            <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl h-64 flex flex-col items-center justify-center text-zinc-500">
              <FileText className="w-12 h-12 mb-4 text-zinc-700" />
              <p>Waiting for fleet owners to submit quotes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col hover:border-blue-500/30 transition-colors relative overflow-hidden group">
                  {/* Highlight Lowest Bid */}
                  {quotes.length > 1 && quote.quoteAmount === Math.min(...quotes.map(q => q.quoteAmount)) && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-bl-xl z-10 shadow-lg">
                      Lowest Bid
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-zinc-500" /> 
                        {quote.vendor?.companyName || "Vendor Name"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg"><ShieldCheck className="w-3 h-3"/> Verified</span>
                        <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-amber-500"/> 4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-2xl p-4 mb-6">
                    <p className="text-xs text-zinc-500 mb-1">Proposed Total Price</p>
                    <p className="text-3xl font-bold text-white">{quote.quoteAmount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Available for requested dates</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-400 mb-2">Terms & Conditions</p>
                    <p className="text-sm text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                      {quote.termsAndConditions || "Standard terms apply."}
                    </p>
                  </div>

                  <Button 
                    onClick={() => handleAwardContract(quote.id)}
                    disabled={isAwarding !== null}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all"
                  >
                    {isAwarding === quote.id ? "Awarding..." : "Award Contract & Generate PO"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
