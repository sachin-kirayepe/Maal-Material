"use client";

import React, { Component, ErrorInfo } from "react";
import {
  ShieldAlert as ShieldAlertIcon,
  RefreshCw as RefreshCwIcon,
  Cpu as CpuIcon,
  Activity as ActivityIcon,
} from "lucide-react";
const ShieldAlert = ShieldAlertIcon as any;
const RefreshCw = RefreshCwIcon as any;
const Cpu = CpuIcon as any;
const Activity = ActivityIcon as any;

interface Props {
  children?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isRecovering: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, isRecovering: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary Caught:", error, errorInfo);
    // In production, send to telemetry/Sentry here
    this.setState({ errorInfo });
  }

  private handleRecover = () => {
    this.setState({ isRecovering: true });

    // Attempt self-healing (clear potentially corrupted caches, flush state)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("constructos-corrupted-state");
      } catch (e) {
        // ignore
      }
    }

    // Force reload after simulating a healing delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/30">
                <ShieldAlert className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  System Fault Detected
                </h1>
                <p className="text-slate-400 mt-1">
                  The Maal-Material resilience engine intercepted a critical UI crash.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800 overflow-x-auto">
              <p className="text-sm font-mono text-rose-400 mb-2 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {this.state.error?.toString() || "Unknown Error"}
              </p>
              <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || "Stack trace not available."}
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Cpu className="w-4 h-4" />
                Awaiting manual override or self-healing sequence
              </div>

              <button
                onClick={this.handleRecover}
                disabled={this.state.isRecovering}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                {this.state.isRecovering ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Executing Self-Heal...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Trigger System Recovery
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
