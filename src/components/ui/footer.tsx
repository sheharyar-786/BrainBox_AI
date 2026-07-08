"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-card-border bg-bg-light-base dark:bg-bg-dark-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-lg shadow-lg">
              C
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              CareerOS <span className="text-brand-primary">AI</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-550 leading-relaxed max-w-xs">
            The ultimate AI companion designed for university students, graduates, and job seekers to learn, practice, and land their dream career.
          </p>
        </div>

        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Features</span>
          <Link href="/features" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">AI Learning Library</Link>
          <Link href="/features" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">Mock Technical Interviews</Link>
          <Link href="/features" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">ATS Resume Analyzer</Link>
          <Link href="/features" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">Architecture & Code Quality</Link>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resources</span>
          <Link href="/about" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">About Our Platform</Link>
          <Link href="/pricing" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">Pricing & Plans</Link>
          <Link href="/contact" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">Contact Support</Link>
          <Link href="/login" className="text-xs text-zinc-550 hover:text-brand-primary transition-colors">SaaS Log In</Link>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Legal</span>
          <span className="text-xs text-zinc-550">Privacy Policy</span>
          <span className="text-xs text-zinc-550">Terms of Service</span>
          <span className="text-xs text-zinc-550">Security Compliance</span>
          <span className="text-xs text-zinc-550">University Partnership</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-zinc-400">
          &copy; {new Date().getFullYear()} CareerOS AI. All rights reserved.
        </p>
        <p className="text-[11px] text-zinc-400">
          Designed and engineered for Advanced Agentic Coding.
        </p>
      </div>
    </footer>
  );
}
