"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Calendar, MapPin, Target, CheckCircle2, Circle, AlertTriangle, ArrowRight } from "lucide-react";

import { useProjectStore } from "@/stores/projectStore";

export default function ProjectDeepDive() {
  const { projects: milestones, isLoading, fetchProjects } = useProjectStore();

  React.useEffect(() => {
    fetchProjects({ tenantId: "tenant-1" });
  }, [fetchProjects]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              <Building2 className="text-purple-500" size={28} /> Project Alpha
            </h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-medium">Active</span>
          </div>
          <p className="text-zinc-400 flex items-center gap-2"><MapPin size={14} /> Bandra Kurla Complex, Mumbai, MH</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors">
            Generate Report
          </button>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
            Update Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex gap-12">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Budget</p>
                <p className="text-2xl font-medium text-white">₹15.5 Cr</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Spent so far</p>
                <p className="text-2xl font-medium text-purple-400">₹4.2 Cr</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Target Completion</p>
                <p className="text-2xl font-medium text-white">Dec 2026</p>
              </div>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#27272a" strokeWidth="8" />
                <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="#a855f7" strokeWidth="8" strokeDasharray="250" strokeDashoffset="180" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-medium text-lg text-white">28%</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2">
              <Target size={18} className="text-zinc-400" /> Project Milestones
            </h3>
            <div className="relative border-l-2 border-zinc-800 ml-3 space-y-8 pb-4">
              {isLoading ? (
                <div className="text-zinc-500 pl-6">Loading project milestones...</div>
              ) : milestones.length === 0 ? (
                <div className="text-zinc-500 pl-6">No milestones recorded yet.</div>
              ) : (
                milestones.map((m: any, i: number) => (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={m.id || i} className="relative pl-6">
                  <div className={`absolute -left-[11px] top-1 bg-black rounded-full ${m.status === 'Completed' || m.status === 'COMPLETED' ? 'text-green-500' : m.status === 'In Progress' || m.status === 'ACTIVE' ? 'text-blue-500' : 'text-zinc-600'}`}>
                    {m.status === 'Completed' || m.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} className={m.status === 'In Progress' || m.status === 'ACTIVE' ? 'fill-blue-500/20' : ''} />}
                  </div>
                  <h4 className="font-medium text-white text-lg">{m.title || m.name}</h4>
                  <p className="text-zinc-400 text-sm mt-1 flex items-center gap-1"><Calendar size={14} /> Target: {m.date || (m.endDate ? new Date(m.endDate).toLocaleDateString() : "TBD")}</p>
                </motion.div>
              )))}
            </div>
          </div>
        </div>

        {/* Action / Alerts Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <h3 className="font-medium text-red-400 mb-4 flex items-center gap-2"><AlertTriangle size={18}/> Critical Issues</h3>
            <div className="space-y-4">
              <div className="bg-black border border-red-500/20 p-4 rounded-xl">
                <p className="text-sm font-medium text-white mb-1">Cement Shortage</p>
                <p className="text-xs text-zinc-400 mb-3">Inventory drops below 2 days buffer.</p>
                <button className="text-xs text-red-400 font-medium hover:text-red-300 flex items-center gap-1">Request Supply <ArrowRight size={12}/></button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-4">Key Contacts</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-white">Rahul Sharma</p>
                  <p className="text-xs text-zinc-500">Site Engineer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-white">Amit Desai</p>
                  <p className="text-xs text-zinc-500">Project Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
