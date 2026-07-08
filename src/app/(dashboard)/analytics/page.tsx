"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function AnalyticsPage() {
  const stats = [
    { label: "Study Time", value: "32.4 hrs", desc: "+4.2 hrs from last week" },
    { label: "Quizzes Completed", value: "14 Quizzes", desc: "Average Accuracy: 88%" },
    { label: "Mock Interviews", value: "6 Mock Sessions", desc: "Grade Average: B+" },
    { label: "Resume Uploads", value: "4 Scans", desc: "Score: 76% -> 88%" },
  ];

  const topics = [
    { name: "Database Normalization", score: 85 },
    { name: "React Components & Hooks", score: 92 },
    { name: "Operating Systems", score: 72 },
    { name: "Data Structures & Algorithms", score: 78 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Learning Analytics</h1>
        <p className="text-xs text-zinc-555">Track study metrics, interview scores, and knowledge accuracy indicators.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-black text-brand-primary">{s.value}</span>
            <span className="text-[10px] text-zinc-400 mt-1">{s.desc}</span>
          </Card>
        ))}
      </div>

      {/* Accuracy checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Accuracy by Topic</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 mt-2">
            {topics.map((t) => (
              <div key={t.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>{t.name}</span>
                  <span className="text-brand-secondary">{t.score}%</span>
                </div>
                <ProgressBar value={t.score} color="secondary" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily chart mock */}
        <Card className="flex flex-col gap-4">
          <CardHeader className="mb-0">
            <CardTitle className="text-sm font-bold">Session Distribution (Hrs)</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-between gap-4 px-2 mt-4">
            {[
              { label: "W1", val: 8 },
              { label: "W2", val: 12 },
              { label: "W3", val: 15 },
              { label: "W4", val: 10 },
            ].map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative bg-zinc-100 dark:bg-zinc-800 rounded-lg h-44 overflow-hidden flex items-end">
                  <div
                    style={{ height: `${(item.val / 20) * 100}%` }}
                    className="w-full bg-gradient-to-t from-brand-secondary to-brand-accent rounded-lg"
                  />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}h
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
