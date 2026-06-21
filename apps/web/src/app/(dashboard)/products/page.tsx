"use client";

import React, { useEffect, useState } from "react";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { Card, Button } from "@constructos/ui";
import { Package, Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

export default function ProductsPage() {
  const { products, isLoading, fetchProducts } = useEcommerceStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product Details",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden">
            {row.original.images?.[0] ? (
              <img
                src={row.original.images[0]}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div>
            <p className="text-slate-200 font-semibold">{row.original.name}</p>
            <div className="text-xs text-slate-500 mt-0.5">SKU: {row.original.sku || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium text-slate-300">
          ${row.original.price?.toLocaleString() || "0.00"}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <span
          className={`font-mono px-2 py-1 rounded-md border text-sm ${row.original.stock > 10 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}
        >
          {row.original.stock || 0} in stock
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={
            row.original.isActive
              ? "px-2 py-1 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "px-2 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-400 border border-slate-700"
          }
        >
          {row.original.isActive ? "Active" : "Draft"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
          <button className="p-2 text-slate-500 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Manage inventory, pricing, and availability
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl transition-all hover:scale-105 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-3xl overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading catalog...</div>
          ) : (
            <DataTable columns={columns} data={filteredProducts} />
          )}
        </div>
      </Card>
    </div>
  );
}
