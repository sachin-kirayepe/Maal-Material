import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../lib/i18n/i18n"; // Ensure i18n is initialized
import { AppI18nProvider } from "../components/I18nProvider";
import { useSmbStore } from "../stores/smbStore";
import { Card, Button } from "@constructos/ui";
import {
  Calculator as CalcIcon,
  Box as BoxIcon,
  Users as UsersIcon,
  Mic as MicIcon,
  Settings as SettingsIcon,
} from "lucide-react";
const Calculator = CalcIcon as any;
const Box = BoxIcon as any;
const Users = UsersIcon as any;
const Mic = MicIcon as any;
const Settings = SettingsIcon as any;
import { useAuthStore } from "../stores/authStore";
import { LanguageToggle } from "../components/ui/LanguageToggle";

export default function SMBDashboard() {
  const { t } = useTranslation();
  const { executeQuickBill } = useSmbStore();
  const { user } = useAuthStore();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    welcome: t("dashboard.welcome", { name: user?.firstName || "User" }),
    quickBill: t("dashboard.quickBill"),
    inventory: t("dashboard.inventory"),
    udhari: t("dashboard.udhari"),
    amountLabel: t("dashboard.amountLabel"),
    submitBtn: t("dashboard.submitBtn"),
  };

  const handleQuickBill = async () => {
    if (!amount) return;
    setIsLoading(true);
    try {
      await executeQuickBill({
        tenantId: (user as any)?.tenantId || "demo-tenant",
        shopId: "demo-shop",
        amountPaid: parseInt(amount),
        paymentMode: "CASH",
        items: [{ productId: "unclassified-quick-bill", quantity: 1, unitPrice: parseInt(amount) }],
      });
      alert(t("dashboard.success"));
      setAmount("");
    } catch (e) {
      alert(t("dashboard.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppI18nProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col max-w-md mx-auto sm:border-x sm:border-slate-200 dark:sm:border-slate-800 transition-colors duration-300 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-500/20 via-cyan-500/10 to-transparent blur-3xl -z-10" />

        {/* Premium Header */}
        <header className="relative bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-500 text-white p-8 rounded-b-[2.5rem] shadow-2xl shadow-indigo-500/20 z-10 overflow-hidden">
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

          <div className="relative flex justify-between items-center mb-8">
            <div>
              <p className="text-indigo-100 text-sm font-medium tracking-wide uppercase mb-1">
                Maal-Material Enterprise
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{labels.welcome}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                <LanguageToggle />
              </div>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full p-2 transition-transform hover:rotate-90 duration-300"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Fast Action Primary Card */}
          <div className="relative mt-2 hover:-translate-y-1 transition-transform duration-300 ease-out z-20 px-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-xl">
                  <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                {labels.quickBill}
              </h2>
              <div className="flex gap-2 group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium text-xl">₹</span>
                </div>
                <input
                  type="number"
                  placeholder={labels.amountLabel}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl py-4 pl-10 pr-4 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow font-medium"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg py-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 font-semibold"
                  onClick={handleQuickBill}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Processing...
                    </span>
                  ) : (
                    labels.submitBtn
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="py-6 px-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-colors group"
                >
                  <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </header>

        {/* Grid Menu (Large Touch Targets) */}
        <main className="flex-1 px-6 pt-10 pb-8">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wider uppercase mb-4 px-2">
            Operations
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-500/20 dark:to-blue-500/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Box className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {labels.inventory}
              </span>
            </button>

            <button className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-500/20 dark:to-amber-500/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {labels.udhari}
              </span>
            </button>
          </div>
        </main>
      </div>
    </AppI18nProvider>
  );
}
