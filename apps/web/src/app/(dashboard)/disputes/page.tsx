"use client";

import React, { useEffect, useState } from "react";
import { useDisputeStore } from "@/stores/disputeStore";
import { Card, Button } from "@constructos/ui";
import { AlertOctagon, Plus, Search, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export default function DisputesPage() {
  const { disputes, isLoading, fetchDisputes } = useDisputeStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const filteredDisputes = disputes.filter(
    (d) =>
      d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 tracking-tight">
            Resolution Center
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Manage and resolve ecosystem disputes</p>
        </div>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 border-0 rounded-xl transition-all hover:scale-105 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Raise Dispute
        </Button>
      </div>

      <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-3xl overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search disputes by ID or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading dispute records...</div>
          ) : filteredDisputes.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500/50 mb-4" />
              <h3 className="text-xl font-bold text-slate-300">No Active Disputes</h3>
              <p className="text-slate-500 mt-2">Your ecosystem operations are running smoothly.</p>
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="bg-slate-950 border border-slate-800/80 shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      dispute.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {dispute.title || "Order Issue"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-mono text-xs">ID: {dispute.id?.substring(0, 8)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      dispute.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-orange-500/10 text-orange-400"
                    }`}
                  >
                    {dispute.status || "OPEN"}
                  </span>

                  <Button
                    variant="outline"
                    className="border-slate-800 text-slate-300 hover:bg-slate-800"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
