"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { analyzeResumeAction, getLatestResumeAction } from "@/app/actions/ai-resume";

interface ResumeData {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  recommendations: string[];
  originalFile: string;
}

export default function ResumePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Dynamic resume state loaded from database
  const [resume, setResume] = useState<ResumeData | null>(null);

  const loadLatestResume = async () => {
    setIsLoading(true);
    const result = await getLatestResumeAction();
    setIsLoading(false);
    if (result.success && result.resume) {
      setResume(result.resume as unknown as ResumeData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLatestResume().catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("resume", file);

    const result = await analyzeResumeAction(formData);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success && result.resume) {
      setResume(result.resume as unknown as ResumeData);
    }
  };

  const handleAddKeyword = (kw: string) => {
    if (!resume) return;

    // Simulate adding missing keyword into matched keywords state and increasing the score slightly
    const updatedMissing = resume.missingKeywords.filter((k: string) => k !== kw);
    const updatedStrengths = [...resume.strengths, `Matched added skill: ${kw}`];
    const newScore = Math.min(resume.atsScore + 4, 100);

    setResume({
      ...resume,
      missingKeywords: updatedMissing,
      strengths: updatedStrengths,
      atsScore: newScore,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">ATS Resume Analyzer</h1>
        <p className="text-xs text-zinc-500">Optimize your resume templates and check parsing compatibility metrics.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* If no resume is uploaded yet */}
      {!resume && (
        <Card className="max-w-xl mx-auto w-full mt-4 text-center p-8 flex flex-col items-center justify-center border-dashed border-card-border/80 bg-white/20 dark:bg-zinc-800/20">
          <span className="text-4xl mb-4">📄</span>
          <h2 className="text-sm font-bold text-foreground">Upload Your CV / Resume</h2>
          <p className="text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
            Upload your resume PDF, DOCX, or text file. We will extract content and perform a comprehensive ATS keyword audit.
          </p>

          <div className="mt-6 relative">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Analyzing Resume..." : "Select & Analyze File"}
            </Button>
          </div>
        </Card>
      )}

      {/* If resume analysis is loaded */}
      {resume && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main analysis metrics */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle className="text-sm font-bold">ATS Audit Scorecard</CardTitle>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-brand-primary font-bold hover:underline cursor-pointer">
                    {isLoading ? "Analyzing..." : "Re-Upload File 🔄"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                {/* Circular score display */}
                <div className="h-28 w-28 rounded-full border-4 border-brand-primary flex flex-col items-center justify-center font-black bg-brand-primary/5 flex-shrink-0">
                  <span className="text-3xl text-brand-primary">{resume.atsScore}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Score</span>
                </div>
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Score Evaluation</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {resume.atsScore >= 85
                      ? "Excellent! Your resume exhibits high keyword matching density and clean ATS-compliant structure patterns."
                      : "Good start. Your resume structure is parsed correctly, but you can improve this score by adding missing skills and keywords."}
                  </p>
                  <ProgressBar value={resume.atsScore} className="mt-1" color={resume.atsScore >= 85 ? "success" : "primary"} />
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">🔥 Key Strengths</CardTitle>
                </CardHeader>
                <CardContent className="mt-2">
                  <ul className="flex flex-col gap-2">
                    {resume.strengths?.length > 0 ? (
                      resume.strengths.map((str: string, index: number) => (
                        <li key={index} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-brand-success font-black">✓</span>
                          <span>{str}</span>
                        </li>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400">No major strengths found.</span>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">⚠️ ATS Gaps & Weaknesses</CardTitle>
                </CardHeader>
                <CardContent className="mt-2">
                  <ul className="flex flex-col gap-2">
                    {resume.weaknesses?.length > 0 ? (
                      resume.weaknesses.map((weak: string, index: number) => (
                        <li key={index} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-brand-accent font-black">!</span>
                          <span>{weak}</span>
                        </li>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400">No major gaps identified! Excellent.</span>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Keyword Optimizer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Skills & Keywords Optimizer</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 mt-2">
                {resume.missingKeywords?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-zinc-550">Missing Target Skills (Click to Add to Resume)</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.missingKeywords.map((kw: string) => (
                        <button
                          key={kw}
                          onClick={() => handleAddKeyword(kw)}
                          className="px-2.5 py-1 rounded-lg border border-card-border bg-white/20 dark:bg-zinc-800/25 hover:border-brand-primary text-zinc-500 hover:text-brand-primary text-xs font-semibold transition-colors cursor-pointer"
                        >
                          ➕ {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-brand-success font-semibold">Matched all target skills! Excellent!</span>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recommendations */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-bold">ATS Audit Recommendations</CardTitle>
              <p className="text-[10px] text-zinc-500">Implement these changes to optimize search parameters.</p>
            </CardHeader>
            <CardContent className="mt-2 flex flex-col gap-3">
              {resume.recommendations?.length > 0 ? (
                resume.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="p-3 rounded-xl border border-card-border bg-zinc-50/50 dark:bg-zinc-800/10 text-xs">
                    <span className="font-extrabold text-[10px] text-brand-primary uppercase tracking-wide block mb-1">
                      Rec #{index + 1}
                    </span>
                    <p className="text-zinc-500 dark:text-zinc-350 leading-relaxed font-semibold">
                      {rec}
                    </p>
                  </div>
                ))
              ) : (
                <span className="text-xs text-zinc-400">No suggestions needed. Your resume is fully optimized.</span>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
