"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 text-sm rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all duration-200 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            error && "border-brand-accent/50 focus:border-brand-accent/50 focus:ring-brand-accent/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-brand-accent font-medium">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-xs text-zinc-400">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
