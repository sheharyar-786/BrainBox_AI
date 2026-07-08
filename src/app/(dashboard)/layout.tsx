"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/ui/search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { NotificationList, type NotificationItem } from "@/components/ui/notification";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "New AI Summary Available",
      description: "Prisma database normalization notes processing has completed successfully.",
      time: "2 mins ago",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "Weak Area Detected",
      description: "Mock Interview analyzer detected weak responses under 'Database Normalization'.",
      time: "1 hour ago",
      type: "warning",
      read: false,
    },
    {
      id: "3",
      title: "Upcoming Project Review",
      description: "Submit your React portfolio ZIP code repository for architecture assessment.",
      time: "1 day ago",
      type: "info",
      read: true,
    },
  ]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-card-border bg-card-bg/60 backdrop-blur-md flex items-center justify-between px-6 z-20 flex-shrink-0">
          <div className="flex-1 max-w-md hidden sm:block">
            <SearchBar placeholder="Search notes, roadmaps, code quality reports..." />
          </div>
          <div className="sm:hidden font-bold tracking-tight text-sm">
            CareerOS <span className="text-brand-primary">AI</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl border border-card-border glass-effect hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-650 dark:text-zinc-300 transition-colors cursor-pointer w-9 h-9 flex items-center justify-center"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-accent text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-bg-dark-base animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationList
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                items={notifications}
                onMarkRead={handleMarkRead}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Profile Avatar */}
            <Avatar name="John Doe" isOnline size="sm" />
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-bg-dark-base/40 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
