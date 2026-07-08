"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ResumePage() {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [score, setScore] = useState(76);
  const [keywords, setKeywords] = useState([
    { name: "React", matched: true },
    { name: "Prisma", matched: true },
    { name: "PostgreSQL", matched: true },
    { name: "Docker", matched: false },
    { name: "TypeScript", matched: true },
    { name: "CI/CD Pipelines", matched: false },
    { name: "AWS S3", matched: false },
  ]);

  const handleUploadResume = () => {
    setHasUploaded(true);
  };

  const handleAddKeyword = (name: string) => {
    setKeywords(keywords.map((kw) => (kw.name === name ? { ...kw, matched: true } : kw)));
    // Boost score
    setScore((prev) => Math.min(prev + 5, 100));
  };

  const missingKeywords = keywords.filter((kw) => !kw.matched);
  const matchedKeywords = keywords.filter((kw) => kw.matched);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">ATS Resume Analyzer</h1>
        <p className="text-xs text-zinc-550">Optimize your resume templates and check parsing compatibility metrics.</p>
      </div>

      {!hasUploaded && (
        <Card className="max-w-xl mx-auto w-full mt-4 text-center p-8 flex flex-col items-center justify-center border-dashed border-card-border/80 bg-white/20 dark:bg-zinc-800/20">
          <span className="text-4xl mb-4">📄</span>
          <h2 className="text-sm font-bold text-foreground">Upload Your Resume</h2>
          <p className="text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
            Drag and drop your PDF or Word document here, or click to browse. We will parse structures and analyze keywords.
          </p>
          <Button onClick={handleUploadResume} className="mt-6 cursor-pointer">
            Upload Mock Resume (John_Doe_CV.pdf)
          </Button>
        </Card>
      )}

      {hasUploaded && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main analysis metrics */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">ATS Audit Scorecard</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                {/* Circular score display */}
                <div className="h-28 w-28 rounded-full border-4 border-brand-primary flex flex-col items-center justify-center font-black bg-brand-primary/5 flex-shrink-0">
                  <span className="text-3xl text-brand-primary">{score}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Score</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Score Evaluation</h3>
                  <p className="text-xs text-zinc-550 leading-relaxed">
                    {score >= 85
                      ? "Excellent! Your resume exhibits high keyword matching density and clean ATS-compliant structure patterns."
                      : "Good start. Your resume structure is parsed correctly, but you can improve this score by adding missing skills and keywords."}
                  </p>
                  <ProgressBar value={score} className="mt-1" color={score >= 85 ? "success" : "primary"} />
                </div>
              </CardContent>
            </Card>

            {/* Keyword Optimizer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Skills & Keywords Optimizer</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold text-zinc-500">Matched Skills ({matchedKeywords.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.map((kw) => (
                      <span key={kw.name} className="px-2.5 py-1 rounded-lg bg-brand-success/10 text-brand-success border border-brand-success/20 text-xs font-semibold flex items-center gap-1.5">
                        <span>✓</span> {kw.name}
                      </span>
                    ))}
                  </div>
                </div>

                {missingKeywords.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-card-border pt-4">
                    <h3 className="text-xs font-semibold text-zinc-500">Missing Target Skills (Click to Add to Resume)</h3>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((kw) => (
                        <button
                          key={kw.name}
                          onClick={() => handleAddKeyword(kw.name)}
                          className="px-2.5 py-1 rounded-lg bg-brand-accent/5 hover:bg-brand-accent/15 border border-brand-accent/20 hover:border-brand-accent/40 text-brand-accent text-xs font-semibold transition-all duration-200 cursor-pointer"
                        >
                          <span>+</span> {kw.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback & formatting checklist */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Formatting Checklist</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs text-zinc-555 mt-2">
              <div className="flex items-start gap-2.5">
                <span className="text-brand-success font-bold">✓</span>
                <div>
                  <p className="font-semibold">Clear Header Details</p>
                  <p className="text-[10px] text-zinc-400">Name, phone, and university email are correctly positioned.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-brand-success font-bold">✓</span>
                <div>
                  <p className="font-semibold">Single-Column Grid Layout</p>
                  <p className="text-[10px] text-zinc-400">No multi-column parsing errors detected.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-brand-warning font-bold">⚠</span>
                <div>
                  <p className="font-semibold">Missing Project Metrics</p>
                  <p className="text-[10px] text-zinc-400">Describe tech items with quantifiable success numbers (e.g. &apos;boosted performance by 24%&apos;).</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-4 flex-grow-0 pt-0">
              <Button variant="secondary" onClick={() => setHasUploaded(false)} className="w-full cursor-pointer">
                Re-upload Resume
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
