"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl", className)} />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary", className)} />
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-light-base/80 dark:bg-bg-dark-base/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-10 w-10" />
        <span className="text-sm font-semibold tracking-wide text-zinc-505 animate-pulse">Loading CareerOS AI...</span>
      </div>
    </div>
  );
}
