"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ className, onSearch, onChange, ...props }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all duration-200 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}
