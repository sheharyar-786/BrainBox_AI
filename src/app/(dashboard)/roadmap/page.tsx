"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { generateRoadmapAction, getLatestRoadmapAction, updateRoadmapMilestoneAction } from "@/app/actions/ai-roadmap";

interface Milestone {
  id: string;
  title: string;
  desc: string;
  done: boolean;
}

interface RoadmapData {
  id: string;
  title: string;
  jsonData: unknown;
}

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic roadmap states
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [careerPath, setCareerPath] = useState("Fullstack Developer");

  const loadLatestRoadmap = async () => {
    setIsLoading(true);
    const result = await getLatestRoadmapAction();
    setIsLoading(false);
    if (result.success && result.roadmap) {
      setRoadmap(result.roadmap as unknown as RoadmapData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLatestRoadmap().catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    const result = await generateRoadmapAction(careerPath);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success && result.roadmap) {
      setRoadmap(result.roadmap as unknown as RoadmapData);
    }
  };

  const handleToggleMilestone = async (milestoneId: string, currentDone: boolean) => {
    if (!roadmap) return;
    
    // Optimistic toggle
    const currentMilestones = roadmap.jsonData as Milestone[];
    const updatedMilestones = currentMilestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !currentDone } : m
    );

    setRoadmap({
      ...roadmap,
      jsonData: updatedMilestones,
    });

    const result = await updateRoadmapMilestoneAction(roadmap.id, milestoneId, !currentDone);
    if (result.error) {
      setErrorMsg(result.error);
      // Revert optimistic toggle
      setRoadmap({
        ...roadmap,
        jsonData: currentMilestones,
      });
    }
  };

  const handleResetRoadmap = () => {
    setRoadmap(null);
  };

  const milestones = (roadmap?.jsonData as Milestone[]) || [];
  const doneCount = milestones.filter((m) => m.done).length;
  const progressPercentage = milestones.length > 0 ? (doneCount / milestones.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Personalized Career Roadmap</h1>
          <p className="text-xs text-zinc-500">Systematic learning tracks mapped straight to job descriptions.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* If no roadmap generated yet */}
      {!roadmap && (
        <Card className="max-w-xl mx-auto w-full mt-4">
          <CardContent className="p-6">
            <h2 className="text-sm font-bold text-foreground block mb-2">Create Your AI Roadmap</h2>
            <p className="text-xs text-zinc-500 leading-relaxed mb-5">
              Select your career path specialization. Our AI engine will structure a 5-step learning timeline mapped to industry expectations.
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Select Specialization</label>
                <select
                  value={careerPath}
                  onChange={(e) => setCareerPath(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border outline-none text-foreground font-semibold"
                >
                  <option value="Frontend Developer">Frontend Developer (React, Next.js, Styling)</option>
                  <option value="Backend Developer">Backend Developer (Node.js, PostgreSQL, System Design)</option>
                  <option value="Fullstack Developer">Fullstack Developer (Frontend, Backend, Deployment)</option>
                  <option value="AI / ML Engineer">AI / ML Engineer (Python, LLMs, Vector Databases)</option>
                  <option value="Mobile App Developer">Mobile App Developer (React Native, iOS/Android Deploy)</option>
                </select>
              </div>
              <Button type="submit" isLoading={isLoading} className="cursor-pointer">
                {isLoading ? "Generating Milestones..." : "Generate Career Roadmap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* If roadmap is active */}
      {roadmap && (
        <>
          {/* Progress Card */}
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-5">
              <div className="h-20 w-20 rounded-full border-4 border-brand-primary flex flex-col items-center justify-center font-black bg-brand-primary/5 flex-shrink-0">
                <span className="text-xl text-brand-primary">{Math.round(progressPercentage)}%</span>
                <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Done</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-foreground">{roadmap.title}</h3>
                  <button
                    onClick={handleResetRoadmap}
                    className="text-[10px] text-zinc-400 hover:text-brand-accent font-bold uppercase transition-colors"
                  >
                    Reset & Generate New Track 🔄
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Completed {doneCount} of {milestones.length} learning modules. Complete all steps to unlock Mock Interview readiness status.
                </p>
                <ProgressBar value={progressPercentage} className="mt-1" color="primary" />
              </div>
            </CardContent>
          </Card>

          {/* Timeline Steps */}
          <div className="flex flex-col gap-4 mt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Roadmap Milestones</h2>
            <div className="relative border-l border-card-border pl-6 ml-3 flex flex-col gap-6">
              {milestones.map((step) => (
                <div key={step.id} className="relative">
                  {/* Dot indicator */}
                  <span
                    onClick={() => handleToggleMilestone(step.id, step.done)}
                    className={`absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      step.done
                        ? "bg-brand-success border-brand-success text-white"
                        : "bg-bg-light-base dark:bg-bg-dark-base border-card-border text-transparent hover:border-brand-primary"
                    }`}
                  >
                    {step.done && (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <div
                    onClick={() => handleToggleMilestone(step.id, step.done)}
                    className={`glass-effect p-4 rounded-xl cursor-pointer border transition-all duration-200 flex flex-col gap-1 ${
                      step.done
                        ? "bg-brand-primary/[0.02] border-card-border/60"
                        : "border-card-border hover:border-brand-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${step.done ? "text-zinc-400 line-through font-normal" : "text-foreground"}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${step.done ? "bg-brand-success/15 text-brand-success" : "bg-brand-primary/10 text-brand-primary"}`}>
                        {step.done ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
