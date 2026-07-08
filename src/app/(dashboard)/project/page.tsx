"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ProjectPage() {
  const [hasUploaded, setHasUploaded] = useState(false);

  const metrics = [
    { name: "Code Quality & Style", score: 82, desc: "Uses clean naming conventions and TypeScript types but has complex functions." },
    { name: "Security & Vulnerabilities", score: 90, desc: "Dependencies are clean, no hardcoded secrets in env loaders." },
    { name: "Performance & Caching", score: 78, desc: "Some missing memoized components and redundant re-renders." },
    { name: "Portfolio Readiness", score: 85, desc: "Project structures are clean and has solid README documentation." },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Project Quality Analyzer</h1>
        <p className="text-xs text-zinc-555">Analyze code structures, repository directories, and review portfolio readiness.</p>
      </div>

      {!hasUploaded && (
        <Card className="max-w-xl mx-auto w-full mt-4 text-center p-8 flex flex-col items-center justify-center border-dashed border-card-border/80 bg-white/20 dark:bg-zinc-800/20">
          <span className="text-4xl mb-4">💻</span>
          <h2 className="text-sm font-bold text-foreground">Upload Project ZIP</h2>
          <p className="text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
            Drag and drop your code repository ZIP here. We will analyze directories, security standards, and compile reports.
          </p>
          <Button onClick={() => setHasUploaded(true)} className="mt-6 cursor-pointer">
            Upload Mock Repository (brainbox-nextjs.zip)
          </Button>
        </Card>
      )}

      {hasUploaded && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main metrics */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Architecture & Quality Scorecard</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 mt-2">
                {metrics.map((metric) => (
                  <div key={metric.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>{metric.name}</span>
                      <span className="text-brand-primary">{metric.score}%</span>
                    </div>
                    <ProgressBar value={metric.score} color="primary" />
                    <p className="text-[10px] text-zinc-400 mt-0.5">{metric.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Directory Details and suggestions */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Folder Structure Audit</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-xs leading-relaxed text-zinc-555 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-brand-success">✓</span>
                  <span>Feature-based architecture is correctly implemented.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-success">✓</span>
                  <span>Independent service layers isolate business queries.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-warning">⚠</span>
                  <span>Nested route components inside app/ layout require pruning.</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" onClick={() => setHasUploaded(false)} className="w-full cursor-pointer">
                  Re-upload Repository
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
