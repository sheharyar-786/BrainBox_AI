"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl border border-card-border glass-effect hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-650 dark:text-zinc-300 transition-colors cursor-pointer w-9 h-9 flex items-center justify-center overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0, scale: theme === "dark" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute h-5 w-5 flex items-center justify-center"
      >
        {/* Sun Icon */}
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : -180, scale: theme === "dark" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute h-5 w-5 flex items-center justify-center"
      >
        {/* Moon Icon */}
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </motion.div>
    </button>
  );
}
