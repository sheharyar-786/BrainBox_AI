import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if profile already exists in DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      name: true,
      email: true,
      profile: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Bypass onboarding if user profile exists
  if (user.profile) {
    redirect("/dashboard");
  }

  const initialData = {
    fullName: user.fullName ?? user.name ?? "",
    email: user.email,
  };

  return (
    <div className="min-h-screen bg-bg-light-base dark:bg-bg-dark-base flex flex-col justify-center items-center py-12 transition-colors duration-300">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          CareerOS <span className="text-brand-primary">AI</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Set up your profile to customize your AI career companion.</p>
      </div>

      <OnboardingWizard initialData={initialData} />
    </div>
  );
}
