"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-1 rounded-lg hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
      title="Toggle Language"
    >
      {i18n.language === "hi" ? "EN" : "HI"}
    </button>
  );
}
