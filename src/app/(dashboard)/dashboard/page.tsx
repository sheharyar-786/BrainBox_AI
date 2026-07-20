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
  const [
    user,
    studyNotesCount,
    studyMaterialsCount,
    interviewSessions,
    latestResume,
    recentConversations,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, name: true, image: true },
    }),
    prisma.studyNote.count({
      where: { userId },
    }),
    prisma.studyMaterial.count({
      where: { userId },
    }),
    prisma.interviewSession.findMany({
      where: { userId },
      select: { score: true },
    }),
    prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // Calculate dynamic stats
  const displayName = user.fullName ?? user.name ?? "Student";
  const firstName = displayName.split(/\s+/)[0];

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

  // 4. Personalized Recommendations
  const recommendations =
    latestResume?.recommendations && latestResume.recommendations.length > 0
      ? latestResume.recommendations.slice(0, 3)
      : [
          "Complete your user profile fields to tailor AI recommendations.",
          "Upload your resume to perform a comprehensive ATS audit.",
          "Start your first mock interview session to assess readiness.",
        ];

  return (
    <div className="flex flex-col gap-6">
      {/* Study streak logger client action */}
      <StudyStreakTracker />

      {/* Welcome Banner */}
      <div className="flex justify-between items-center -mt-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {firstName}!</h1>
          <p className="text-xs text-zinc-505">Here&apos;s your career preparation overview for today.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex flex-col justify-between">
          <StreakCard />
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interview Readiness</span>
            <span className="text-3xl font-black text-foreground block">📈 {readinessScore}%</span>
          </div>
          <ProgressBar value={readinessScore} className="mt-1" color="primary" />
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Latest Resume ATS</span>
            <span className="text-3xl font-black text-foreground block">
              📄 {latestResume ? `${latestResume.atsScore}%` : "Not Set"}
            </span>
          </div>
          <ProgressBar value={latestResume ? latestResume.atsScore : 0} className="mt-1" color="primary" />
        </Card>
        <Card className="flex flex-col gap-1.5 justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider font-bold">Library & Guides</span>
            <span className="text-3xl font-black text-foreground block">📁 {studyNotesCount + studyMaterialsCount} Decks</span>
          </div>
          <span className="text-[10px] text-zinc-400">Notes: {studyNotesCount} • AI Decks: {studyMaterialsCount}</span>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Study hours & suggestions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recharts Mock Layout */}
          <Card className="flex flex-col gap-4">
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

          {/* AI Tutor Recent Sessions & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">🤖 Recent Mentor Chats</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-2">
                {recentConversations.length === 0 ? (
                  <span className="text-xs text-zinc-400">No recent conversations.</span>
                ) : (
                  recentConversations.map((chat) => (
                    <a
                      key={chat.id}
                      href="/tutor"
                      className="p-2.5 rounded-xl border border-card-border bg-zinc-50/50 dark:bg-zinc-800/10 hover:border-brand-primary block text-xs font-semibold text-zinc-550 dark:text-zinc-350 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate block font-bold">{chat.title}</span>
                        <span className="text-[9px] text-zinc-400">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">💡 Next Steps & Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-2">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-card-border bg-zinc-50/50 dark:bg-zinc-800/10 text-xs font-semibold text-zinc-500 leading-relaxed">
                    {rec}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

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
