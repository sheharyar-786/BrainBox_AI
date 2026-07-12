"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function InterviewPage() {
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? "Candidate";
  const [sessionState, setSessionState] = useState<"setup" | "active" | "feedback">("setup");
  const [domain, setDomain] = useState("Frontend");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const [chat, setChat] = useState([
    { sender: "INTERVIEWER", content: "Welcome! Let&apos;s begin the technical session. Can you explain what a transitive dependency is and how we resolve it in database design?" },
  ]);

  const handleStartInterview = () => {
    setSessionState("active");
    setChat([
      {
        sender: "INTERVIEWER",
        content: `Welcome to the ${domain} technical interview. Let's start with a core concept. Can you explain how you would design a system to handle high read loads and ensure data consistency?`,
      },
    ]);
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      const interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      setRecordingInterval(null);

      // Append mock user answer
      const userText = "To handle high read loads, I would use database replication with read-replicas, and place a Redis caching layer in front of the database to store frequently accessed data. For consistency, we can use cache invalidation strategies.";
      setChat((prev) => [...prev, { sender: "USER", content: userText }]);

      // Trigger interviewer follow-up
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            sender: "INTERVIEWER",
            content: "Excellent. You mentioned Redis caching. How would you handle a 'cache stampede' or 'cache penetration' scenario in a production environment?",
          },
        ]);
      }, 1000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Technical Mock Interview</h1>
        <p className="text-xs text-zinc-550">Practice domain-specific interviews and receive structured evaluation reports.</p>
      </div>

      {sessionState === "setup" && (
        <Card className="max-w-2xl mx-auto w-full mt-4">
          <CardHeader>
            <CardTitle className="text-base font-bold">Configure Interview Parameters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Interview Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all duration-200 text-foreground"
              >
                <option value="Frontend">Frontend Engineer (React, CSS, JS)</option>
                <option value="Backend">Backend Engineer (Node, Python, Go)</option>
                <option value="Database">Database Architect (SQL, Indexing, Normalization)</option>
                <option value="AI / ML">AI Engineer (Embeddings, RAG, Fine-tuning)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Interview Difficulty</label>
              <div className="grid grid-cols-3 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-card-border">
                <span className="py-2 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-700 shadow text-center text-foreground select-none">
                  Junior / Intern
                </span>
                <span className="py-2 text-xs font-semibold rounded-lg text-zinc-500 text-center select-none opacity-50">
                  Mid-Level
                </span>
                <span className="py-2 text-xs font-semibold rounded-lg text-zinc-500 text-center select-none opacity-50">
                  Senior Architect
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button onClick={handleStartInterview} className="w-full cursor-pointer">
              Start Mock Interview
            </Button>
          </CardFooter>
        </Card>
      )}

      {sessionState === "active" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Chat log */}
          <Card className="lg:col-span-3 h-[500px] flex flex-col justify-between overflow-hidden">
            <CardHeader className="flex-grow-0 border-b border-card-border pb-3 mb-0">
              <CardTitle className="text-sm font-bold">Live Session: {domain}</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex max-w-[80%] flex-col p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === "INTERVIEWER" ? "bg-white dark:bg-zinc-800/60 border border-card-border self-start" : "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white self-end"}`}
                >
                  <span className="font-bold text-[10px] opacity-60 mb-0.5 uppercase tracking-wide">
                    {msg.sender === "INTERVIEWER" ? "AI Interviewer" : `${displayName} (Candidate)`}
                  </span>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Mic control */}
            <div className="p-4 border-t border-card-border flex items-center justify-between gap-4 flex-grow-0 bg-white/10">
              <Button
                variant={isRecording ? "danger" : "glass"}
                onClick={handleToggleRecording}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isRecording ? "bg-white animate-ping" : "bg-red-500"}`} />
                {isRecording ? `Recording (${formatTime(recordingSeconds)})` : "Answer by Voice"}
              </Button>
              <Button onClick={() => setSessionState("feedback")} className="cursor-pointer">
                Complete & Grade
              </Button>
            </div>
          </Card>

          {/* Tips / Instructions */}
          <Card className="lg:col-span-2 h-[500px]">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Interview Instructions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs text-zinc-555 leading-relaxed mt-2">
              <p>1. <strong>Explain Your Logic</strong>: AI interviewers value structured replies. Try explaining the &apos;Why&apos; alongside the &apos;What&apos;.</p>
              <p>2. <strong>Speak Clearly</strong>: Click &apos;Answer by Voice&apos; and record your explanation. Clicking stop will transcribe your response.</p>
              <p>3. <strong>Check Rubrics</strong>: After submission, we assess your structural organization, confidence level, and accuracy tags.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {sessionState === "feedback" && (
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-brand-success">Evaluation Completed successfully</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="glass-effect p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Technical Quality</span>
                  <span className="text-2xl font-black text-brand-primary">85%</span>
                </div>
                <div className="glass-effect p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Confidence Metric</span>
                  <span className="text-2xl font-black text-brand-secondary">90%</span>
                </div>
                <div className="glass-effect p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Communication</span>
                  <span className="text-2xl font-black text-brand-info">82%</span>
                </div>
                <div className="glass-effect p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Overall Grade</span>
                  <span className="text-2xl font-black text-brand-success">B+</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Improvement Suggestions</h3>
                <ul className="flex flex-col gap-2 text-xs text-zinc-550 leading-relaxed list-disc pl-4">
                  <li><strong>Structural Explanation</strong>: Expand on cache consistency models (e.g. Write-through vs Write-back) when answering system load questions.</li>
                  <li><strong>Speaking Flow</strong>: Reduce usage of filler phrases (&apos;like&apos;, &apos;you know&apos;) in technical descriptions to boost communication metrics.</li>
                  <li><strong>Scale Mitigation</strong>: Define the role of hashing rings in consistent hashing setups to prevent hot-spot issues.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
              <Button variant="secondary" onClick={() => setSessionState("setup")} className="cursor-pointer">
                Practice Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
