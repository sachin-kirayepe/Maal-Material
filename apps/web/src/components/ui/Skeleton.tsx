"use client";

import React from "react";

/**
 * SkeletonCard — Animated skeleton placeholder for card-based layouts.
 * Replaces all "Loading..." text with a professional shimmer animation.
 */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse ${className}`}>
      <div className="h-3 w-24 bg-zinc-800 rounded mb-4" />
      <div className="h-8 w-32 bg-zinc-800 rounded mb-3" />
      <div className="h-3 w-40 bg-zinc-800 rounded" />
    </div>
  );
}

/**
 * SkeletonTable — Animated skeleton placeholder for table-based layouts.
 */
export function SkeletonTable({ rows = 5, cols = 4, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex gap-4 px-6 py-4 border-b border-zinc-800">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-zinc-800 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 px-6 py-4 border-b border-zinc-800/50">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-zinc-800/60 rounded flex-1"
              style={{ maxWidth: colIdx === 0 ? "200px" : "120px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonStats — Animated skeleton placeholder for stat card grids.
 */
export function SkeletonStats({ count = 4, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
