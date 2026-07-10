"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background radial spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-base shadow-md">
            C
          </span>
          <span className="text-base font-bold tracking-tight text-foreground font-display">
            CareerOS <span className="text-brand-primary">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[10px] text-zinc-500 border-t border-card-border/50 bg-white/10 dark:bg-bg-dark-surface/10 backdrop-blur-sm z-10">
        &copy; {new Date().getFullYear()} CareerOS AI. All rights reserved. Mapped for career excellence.
      </footer>
    </div>
  );
}
