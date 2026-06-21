"use client";

import React, { useEffect } from "react";
import {
  AlertOctagon as AlertOctagonIcon,
  RefreshCw as RefreshCwIcon,
  Home as HomeIcon,
} from "lucide-react";
const AlertOctagon = AlertOctagonIcon as any;
const RefreshCw = RefreshCwIcon as any;
const Home = HomeIcon as any;
import { Button } from "@constructos/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Standard system logging
    console.error("Maal-Material system error occurred:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-500 mb-6 animate-bounce">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        System Kernel Panic
      </h1>
      <p className="mt-4 text-base text-slate-400 max-w-md">
        An isolated failure occurred within the application thread. The exception has been safely
        caught by the core error boundary.
      </p>
      <div className="mt-2 text-xs font-mono text-slate-500 max-w-lg truncate bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        {error.message || "Unknown Runtime Error"}
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <Button variant="primary" onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry Subsystem
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Hub
        </Button>
      </div>
    </div>
  );
}
