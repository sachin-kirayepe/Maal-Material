"use client";

import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState — Premium empty state component for when no data is available.
 * Replaces all bare "No data found" strings with a styled, professional look.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There's nothing to display right now. Data will appear here once available.",
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-300 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-md leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
