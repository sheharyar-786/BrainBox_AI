"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = "md", isOnline, className }: AvatarProps) {
  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.charAt(0).toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  const badgeSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3.5 w-3.5",
  };

  return (
    <div className={cn("relative inline-block select-none", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn("rounded-full object-cover border border-card-border bg-zinc-100 dark:bg-zinc-800", sizes[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-full border border-card-border flex items-center justify-center font-bold bg-gradient-to-br from-brand-primary/10 to-brand-secondary/20 text-brand-primary dark:text-purple-300 whitespace-nowrap select-none leading-none tracking-tighter",
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-brand-success ring-2 ring-white dark:ring-bg-dark-base",
            badgeSizes[size]
          )}
        />
      )}
    </div>
  );
}
