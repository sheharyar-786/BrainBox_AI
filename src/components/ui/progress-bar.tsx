"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className,
  color = "primary",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: "bg-brand-primary",
    secondary: "bg-brand-secondary",
    success: "bg-brand-success",
    warning: "bg-brand-warning",
    danger: "bg-brand-accent",
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-border-dark overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </div>
  );
}
