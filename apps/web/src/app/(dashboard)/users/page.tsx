"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { Card, Button } from "@constructos/ui";
import { Users, Plus, Search, ShieldCheck, Mail, Activity, MoreVertical } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

export default function UsersPage() {
  const { users, isLoading, fetchUsers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "firstName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            {row.original.firstName?.charAt(0) || <Users className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-slate-200 font-semibold">
              {row.original.firstName} {row.original.lastName}
            </p>
            <div className="flex items-center text-xs text-slate-500 mt-0.5">
              <Mail className="w-3 h-3 mr-1" /> {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldCheck className="w-3 h-3 mr-1" />
          {row.original.role?.name || "No Role"}
        </span>
      ),
    },
    {
      accessorKey: "tenantId",
      header: "Tenant ID",
      cell: ({ row }) => (
        <span className="font-mono bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
          {row.original.tenantId || "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="text-right">
          <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Manage civilization ecosystem operators</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/25 border-0 rounded-xl transition-all hover:scale-105 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-3xl overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2" /> Filter Activity
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading operators...</div>
          ) : (
            <DataTable columns={columns} data={filteredUsers} />
          )}
        </div>
      </Card>
    </div>
  );
}
