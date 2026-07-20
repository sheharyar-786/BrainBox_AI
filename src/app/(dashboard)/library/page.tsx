"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateStudyMaterialAction, getStudyMaterialsAction } from "@/app/actions/ai-study";

interface StudyMaterial {
  id: string;
  topic: string;
  summary: string;
  notes: string;
  createdAt: Date;
}

export default function LibraryPage() {
  const [topicInput, setTopicInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(null);

  const loadMaterials = async () => {
    const result = await getStudyMaterialsAction();
    if (result.success && result.materials) {
      setMaterials(result.materials as unknown as StudyMaterial[]);
      if (result.materials.length > 0) {
        setActiveMaterial(result.materials[0] as unknown as StudyMaterial);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMaterials().catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    const result = await generateStudyMaterialAction(topicInput);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success && result.studyMaterial) {
      setTopicInput("");
      setMaterials((prev) => [result.studyMaterial as unknown as StudyMaterial, ...prev]);
      setActiveMaterial(result.studyMaterial as unknown as StudyMaterial);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Study Library</h1>
        <p className="text-xs text-zinc-500">Generate note summaries, cheat sheets, and custom study guides using AI.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left panel: Generate Input and list of topics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Generate New Study Guide</CardTitle>
            </CardHeader>
            <CardContent className="mt-2">
              <form onSubmit={handleGenerate} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Enter Topic Name</label>
                  <Input
                    placeholder="e.g. Redux Toolkit, SQL Joins, CSS Grid"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" isLoading={isLoading} className="cursor-pointer">
                  Generate Study Deck
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List of generated guides */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Generated Decks</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-[300px] overflow-y-auto mt-2">
              {materials.length === 0 ? (
                <span className="text-xs text-zinc-405">No study guides generated yet.</span>
              ) : (
                materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMaterial(m)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      activeMaterial?.id === m.id
                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                        : "border-card-border bg-transparent text-zinc-450 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate block font-bold">{m.topic}</span>
                      <span className="text-[9px] text-zinc-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-450 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {m.summary}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel: Active study deck view */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {activeMaterial ? (
            <Card>
              <CardHeader className="pb-3 border-b border-card-border mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black text-foreground">{activeMaterial.topic}</h2>
                    <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest mt-1 block">
                      Study Summary
                    </span>
                  </div>
                  <a href="/tutor" className="text-[10px] text-brand-primary font-bold hover:underline">
                    Practice Flashcards / Quizzes ⚡
                  </a>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed italic mt-3 bg-zinc-50/50 dark:bg-zinc-800/10 p-3 rounded-xl border border-card-border">
                  &quot;{activeMaterial.summary}&quot;
                </p>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4">
                <div>
                  <h3 className="text-xs font-bold text-foreground mb-2">Detailed Study Notes</h3>
                  <div className="p-4 rounded-xl border border-card-border bg-zinc-50/25 dark:bg-zinc-800/10 text-xs text-zinc-550 dark:text-zinc-350 leading-relaxed font-semibold whitespace-pre-wrap">
                    {activeMaterial.notes}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center p-8 flex flex-col items-center justify-center border-dashed border-card-border/80 bg-white/20 dark:bg-zinc-800/20">
              <span className="text-4xl mb-3">📚</span>
              <h2 className="text-sm font-bold text-foreground">No Guide Selected</h2>
              <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Enter a topic on the left to generate comprehensive AI study guides and quizzes.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
