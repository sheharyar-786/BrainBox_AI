"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

interface NotificationListProps {
  isOpen: boolean;
  onClose: () => void;
  items: NotificationItem[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationList({
  isOpen,
  onClose,
  items,
  onMarkRead,
  onClearAll,
}: NotificationListProps) {
  const icons = {
    info: (
      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for click outside */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-80 sm:w-96 glass-effect bg-card-bg/95 border border-card-border shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden max-h-[80vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
              <span className="text-sm font-bold text-foreground">Notifications</span>
              {items.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-secondary cursor-pointer transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-card-border max-h-[400px]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <svg className="h-8 w-8 text-zinc-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-xs font-medium text-zinc-505">All caught up!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onMarkRead(item.id)}
                    className={cn(
                      "flex gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer",
                      !item.read && "bg-brand-primary/5 hover:bg-brand-primary/10"
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">{icons[item.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={cn("text-xs font-semibold truncate", !item.read ? "text-foreground" : "text-zinc-500")}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-zinc-400 flex-shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-zinc-550 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
