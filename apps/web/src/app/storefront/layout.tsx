import React from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Package, Truck, HardHat } from "lucide-react";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Top Banner */}
      <div className="bg-purple-500 text-black text-xs font-medium text-center py-2">
        Launch Offer: Free site delivery on all cement & steel orders above ₹50,000.
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-lg">C</div>
            <span className="font-semibold text-xl tracking-tight hidden sm:block">Maal-Material</span>
          </Link>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for cement, steel, machinery, or suppliers..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <User size={18} />
              Sign In
            </Link>
            <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button className="md:hidden text-zinc-400 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-8 overflow-x-auto no-scrollbar text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"><Package size={14} /> Building Materials</Link>
          <Link href="/suppliers" className="hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"><HardHat size={14} /> Verified Suppliers</Link>
          <Link href="/equipment" className="hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"><Truck size={14} /> Equipment Rentals</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold rounded text-xs">C</div>
              <span className="font-semibold tracking-tight">Maal-Material</span>
            </div>
            <p className="text-sm text-zinc-500">The operating system for the industrial & construction economy.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-white">Marketplace</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/" className="hover:text-purple-400">Materials</Link></li>
              <li><Link href="/suppliers" className="hover:text-purple-400">Find Suppliers</Link></li>
              <li><Link href="/equipment" className="hover:text-purple-400">Rent Machinery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-white">For Business</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/login" className="hover:text-purple-400">Contractor Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-purple-400">Seller Hub</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
