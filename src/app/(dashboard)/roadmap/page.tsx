"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function RoadmapPage() {
  const [steps, setSteps] = useState([
    { id: "1", title: "HTML & CSS Layout Primitives", desc: "Build responsive grids and utilize clean glassmorphism overlays using modern HSL colors.", done: true },
    { id: "2", title: "Advanced JavaScript & TypeScript", desc: "Understand closures, asynchronous event loops, and strict type guards.", done: true },
    { id: "3", title: "Relational Database Normalization", desc: "Learn key indexing, transitive dependencies, and normal forms (1NF, 2NF, 3NF).", done: false },
    { id: "4", title: "Next.js App Router & Server Actions", desc: "Architect dynamic server components and protect APIs with Edge middleware.", done: false },
    { id: "5", title: "Mock Interview & Technical Readiness", desc: "Succeed in Technical Mock Interview evaluations with score averages above 85%.", done: false },
  ]);

  const toggleStep = (id: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, done: !step.done } : step))
    );
  };

  const doneCount = steps.filter((s) => s.done).length;
  const progressPercentage = (doneCount / steps.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Personalized Career Roadmap</h1>
          <p className="text-xs text-zinc-555">Systematic learning tracks mapped straight to job descriptions.</p>
        </div>
      </div>

      {/* Progress card */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-5">
          <div className="h-20 w-20 rounded-full border-4 border-brand-primary flex flex-col items-center justify-center font-black bg-brand-primary/5 flex-shrink-0">
            <span className="text-xl text-brand-primary">{Math.round(progressPercentage)}%</span>
            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Done</span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 w-full">
            <h3 className="text-sm font-bold text-foreground">Full Stack Developer Track</h3>
            <p className="text-xs text-zinc-500">
              Completed {doneCount} of {steps.length} learning modules. Complete all steps to unlock Mock Interview readiness status.
            </p>
            <ProgressBar value={progressPercentage} className="mt-1" color="primary" />
          </div>
        </CardContent>
      </Card>

      {/* Timeline Steps */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Roadmap Milestones</h2>
        <div className="relative border-l border-card-border pl-6 ml-3 flex flex-col gap-6">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              {/* Dot indicator */}
              <span className={`absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${step.done ? "bg-brand-success border-brand-success text-white" : "bg-bg-light-base dark:bg-bg-dark-base border-card-border text-transparent"}`}>
                {step.done && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div
                onClick={() => toggleStep(step.id)}
                className={`glass-effect p-4 rounded-xl cursor-pointer border hover:border-brand-primary/30 transition-all duration-200 flex flex-col gap-1 ${step.done ? "bg-brand-primary/[0.02]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-bold ${step.done ? "text-zinc-400 line-through" : "text-foreground"}`}>
                    {step.title}
                  </h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${step.done ? "bg-brand-success/15 text-brand-success" : "bg-brand-primary/10 text-brand-primary"}`}>
                    {step.done ? "Completed" : "In Progress"}
                  </span>
                </div>
                <p className="text-xs text-zinc-555 leading-relaxed mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
