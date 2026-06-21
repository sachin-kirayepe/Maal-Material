"use client";

import React, { useState } from "react";
import { Shield, Save, Users, Plus, Key } from "lucide-react";

import { useRBACStore } from "../../../stores/rbacStore";

export default function RBACEditor() {
  const { roles, permissions, isLoading, fetchRoles, fetchPermissions } = useRBACStore();
  const [activeRole, setActiveRole] = useState("Project Manager");

  React.useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Shield className="text-emerald-500" size={28} /> Role-Based Access Control
          </h1>
          <p className="text-zinc-400">Define granular permissions across all Maal-Material modules for different organizational roles.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-500 transition-colors">
          <Save size={18} /> Save Matrix
        </button>
      </div>

      <div className="flex gap-8">
        {/* Roles List */}
        <div className="w-1/4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-zinc-300">Roles</h3>
            <button className="text-emerald-500 hover:text-emerald-400 p-1"><Plus size={18}/></button>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="p-4 text-center text-zinc-500">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">No roles found.</div>
            ) : (
              roles.map((role: any) => (
              <button
                key={role.id || role.name || role}
                onClick={() => setActiveRole(role.name || role)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${(role.name || role) === activeRole ? 'bg-zinc-800 border-l-2 border-emerald-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
              >
                {(role.name || role) === 'Super Admin' ? <Key size={16}/> : <Users size={16}/>}
                <span className="font-medium text-sm">{role.name || role}</span>
              </button>
            )))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-medium text-white mb-1">Permissions for: <span className="text-emerald-400">{activeRole}</span></h2>
            <p className="text-sm text-zinc-500">Toggle the actions this role is allowed to perform.</p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="p-12 text-center text-zinc-500">Loading permissions...</div>
            ) : permissions.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">No permissions defined.</div>
            ) : (
              permissions.map((permGroup: any, idx) => (
              <div key={permGroup.id || idx} className="bg-black border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="font-medium text-sm text-white">{permGroup.module || permGroup.action || "Module"}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <input type="checkbox" className="accent-emerald-500 rounded bg-zinc-800 border-zinc-700" /> Select All
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(permGroup.actions || [permGroup.action]).map((action: any, aidx: number) => {
                    const isChecked = activeRole === 'Super Admin' || (activeRole === 'Project Manager' && !['Delete', 'Refund', 'Blacklist'].includes(action));
                    return (
                      <label key={aidx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-800 border-zinc-600'}`}>
                          {isChecked && <div className="w-2 h-2 bg-black rounded-sm" />}
                        </div>
                        <span className={`text-sm font-medium ${isChecked ? 'text-emerald-100' : 'text-zinc-400'}`}>{action}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}
