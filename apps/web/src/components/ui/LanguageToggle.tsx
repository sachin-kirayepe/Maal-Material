"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@constructos/ui";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 px-0">
        <Languages className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle Language</span>
      </Button>
    );
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-full px-3"
    >
      <Languages className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
      <span className="font-medium text-sm">{i18n.language === "hi" ? "हिन्दी" : "EN"}</span>
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
}
