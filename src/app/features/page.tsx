"use client";

import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Learning Library",
      icon: "📚",
      desc: "Upload books, class notes, PDFs, or audio lectures. Our pipeline extracts metadata, transcribes audio, performs OCR on screenshots, and structures everything into searchable topics.",
    },
    {
      title: "Interactive AI Tutor",
      icon: "🤖",
      desc: "Receive customized flashcards and multiple-choice quizzes automatically from your notes. Ask domain-specific questions to receive concise, illustrated breakdowns.",
    },
    {
      title: "ATS Resume Scorer",
      icon: "📝",
      desc: "Evaluate your resume against real-world ATS benchmarks. Get precise feedback on structural layout, missing keywords, and recommendations to highlight project impact.",
    },
    {
      title: "Technical Mock Interviews",
      icon: "💬",
      desc: "Prepare for frontend, backend, or AI engineer roles. Our simulated interviewer asks adaptive follow-ups and grades your accuracy, confidence, and communication skills.",
    },
    {
      title: "Project Quality Analyzer",
      icon: "💻",
      desc: "Upload project repositories. Our code analyzer reviews folder directories, architecture choices, performance bottlenecks, vulnerability risks, and portfolio readiness.",
    },
    {
      title: "Career Roadmap & Graph",
      icon: "🗺️",
      desc: "Automatically map connections between notes, skills, and projects in an interactive knowledge graph. Generate weekly roadmaps to fill skill gaps systematically.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Platform capabilities</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Everything You Need to Succeed</h1>
          <p className="text-sm text-zinc-550 max-w-xl mx-auto">
            Explore the advanced modules engineered to accelerate your studies, strengthen your portfolio, and optimize interview performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {features.map((feature) => (
            <Card key={feature.title} hoverEffect>
              <CardHeader>
                <span className="text-3xl mb-1">{feature.icon}</span>
                <CardTitle className="text-base font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-550 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
