"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { Card, Button } from "@constructos/ui";
import { Plus, Search, ShieldCheck, Settings, Lock } from "lucide-react";

export default function RolesPage() {
  const { roles, isLoading, fetchRoles } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const filteredRoles = (roles as any[]).filter((r) =>
    (r.name || r.roleName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
            Roles & RBAC Matrix
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Define security groups and system permissions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-0 rounded-xl transition-all hover:scale-105 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-3xl overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search security roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-slate-500">
              Loading security roles...
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-500">No roles found.</div>
          ) : (
            filteredRoles.map((role) => (
              <Card
                key={role.id}
                className="bg-slate-950 border border-slate-800/80 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all rounded-2xl group overflow-hidden"
              >
                <div className="p-5 border-b border-slate-800/50 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold tracking-wide">{role.name || role.roleName}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {role.permissions?.length || 0} permissions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-white h-8 w-8 p-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 bg-slate-900/30">
                  <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Core Policies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.slice(0, 5).map((p: any) => (
                      <span
                        key={p.id || p}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 border border-slate-700 text-slate-300"
                      >
                        {p.action || p}
                      </span>
                    ))}
                    {(role.permissions?.length || 0) > 5 && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 border border-slate-700 text-emerald-400"
                      >
                        +{(role.permissions?.length || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
