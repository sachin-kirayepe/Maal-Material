"use client";

import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n/i18n";

export function AppI18nProvider({ children }: { children: React.ReactNode }) {
  // To handle hydration matching and font updates
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng;
      if (lng === "hi") {
        document.documentElement.classList.add("font-devanagari");
      } else {
        document.documentElement.classList.remove("font-devanagari");
      }
    };

    // Initial load
    handleLanguageChange(i18n.language || "en");

    // Listen for changes
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
