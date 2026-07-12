"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "./avatar";
import { signOut } from "next-auth/react";
import { LogOut, User, Settings } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    fullName?: string | null;
    name?: string | null;
    email: string;
    image?: string | null;
    role?: string | null;
  };
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user.fullName ?? user.name ?? "User";
  const displayRole = user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Student";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none cursor-pointer flex items-center transition-transform hover:scale-105 active:scale-95"
      >
        <Avatar name={displayName} src={user.image ?? undefined} size="sm" isOnline />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-card-border bg-card-bg/95 backdrop-blur-md shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-foreground">
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-card-border/80 flex items-center gap-3">
            <Avatar name={displayName} src={user.image ?? undefined} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate mb-1">{user.email}</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {displayRole}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-1.5 py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-zinc-400" />
              My Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              Settings
            </Link>
          </div>

          <div className="px-1.5 border-t border-card-border/80 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-accent hover:bg-brand-accent/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
