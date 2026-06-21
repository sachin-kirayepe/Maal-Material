"use client";

import React, { useEffect } from "react";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { Card, Button } from "@constructos/ui";
import { Box, Plus, Settings, ChevronRight, Hash } from "lucide-react";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories } = useEcommerceStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 tracking-tight">
            Category Taxonomy
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Organize the marketplace product catalog
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-500/25 border-0 rounded-xl transition-all hover:scale-105 px-6">
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No categories defined yet.</div>
        ) : (
          categories.map((category) => (
            <Card
              key={category.id}
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-2xl overflow-hidden hover:border-purple-500/30 transition-colors group"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-wide text-lg flex items-center gap-2">
                      {category.name}
                      {category.isActive && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                            category.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <Hash className="w-3 h-3" />{" "}
                      {category.slug || category.name.toLowerCase().replace(/ /g, "-")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-purple-400 rounded-lg hover:bg-slate-800 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  {category.subCategories?.length > 0 && (
                    <div className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {category.subCategories.length} sub-categories
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
