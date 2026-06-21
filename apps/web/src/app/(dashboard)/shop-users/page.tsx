"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Shield, Trash2, Mail, Edit3, Key } from "lucide-react";

import { useAdminStore } from "../../../stores/adminStore";

export default function ShopUsers() {
  const { users: staff, isLoading, fetchUsers } = useAdminStore();

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Users className="text-purple-500" size={28} /> Shop Staff Management
          </h1>
          <p className="text-zinc-400">Add employees and manage their access to your Maal-Material retailer panel.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-400 transition-colors">
          <UserPlus size={18} /> Invite Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Staff List */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-medium">Team Members</h2>
            <span className="text-sm text-zinc-500">3 of 5 allowed</span>
          </div>
          
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/50 text-zinc-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-zinc-500">Loading staff members...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800">No staff members found.</td></tr>
              ) : (
                staff.map((user: any, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  key={user.id || i} className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                        {(user.firstName || user.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.firstName ? `${user.firstName} ${user.lastName}` : user.name || "Unknown User"}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1"><Mail size={12}/> {user.email || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 bg-zinc-800 px-2 py-1 rounded text-xs">{user.systemRole || user.role || "Staff"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex w-fit items-center gap-1 text-xs px-2 py-1 rounded border ${user.isActive || user.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {user.isActive ? "Active" : user.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit3 size={16}/></button>
                      <button className="p-2 text-red-500/70 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </motion.tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Roles Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-6 text-lg flex items-center gap-2"><Shield size={18} className="text-purple-400"/> Role Permissions</h3>
            
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="font-medium text-white mb-1">Store Manager</p>
                <p className="text-xs text-zinc-400 mb-2">Full access to inventory, pricing, and orders.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Inventory</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Billing</span>
                </div>
              </div>
              
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="font-medium text-white mb-1">Sales Associate</p>
                <p className="text-xs text-zinc-400 mb-2">Can process new orders and answer chat inquiries.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Orders</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Chat</span>
                </div>
              </div>

              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="font-medium text-white mb-1">Delivery Driver</p>
                <p className="text-xs text-zinc-400 mb-2">Access to delivery addresses and route maps only.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Delivery App</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 py-3 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Key size={16}/> Create Custom Role
          </button>
        </div>

      </div>
    </div>
  );
}
