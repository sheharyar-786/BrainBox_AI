"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Learning Library", href: "/library", icon: "📚" },
    { label: "AI Tutor", href: "/tutor", icon: "🤖" },
    { label: "Mock Interviews", href: "/interview", icon: "💬" },
    { label: "Resume Analyzer", href: "/resume", icon: "📝" },
    { label: "Project Analyzer", href: "/project", icon: "💻" },
    { label: "Career Roadmap", href: "/roadmap", icon: "🗺️" },
    { label: "Analytics", href: "/analytics", icon: "📈" },
    { label: "Profile", href: "/profile", icon: "👤" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-card-border glass-effect bg-card-bg/60 backdrop-blur-md flex flex-col transition-all duration-300 z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-card-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-sm shadow-md">
              C
            </span>
            <span className="text-md font-bold tracking-tight text-foreground">
              CareerOS <span className="text-brand-primary">AI</span>
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-sm shadow-md">
              C
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-zinc-400 hover:text-foreground hover:bg-zinc-150 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg className={cn("h-5 w-5 transform transition-transform duration-300", isCollapsed && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                isActive
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                  : "text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-foreground"
              )}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-card-border flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-primary/25 to-brand-secondary/25 border border-card-border flex items-center justify-center font-bold text-xs text-brand-primary">
          JD
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">John Doe</p>
            <p className="text-[10px] text-zinc-500 truncate">john.doe@university.edu</p>
          </div>
        )}
      </div>
    </aside>
  );
}
