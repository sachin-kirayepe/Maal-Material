"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";

const themes = [
  { name: "Default (Light)", value: "light" },
  { name: "Enterprise Dark", value: "dark" },
  { name: "Neo Brutalism", value: "theme-neo-brutalism" },
  { name: "Cyberpunk", value: "theme-cyberpunk" },
];

export function ThemeConfigurator() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors border border-slate-700"
        title="Theme Configurator"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-slate-800 bg-slate-950/50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Themes</h4>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  setIsOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  theme === t.value
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
