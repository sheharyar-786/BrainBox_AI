import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/ui/search-bar";
import { HeaderActions } from "@/components/ui/header-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch real authenticated user from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Redirect to onboarding if profile is missing
  if (!user.profile) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-card-border bg-card-bg/60 backdrop-blur-md flex items-center justify-between px-6 z-20 flex-shrink-0">
          <div className="flex-1 max-w-md hidden sm:block">
            <SearchBar placeholder="Search notes, roadmaps, code quality reports..." />
          </div>
          <div className="sm:hidden font-bold tracking-tight text-sm">
            CareerOS <span className="text-brand-primary">AI</span>
          </div>

          {/* Action Row */}
          <HeaderActions user={user} />
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-bg-dark-base/40 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
