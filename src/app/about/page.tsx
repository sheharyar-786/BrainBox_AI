"use client";

import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  const stats = [
    { value: "15,000+", label: "Active Students" },
    { value: "48+", label: "University Partners" },
    { value: "92%", label: "Placement Success Rate" },
    { value: "240k+", label: "Mock Interviews Conducted" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Our story</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Bridging Academics and Careers</h1>
          <p className="text-sm text-zinc-550 max-w-2xl mx-auto leading-relaxed mt-2">
            Founded by a team of educators and industry veterans, CareerOS AI is dedicated to providing students with high-quality, personalized AI mentorship to help navigate transition hurdles smoothly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-brand-primary block mb-1">
                {stat.value}
              </span>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </Card>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Why CareerOS AI?</h2>
            <p className="text-xs text-zinc-555 leading-relaxed">
              We realized standard AI chatbots aren&apos;t enough to help students build real competence. Students need organized structures, feedback loops on code, and standardized evaluations for speaking confidence and logic.
            </p>
            <p className="text-xs text-zinc-550 leading-relaxed">
              Our system acts as a persistent mentor, connecting concepts from class lectures straight to portfolio projects, mapping their progress in a personalized interactive Knowledge Graph.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden glass-effect p-8 flex flex-col justify-center items-center bg-brand-primary/5 border-brand-primary/10 aspect-video">
            <span className="text-4xl mb-3">🎓</span>
            <span className="text-sm font-bold text-center">Empowering University Placement Cells & Students Worldwide</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
