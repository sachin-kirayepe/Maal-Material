import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import { NetworkIndicator } from "../components/ui/NetworkIndicator";
import { GlobalErrorBoundary } from "../components/infrastructure/GlobalErrorBoundary";
import { AppI18nProvider } from "../components/I18nProvider";
import { RealtimeProvider } from "../components/providers/RealtimeProvider";
import { Toaster } from "sonner";
import "../styles/globals.css";

import { Inter, Noto_Sans_Devanagari } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "Maal-Material | Industrial Hardware Commerce & Enterprise ERP",
  description:
    "Production-grade hardware commerce, real-time inventory, B2B billing, logistics, and multi-tenant marketplace system for heavy contractors.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} min-h-screen antialiased bg-background text-foreground font-sans`}
      >
        <AppI18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalErrorBoundary>
              <RealtimeProvider>
                {children}
                <NetworkIndicator />
                <Toaster theme="system" richColors position="bottom-right" />
              </RealtimeProvider>
            </GlobalErrorBoundary>
          </ThemeProvider>
        </AppI18nProvider>
      </body>
    </html>
  );
}
