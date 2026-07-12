"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? "John Doe";
  const displayEmail = session?.user?.email ?? "john.doe@university.edu";
  const displayRole = session?.user?.role ? session.user.role.charAt(0) + session.user.role.slice(1).toLowerCase() : "Student";

  const skills = ["React.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Docker", "Git", "REST APIs", "Database Normalization"];
  const certs = [
    { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "Jan 2026" },
    { title: "Meta Front-End Developer Certificate", issuer: "Coursera / Meta", date: "Nov 2025" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Student Profile</h1>
        <p className="text-xs text-zinc-550">Review education history, skills pool, and placement badges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* User main card */}
        <Card className="md:col-span-1 text-center flex flex-col items-center justify-center p-6 gap-4">
          <Avatar name={displayName} size="lg" isOnline className="mb-2" />
          <div>
            <h2 className="text-base font-bold text-foreground">{displayName}</h2>
            <p className="text-xs text-zinc-500">{displayRole} • Software Engineering</p>
            <p className="text-[10px] text-zinc-400">{displayEmail}</p>
          </div>
          <div className="w-full border-t border-card-border pt-4 grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">GPA</p>
              <p className="text-base font-bold text-brand-primary">3.8 / 4.0</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Readiness</p>
              <p className="text-base font-bold text-brand-success">84%</p>
            </div>
          </div>
        </Card>

        {/* Education & skills */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Skills Pool</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-card-border text-xs font-semibold text-foreground hover:border-brand-primary/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Verified Certificates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-2">
              {certs.map((c) => (
                <div key={c.title} className="flex justify-between items-start gap-4 p-3 rounded-xl border border-card-border hover:bg-zinc-50/50 dark:hover:bg-zinc-800 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{c.title}</h4>
                    <p className="text-[10px] text-zinc-500">{c.issuer} • Verified</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{c.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
