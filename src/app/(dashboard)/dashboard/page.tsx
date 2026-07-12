"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [streak, setStreak] = useState(14);
  const [tasks, setTasks] = useState([
    { id: "1", text: "Revise React Hooks flashcards", done: false },
    { id: "2", text: "Upload Database Normalization assignments", done: true },
    { id: "3", text: "Conduct Frontend mock interview simulation", done: false },
    { id: "4", text: "Submit final project portfolio ZIP for review", done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const incrementStreak = () => {
    setStreak(streak + 1);
  };

  const chartData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.1 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 2.9 },
    { day: "Sat", hours: 1.2 },
    { day: "Sun", hours: 0.8 },
  ];

  const displayName = session?.user?.name ? session.user.name.split(/\s+/)[0] : "Student";

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {displayName}!</h1>
          <p className="text-xs text-zinc-500">Here&apos;s your career preparation overview for today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" onClick={incrementStreak} className="cursor-pointer">
            🔥 Log Daily Study (+1 Streak)
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Study Streak</span>
          <span className="text-3xl font-black text-foreground">🔥 {streak} Days</span>
          <span className="text-[10px] text-zinc-400">Keep it up! Active since Jun 24.</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interview Readiness</span>
          <span className="text-3xl font-black text-foreground">📈 84%</span>
          <ProgressBar value={84} className="mt-1" color="primary" />
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Library Files</span>
          <span className="text-3xl font-black text-foreground">📁 32 Files</span>
          <span className="text-[10px] text-zinc-400">4 folders, 12 categories mapped.</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Study Hours</span>
          <span className="text-3xl font-black text-foreground">⏰ 16.5 Hrs</span>
          <span className="text-[10px] text-zinc-400">Average: 2.3 hours per day.</span>
        </Card>
      </div>

      {/* Chart and Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Mock Layout */}
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <CardHeader className="mb-0">
            <CardTitle className="text-sm font-bold">Weekly Study Hours</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-between gap-2 px-2 mt-4">
            {chartData.map((data) => {
              const heightPercentage = (data.hours / 5) * 100;
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                  <div className="w-full relative bg-zinc-100 dark:bg-zinc-800 rounded-lg h-44 overflow-hidden flex items-end">
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-lg transition-all duration-500 group-hover:opacity-80"
                    />
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.hours}h
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">{data.day}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Task Checklist */}
        <Card className="flex flex-col gap-4">
          <CardHeader className="mb-2">
            <CardTitle className="text-sm font-bold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-3 rounded-xl border border-card-border hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <span className={`h-4.5 w-4.5 border rounded-md flex items-center justify-center flex-shrink-0 ${task.done ? "bg-brand-success border-brand-success text-white" : "border-card-border"}`}>
                  {task.done && (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${task.done ? "line-through text-zinc-450" : "text-foreground"}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">Recent Uploads & Activity</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border text-[10px] font-bold text-zinc-400 uppercase">
                <th className="pb-3">Name</th>
                <th className="pb-3">Tags</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-xs">
              <tr>
                <td className="py-4 font-semibold">Prisma_Models_Documentation.pdf</td>
                <td className="py-4">
                  <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px]">Database</span>
                </td>
                <td className="py-4 text-zinc-400">1.2 MB</td>
                <td className="py-4">
                  <span className="text-brand-success font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-success" /> Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">React_Advanced_Hooks_Lecture.docx</td>
                <td className="py-4">
                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-[10px]">Frontend</span>
                </td>
                <td className="py-4 text-zinc-400">324 KB</td>
                <td className="py-4">
                  <span className="text-brand-success font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-success" /> Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Technical_Resume_JohnDoe.pdf</td>
                <td className="py-4">
                  <span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-[10px]">Career</span>
                </td>
                <td className="py-4 text-zinc-400">842 KB</td>
                <td className="py-4">
                  <span className="text-brand-success font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-success" /> Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
