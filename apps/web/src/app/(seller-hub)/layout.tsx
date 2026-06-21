import React from "react";
import Link from "next/link";
import { Store, TrendingUp, Package, FileText, Settings, Bell } from "lucide-react";

export default function SellerHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Store className="text-purple-500" size={24} />
            <span className="font-semibold text-xl tracking-tight">Seller Hub</span>
          </div>
          
          <nav className="space-y-1">
            <Link href="/leads" className="flex items-center gap-3 px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-medium">
              <TrendingUp size={18} />
              Active Leads
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
              <Package size={18} />
              My Orders
            </Link>
            <Link href="/invoices" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
              <FileText size={18} />
              Invoices & Payments
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
            <Settings size={18} />
            Store Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md">
          <div className="text-sm font-medium text-zinc-400">
            Maal-Material B2B Marketplace
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-sm font-medium text-purple-400">
              UB
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
