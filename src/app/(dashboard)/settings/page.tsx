import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch email from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Check if server-side API keys are configured
  const keysConfigured = {
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-xs text-zinc-550">Configure platform layout options, notifications preferences, and security settings.</p>
      </div>

      <SettingsTabs initialEmail={user.email} keysConfigured={keysConfigured} />
    </div>
  );
}
