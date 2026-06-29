"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Check, Plus, Edit2, Users, Lock, Loader2 } from "lucide-react";
import { useRBACStore } from "@/stores/rbacStore";

export default function RBACEditor() {
  const { roles, permissions, isLoading, fetchRoles, fetchPermissions, assignPermission, removePermission } = useRBACStore();
  const [activeRoleName, setActiveRoleName] = useState<string>("");

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  useEffect(() => {
    if (roles.length > 0 && !activeRoleName) {
      setActiveRoleName(roles[0]?.name || "");
    }
  }, [roles, activeRoleName]);

  const activeRole = roles.find(r => r.name === activeRoleName);

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
    const moduleName = perm.action.split(':')[0] || "General";
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Shield className="text-purple-500" size={28} /> Access & Permissions
          </h1>
          <p className="text-zinc-400">Configure Role-Based Access Control (RBAC) across all company modules.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
          <Plus size={18} /> Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Roles Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Users size={18} className="text-zinc-400" /> User Roles
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-purple-500" size={24} />
                </div>
              ) : roles.map(role => (
                <li key={role.id}>
                  <button 
                    onClick={() => setActiveRoleName(role.name)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${activeRoleName === role.name ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'}`}
                  >
                    {role.name}
                    {role.name === "Super Admin" && <Lock size={14} className="text-zinc-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/50">
              <div>
                <h2 className="text-xl font-medium text-white">Editing: {activeRoleName || "Loading..."}</h2>
                <p className="text-sm text-zinc-500">Changes are autosaved to the database.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors text-white">
                <Edit2 size={16} /> Edit Role Details
              </button>
            </div>

            <div className="flex-1 p-6 space-y-8">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
              ) : Object.entries(groupedPermissions).map(([moduleName, modulePerms]: [string, any], i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={moduleName}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-medium text-lg uppercase">{moduleName}</h3>
                    <div className="h-px flex-1 bg-zinc-800"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(modulePerms as any).map((perm: any) => {
                      const isChecked = activeRole?.permissions?.some(p => p.action === perm.action) || false;
                      
                      return (
                        <div 
                          key={perm.id} 
                          onClick={() => {
                            if (activeRoleName) {
                              if (isChecked) {
                                removePermission(activeRoleName, perm.action);
                              } else {
                                assignPermission(activeRoleName, perm.action);
                              }
                            }
                          }}
                          className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${isChecked ? 'border-purple-500/50 bg-purple-500/5' : 'border-zinc-800 bg-black hover:border-zinc-700'}`}
                        >
                          <div className="flex flex-col">
                            <span className={isChecked ? 'text-white' : 'text-zinc-400'}>{perm.action}</span>
                            <span className="text-xs text-zinc-500">{perm.description}</span>
                          </div>
                          <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-transparent'}`}>
                            <Check size={14} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
