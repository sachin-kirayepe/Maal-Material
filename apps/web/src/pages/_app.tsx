import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useAuthStore } from "../stores/authStore";
import { HardHat, LogOut, Search, Activity, Package, Wallet } from "lucide-react";
import "../styles/globals.css";

// A lightweight wrapper to bring the 59 Pages Router screens into the ecosystem
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuthStore();

  useEffect(() => {
    // Basic auth check
    if (!isLoading && !isAuthenticated && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // If loading or not authenticated (and not on login page), don't render content
  if (isLoading || (!isAuthenticated && router.pathname !== "/login")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="w-10 h-10 border-4 border-t-amber-500 border-slate-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
          Validating Security Matrix...
        </p>
      </div>
    );
  }

  // Render without layout if on a public/login page
  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Simplified Legacy Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-sidebar-background text-sidebar-foreground flex-shrink-0 z-20 shadow-2xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-black font-bold shadow-md shadow-primary/20">
            <HardHat className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-bold tracking-widest text-white uppercase">
            Construct<span className="text-primary">OS</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4">
            LEGACY ADMIN MODULES
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 text-muted-foreground hover:bg-white/5 hover:text-white"
          >
            <Activity className="w-4 h-4 text-primary" /> Back to Terminal
          </button>

          <button
            onClick={() => router.push("/admin/accounting-dashboard")}
            className={`flex w-full items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${router.pathname.includes("/accounting") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"}`}
          >
            <Wallet className="w-4 h-4" /> Accounting
          </button>

          <button
            onClick={() => router.push("/admin/inventory-intelligence")}
            className={`flex w-full items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${router.pathname.includes("/inventory") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"}`}
          >
            <Package className="w-4 h-4" /> Inventory Intel
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/20 mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate uppercase">
                {user?.role?.name || "Legacy Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 py-2 h-9 px-3 rounded-lg text-xs"
          >
            <LogOut className="w-4 h-4" />
            De-authorize Terminal
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 z-30 relative">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Legacy Modules..."
                className="bg-transparent border-none text-xs text-white placeholder-muted-foreground focus:outline-none w-full font-mono"
              />
            </div>
          </div>
          <div className="text-xs font-bold tracking-widest text-amber-500 uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
            Legacy Pages Router
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative industrial-glow">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
