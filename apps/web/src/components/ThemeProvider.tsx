"use strict";
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const AnyNextThemesProvider = NextThemesProvider as any;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <AnyNextThemesProvider {...props}>{children}</AnyNextThemesProvider>;
}
