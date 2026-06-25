"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LinkImport from "next/link";
import {
  LayoutDashboard as LayoutDashboardIcon,
  Package as PackageIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Truck as TruckIcon,

  LogOut as LogOutIcon,
  HardHat as HardHatIcon,
  Menu as MenuIcon,
  X as XIcon,
  Search as SearchIcon,
  User as UserIconImport,
  Users as UsersIconImport,
  Wallet as WalletIcon,
  Database as DatabaseIcon,
  Zap as ZapIcon,
  Activity as ActivityIcon,
  MapPin as MapPinIcon,
  BarChart3 as BarChart3Icon,
  ShieldCheck as ShieldCheckIcon,
  Cpu as CpuIcon,
  BadgeDollarSign as BadgeDollarSignIcon,
  Calculator as CalculatorIcon,
  ArrowRightLeft as ArrowRightLeftIcon,
  Network as NetworkIcon,
  Factory as FactoryIcon,
  Globe2 as Globe2Icon,
  Pickaxe as PickaxeIcon,
  Box as BoxIcon,
  Compass as CompassIcon,
  Orbit as OrbitIcon,
  TerminalSquare as TerminalSquareIcon,
  Crown as CrownIcon,
} from "lucide-react";

const Link = LinkImport as any;
const LayoutDashboard = LayoutDashboardIcon as any;
const Package = PackageIcon as any;
const Receipt = ReceiptIcon as any;
const ShoppingCart = ShoppingCartIcon as any;
const Truck = TruckIcon as any;

const LogOut = LogOutIcon as any;
const HardHat = HardHatIcon as any;
const Menu = MenuIcon as any;
const X = XIcon as any;
const Search = SearchIcon as any;
const UserIcon = UserIconImport as any;
const UsersIcon = UsersIconImport as any;
const Wallet = WalletIcon as any;
const Database = DatabaseIcon as any;
const Zap = ZapIcon as any;
const Activity = ActivityIcon as any;
const MapPin = MapPinIcon as any;
const BarChart3 = BarChart3Icon as any;
const ShieldCheck = ShieldCheckIcon as any;
const Cpu = CpuIcon as any;
const BadgeDollarSign = BadgeDollarSignIcon as any;
const Calculator = CalculatorIcon as any;
const ArrowRightLeft = ArrowRightLeftIcon as any;
const Network = NetworkIcon as any;
const Factory = FactoryIcon as any;
const Globe2 = Globe2Icon as any;
const Pickaxe = PickaxeIcon as any;
const Box = BoxIcon as any;
const Compass = CompassIcon as any;
const Orbit = OrbitIcon as any;
const TerminalSquare = TerminalSquareIcon as any;
const Crown = CrownIcon as any;


import { LanguageToggle } from "../../components/LanguageToggle";
import { ThemeConfigurator } from "../../components/ThemeConfigurator";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "@constructos/ui";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { AICopilotOverlay } from "@/components/ai/AICopilotOverlay";
import { useAICopilotStore } from "@/store/ai-copilot-state";
import { GlobalTelemetryHUD } from "@/components/infrastructure/GlobalTelemetryHUD";
import { SelfHealingOverlay } from "@/components/ascension/SelfHealingOverlay";

// Realtime Collaboration
import { useMultiplayerEngine } from "@/hooks/useMultiplayerEngine";
import { LivePresenceBar } from "@/components/collaboration/LivePresenceBar";
import { OperationalActivityFeed } from "@/components/collaboration/OperationalActivityFeed";
import { MultiplayerCursorOverlay } from "@/components/collaboration/MultiplayerCursorOverlay";

import { useTranslation } from "react-i18next";

const navigationItems = [
  // 1. Dashboard & Core Tools (Universal)
  { name: "Dashboard", href: "/", icon: TerminalSquare, permission: "users:read" },
  { name: "My Shop Overview", href: "/smb-dashboard", icon: Zap, permission: "shops:read" },
  { name: "Buy Materials", href: "/marketplace", icon: ShoppingCart, permission: "marketplace:buy" },
  { name: "Manage Listings", href: "/marketplace/listings", icon: Zap, permission: "marketplace:manage" },

  // 2. Orders & Inventory (Shop Owner / Supplier)
  { name: "Order Management", href: "/orders", icon: ShoppingCart, permission: "orders:read" },
  { name: "Stock & Inventory", href: "/inventory", icon: Package, permission: "inventory:read" },
  { name: "Online Store", href: "/products", icon: ShoppingCart, permission: "products:read", isGroup: true },
  { name: "Catalog", href: "/products", icon: Package, permission: "products:read", isChild: true },
  { name: "Categories", href: "/categories", icon: Box, permission: "products:read", isChild: true },
  { name: "Cart", href: "/cart", icon: ShoppingCart, permission: "marketplace:buy", isChild: true },

  // 3. Procurement & Sourcing (Buyer / Contractor)
  { name: "Find Suppliers", href: "/sourcing", icon: Factory, permission: "sourcing:read" },
  { name: "My Vendors", href: "/vendors", icon: Globe2, permission: "vendors:read" },
  { name: "Purchase Orders", href: "/procurement", icon: ShieldCheck, permission: "procurement:read" },
  { name: "Supply Chain Insights", href: "/supply-chain", icon: Network, permission: "supplychain:read" },

  // 4. Contractor Tools (Contractor)
  { name: "Active Projects", href: "/construction", icon: HardHat, permission: "users:read" },
  { name: "Field Operations", href: "/admin/field-operations-center", icon: Pickaxe, permission: "fieldops:read" },
  { name: "Site Plans (3D)", href: "/digital-twin", icon: Box, permission: "users:read" },
  { name: "Contractor Tools", href: "/projects", icon: HardHat, permission: "projects:read", isGroup: true },
  { name: "My Projects", href: "/projects", icon: LayoutDashboard, permission: "projects:read", isChild: true },
  { name: "Work Sites", href: "/projects/sites", icon: MapPin, permission: "sites:read", isChild: true },
  { name: "Staff & Workers", href: "/projects/workers", icon: UsersIcon, permission: "workers:read", isChild: true },
  { name: "Attendance Tracking", href: "/projects/attendance", icon: Activity, permission: "attendance:manage", isChild: true },
  { name: "Material Costs", href: "/projects/materials", icon: Package, permission: "materials:manage", isChild: true },
  { name: "Project Expenses", href: "/projects/costing", icon: Wallet, permission: "costing:read", isChild: true },

  // 5. Transport & Delivery (Logistics)
  { name: "Transport & Delivery", href: "/logistics", icon: Truck, permission: "logistics:track", isGroup: true },
  { name: "My Deliveries", href: "/logistics/deliveries", icon: Package, permission: "delivery:manage", isChild: true },
  { name: "Dispatch Materials", href: "/logistics/dispatch", icon: Activity, permission: "dispatch:manage", isChild: true },
  { name: "Vehicles", href: "/logistics/fleet", icon: Truck, permission: "fleet:manage", isChild: true },
  { name: "Drivers", href: "/logistics/drivers", icon: UsersIcon, permission: "drivers:manage", isChild: true },
  { name: "Delivery Areas", href: "/logistics/shipping", icon: MapPin, permission: "shipping:manage", isChild: true },
  { name: "Delivery Reports", href: "/logistics/reports", icon: BarChart3, permission: "logistics:track", isChild: true },

  // 6. Finance & Billing (Finance / Shop Owner)
  { name: "Invoices & Billing", href: "/billing", icon: Receipt, permission: "billing:read" },
  { name: "Finance", href: "/finance", icon: BadgeDollarSign, permission: "finance:read" },
  { name: "Bank & Payments", href: "/treasury", icon: Wallet, permission: "treasury:read" },
  { name: "Tax Reports", href: "/tax", icon: Calculator, permission: "tax:read" },
  { name: "Payment Sync", href: "/reconciliation", icon: ArrowRightLeft, permission: "reconciliation:read" },
  { name: "Ledger & Accounts", href: "/ledger", icon: Wallet, permission: "ledger:read" },

  // 7. Administration (Admin)
  { name: "Reports & Analytics", href: "/predictive-intelligence", icon: Compass, permission: "users:read" },
  { name: "Global Locations", href: "/civilization-command", icon: Globe2, permission: "users:read" },
  { name: "Growth Goals", href: "/ascension", icon: Orbit, permission: "users:read" },
  { name: "Business Network", href: "/tenants", icon: Database, permission: "tenants:manage" },
  { name: "Shop Directory", href: "/shops", icon: Package, permission: "shops:read" },
  { name: "Activity Logs", href: "/activity", icon: ShieldCheck, permission: "users:read" },
  { name: "System Tasks", href: "/jobs", icon: Cpu, permission: "users:read" },
  { name: "Settings & Admin", href: "/users", icon: ShieldCheck, permission: "users:read", isGroup: true },
  { name: "Manage Users", href: "/users", icon: UsersIcon, permission: "users:read", isChild: true },
  { name: "Permissions", href: "/roles", icon: ShieldCheck, permission: "users:manage", isChild: true },
  { name: "Support & Disputes", href: "/disputes", icon: Activity, permission: "users:read" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { t, i18n } = useTranslation("common");

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  const { user, isAuthenticated, isLoading, logout, hasPermission } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleCopilot = useAICopilotStore((state) => state.toggleCopilot);

  // Initialize Multiplayer Engine
  useMultiplayerEngine();

  // Authentication gateguard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="w-10 h-10 border-4 border-t-amber-500 border-slate-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
          Validating Security Matrix...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const visibleNavItems = navigationItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* 1. Desktop Sidebar Shell */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-sidebar-background text-sidebar-foreground flex-shrink-0 z-20 shadow-2xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-black font-bold shadow-md shadow-primary/20">
            <HardHat className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-bold tracking-widest text-white uppercase">
            Construct<span className="text-primary">OS</span>
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4">
            MAIN NAVIGATION
          </div>
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            // Derive translation key: lowercase and replace spaces/ampersands
            const cleanName = item.name
              .toLowerCase()
              .replace(/ & /g, "_")
              .replace(/ /g, "_")
              .replace(/-/g, "_");
            // Check if there is a translation in nav, else fallback to item.name
            const translatedName = t(`nav.${cleanName}`, item.name);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  item.isChild ? "ml-6 px-3 text-xs" : "px-3"
                } ${
                  isActive
                    ? "bg-primary/10 border border-primary/20 text-primary font-bold shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"}`}
                />
                {translatedName}
              </Link>
            );
          })}
        </nav>

        {/* User Card Info and Quick Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/20 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate uppercase">
                {user?.role?.name}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => router.push("/upgrade")}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 py-2 h-9 px-3 rounded-lg text-xs font-bold mb-2 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            <Crown className="w-4 h-4" />
            Upgrade Plan
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 py-2 h-9 px-3 rounded-lg text-xs"
          >
            <LogOut className="w-4 h-4" />
            De-authorize Terminal
          </Button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 z-30 relative">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl w-80 focus-within:border-primary/50 transition-colors">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("header.search_placeholder", "Query Civilization Network...")}
                className="bg-transparent border-none text-xs text-white placeholder-muted-foreground focus:outline-none w-full font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg hover:bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground transition-colors uppercase tracking-widest"
              title="Toggle Language"
            >
              {i18n.language === "hi" ? "EN" : "HI"}
            </button>

            {/* Theme Toggle */}
            <ThemeConfigurator />

            {/* Global Multiplayer Presence */}
            <LivePresenceBar />

            {/* Planetary Telemetry HUD */}
            <GlobalTelemetryHUD />

            {/* Notifications */}
            <NotificationBell />

            {/* Omni-Copilot Trigger */}
            <button
              onClick={toggleCopilot}
              className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all flex items-center gap-2 group"
              title="Activate Enterprise Omni-Copilot"
            >
              <Cpu className="w-4 h-4 group-hover:animate-pulse" />
              <span className="hidden md:inline-block text-[10px] font-bold tracking-widest uppercase">
                Copilot
              </span>
            </button>

            <div className="h-6 w-px bg-white/10"></div>

            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline-block text-xs font-mono tracking-widest text-white">
                {user?.firstName?.toUpperCase()}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30">
                {user?.firstName?.substring(0, 1)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Mobile Sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 flex z-40 bg-slate-950/60 backdrop-blur-sm">
            <div className="relative flex flex-col w-64 bg-slate-900 text-slate-100 flex-shrink-0 animate-in slide-in-from-left duration-250">
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-white uppercase">Maal-Material</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-850 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-800/50">
                <LanguageToggle />
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {visibleNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800/80">
                <Button
                  variant="default"
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    router.push("/upgrade");
                  }}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 py-2 h-9 px-3 rounded-lg text-xs font-bold mb-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Plan
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-start gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 py-2 h-9 px-3 rounded-lg text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  De-authorize Terminal
                </Button>
              </div>
            </div>
            {/* Click to close panel */}
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}></div>
          </div>
        )}

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-8 relative industrial-glow">{children}</main>

        {/* Omni Copilot Global Overlay */}
        <AICopilotOverlay />

        {/* Global Multiplayer UI */}
        <OperationalActivityFeed />
        <MultiplayerCursorOverlay />

        {/* Self-Healing Evolution Overlay */}
        <SelfHealingOverlay />
      </div>
    </div>
  );
}
