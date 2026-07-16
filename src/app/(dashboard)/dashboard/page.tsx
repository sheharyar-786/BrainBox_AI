import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyStreakTracker, StreakCard } from "@/components/dashboard/StudyStreakTracker";
import { TaskList } from "@/components/dashboard/TaskList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch real database records count for dashboard stats
  const [user, profile, studyNotesCount, interviewSessions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, name: true, image: true },
    }),
    prisma.userProfile.findUnique({
      where: { userId },
    }),
    prisma.studyNote.count({
      where: { userId },
    }),
    prisma.interviewSession.findMany({
      where: { userId },
      select: { score: true },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // Calculate dynamic stats
  const displayName = user.fullName ?? user.name ?? "Student";
  const firstName = displayName.split(/\s+/)[0];

  // 1. Calculate Profile Completion Percentage
  let completionPct = 0;
  if (displayName) completionPct += 15;
  if (user.image) completionPct += 15;
  if (profile?.bio) completionPct += 15;
  if (profile?.university) completionPct += 15;
  if (profile?.skills && profile.skills.length > 0) completionPct += 15;
  if (profile?.github || profile?.linkedin) completionPct += 15;
  if (profile?.studyTarget) completionPct += 10;

  // 2. Dynamic Readiness score (from mock interview database sessions)
  const readinessScore =
    interviewSessions.length > 0
      ? Math.round(interviewSessions.reduce((acc, curr) => acc + curr.score, 0) / interviewSessions.length)
      : 84; // default mock value

  // 3. Weekly Hours Chart Mock data
  const chartData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.1 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 2.9 },
    { day: "Sat", hours: 1.2 },
    { day: "Sun", hours: 0.8 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Study streak logger client action */}
      <StudyStreakTracker />

      {/* Welcome Banner */}
      <div className="flex justify-between items-center -mt-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {firstName}!</h1>
          <p className="text-xs text-zinc-500">Here&apos;s your career preparation overview for today.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex flex-col justify-between">
          <StreakCard />
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider">Interview Readiness</span>
            <span className="text-3xl font-black text-foreground block">📈 {readinessScore}%</span>
          </div>
          <ProgressBar value={readinessScore} className="mt-1" color="primary" />
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider">Library Files</span>
            <span className="text-3xl font-black text-foreground block">📁 {studyNotesCount} Files</span>
          </div>
          <span className="text-[10px] text-zinc-400">Created by you. Mapped in Leitner boxes.</span>
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider">Profile Completion</span>
            <span className="text-3xl font-black text-foreground block">👤 {completionPct}%</span>
          </div>
          <ProgressBar value={completionPct} className="mt-1" color="success" />
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

        {/* Study Checklist Card */}
        <Card className="flex flex-col">
          <CardHeader className="mb-0">
            <CardTitle className="text-sm font-bold">Today&apos;s Study List</CardTitle>
            <p className="text-[10px] text-zinc-500">Check off items to log progress and increment stats.</p>
          </CardHeader>
          <CardContent className="flex-1 mt-2">
            <TaskList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
