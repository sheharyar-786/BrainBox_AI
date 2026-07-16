import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user data from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch profile data from DB
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Calculate dynamic stats from database
  const interviewSessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    select: { score: true },
  });

  // Dynamic interview readiness score based on database mock interview logs
  const readiness =
    interviewSessions.length > 0
      ? Math.round(interviewSessions.reduce((acc, curr) => acc + curr.score, 0) / interviewSessions.length)
      : 84; // Fallback default mock value if none completed

  const viewUser = {
    id: user.id,
    fullName: user.fullName ?? user.name ?? "Student",
    email: user.email,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
  };

  return (
    <ProfileView
      user={viewUser}
      profile={profile}
      stats={{
        gpa: "3.8 / 4.0",
        readiness,
      }}
    />
  );
}
