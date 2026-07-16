"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function StudyStreakTracker() {
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("study_streak");
      return saved ? parseInt(saved, 10) : 14;
    }
    return 14;
  });
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedDate = localStorage.getItem("study_streak_date");
      return savedDate === new Date().toDateString();
    }
    return false;
  });


  const handleLogStudy = () => {
    if (hasLoggedToday) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    setHasLoggedToday(true);
    
    localStorage.setItem("study_streak", newStreak.toString());
    localStorage.setItem("study_streak_date", new Date().toDateString());
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tracker Banner Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-12">
        <div /> {/* spacing push */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant={hasLoggedToday ? "secondary" : "glass"}
            size="sm"
            onClick={handleLogStudy}
            disabled={hasLoggedToday}
            className="cursor-pointer font-bold"
          >
            {hasLoggedToday ? "🔥 Logged Today!" : "🔥 Log Daily Study (+1 Streak)"}
          </Button>
        </div>
      </div>

      {/* Streak Stats Card Wrapper (To be embedded) */}
      <div className="hidden">
        {/* Helper element to pass streak state to parent or reference layout */}
      </div>
    </div>
  );
}

// Separate component for rendering the stats block itself in the dashboard
export function StreakCard() {
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("study_streak");
      return saved ? parseInt(saved, 10) : 14;
    }
    return 14;
  });

  useEffect(() => {
    // Listen for storage changes to sync
    const handleStorageChange = () => {
      const updated = localStorage.getItem("study_streak");
      if (updated) {
        setStreak(parseInt(updated, 10));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider">Study Streak</span>
      <span className="text-3xl font-black text-foreground">🔥 {streak} Days</span>
      <span className="text-[10px] text-zinc-400">Keep it up! Active since Jun 24.</span>
    </div>
  );
}
