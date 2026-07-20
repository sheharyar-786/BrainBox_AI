"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  generateInterviewQuestionsAction,
  submitInterviewSessionAction,
  getInterviewHistoryAction,
} from "@/app/actions/ai-interview";

interface TranscriptEntry {
  sender: "INTERVIEWER" | "USER";
  content: string;
}

interface InterviewSessionData {
  id: string;
  role: string;
  difficulty: string;
  score: number;
  feedback: string;
}

export default function InterviewPage() {
  const [sessionState, setSessionState] = useState<"setup" | "active" | "feedback">("setup");
  const [role, setRole] = useState("Fullstack Engineer");
  const [tech, setTech] = useState("React, Next.js, Prisma, PostgreSQL");
  const [difficulty, setDifficulty] = useState<"Junior" | "Mid-Level" | "Senior">("Mid-Level");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active session states
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chat, setChat] = useState<TranscriptEntry[]>([]);
  const [answerInput, setAnswerInput] = useState("");
  
  // Feedback results
  const [score, setScore] = useState(80);
  const [feedback, setFeedback] = useState("");

  // History list
  const [history, setHistory] = useState<InterviewSessionData[]>([]);

  const loadHistory = async () => {
    const result = await getInterviewHistoryAction();
    if (result.success && result.history) {
      setHistory(result.history as unknown as InterviewSessionData[]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory().catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStartInterview = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await generateInterviewQuestionsAction(role, difficulty, tech);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success && result.questions && result.questions.length > 0) {
      setQuestions(result.questions);
      setCurrentIdx(0);
      setSessionState("active");
      
      // Start with the first question
      setChat([
        {
          sender: "INTERVIEWER",
          content: `Welcome to your ${difficulty} ${role} mock interview. Let's begin. Question 1: ${result.questions[0]}`,
        },
      ]);
    }
  };

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    const userText = answerInput;
    setAnswerInput("");

    // Append user answer
    const updatedChat: TranscriptEntry[] = [...chat, { sender: "USER", content: userText }];
    setChat(updatedChat);

    const nextIndex = currentIdx + 1;
    if (nextIndex < questions.length) {
      // Move to next question
      setCurrentIdx(nextIndex);
      setChat([
        ...updatedChat,
        {
          sender: "INTERVIEWER",
          content: `Question ${nextIndex + 1}: ${questions[nextIndex]}`,
        },
      ]);
    } else {
      // Evaluate session
      setIsLoading(true);
      setErrorMsg(null);
      const evalResult = await submitInterviewSessionAction(role, difficulty, updatedChat);
      setIsLoading(false);

      if (evalResult.error) {
        setErrorMsg(evalResult.error);
      } else if (evalResult.success && evalResult.session) {
        setScore(evalResult.session.score);
        setFeedback(evalResult.session.feedback);
        setSessionState("feedback");
        loadHistory();
      }
    }
  };

  const handleReset = () => {
    setSessionState("setup");
    setQuestions([]);
    setCurrentIdx(0);
    setChat([]);
    setAnswerInput("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Technical Mock Interview</h1>
        <p className="text-xs text-zinc-500">Practice domain-specific interviews and receive structured evaluation reports.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Setup configuration mode */}
      {sessionState === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-bold">Configure Interview Parameters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Target Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Interview Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "Junior" | "Mid-Level" | "Senior")}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border outline-none focus:border-brand-primary text-foreground"
                  >
                    <option value="Junior">Junior / Intern</option>
                    <option value="Mid-Level">Mid-Level Engineer</option>
                    <option value="Senior">Senior / Principal</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  placeholder="e.g. React, Node.js, SQL"
                  className="w-full px-4 py-2.5 text-xs rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border outline-none focus:border-brand-primary"
                />
              </div>

              <Button onClick={handleStartInterview} isLoading={isLoading} className="mt-2 w-full cursor-pointer">
                Start Interview Session
              </Button>
            </CardContent>
          </Card>

          {/* Past Evaluations Sidebar */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Past Interview Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 max-h-[300px] overflow-y-auto mt-2">
              {history.length === 0 ? (
                <span className="text-xs text-zinc-400">No mock interviews completed yet.</span>
              ) : (
                history.map((session) => (
                  <div key={session.id} className="p-2.5 rounded-xl border border-card-border bg-zinc-50/50 dark:bg-zinc-800/15 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-foreground">{session.difficulty} {session.role}</span>
                      <span className={session.score >= 80 ? "text-brand-success" : "text-brand-primary"}>
                        {session.score}%
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-500 line-clamp-2 leading-relaxed">{session.feedback}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active mock interview mode */}
      {sessionState === "active" && (
        <Card className="max-w-2xl mx-auto w-full mt-2 flex flex-col h-[520px] overflow-hidden">
          <CardHeader className="flex-grow-0 border-b border-card-border pb-3 mb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span>🗣️</span> Technical Mock Interview ({currentIdx + 1} / {questions.length})
            </CardTitle>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
              {role} • {difficulty}
            </span>
          </CardHeader>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex max-w-[85%] flex-col p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "INTERVIEWER"
                    ? "bg-white dark:bg-zinc-800/60 border border-card-border self-start"
                    : "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white self-end"
                }`}
              >
                <span className="font-bold text-[9px] opacity-60 mb-0.5 uppercase tracking-wide">
                  {msg.sender === "INTERVIEWER" ? "Interviewer" : "Candidate"}
                </span>
                <span>{msg.content}</span>
              </div>
            ))}

            {isLoading && (
              <div className="bg-white dark:bg-zinc-800/60 border border-card-border self-start p-3 rounded-2xl text-xs flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce delay-75" />
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce delay-150" />
                <span className="text-[10px] text-zinc-400">Evaluating transcripts...</span>
              </div>
            )}
          </div>

          {/* Input block */}
          <form onSubmit={handleSendAnswer} className="p-4 border-t border-card-border flex gap-2 flex-grow-0 bg-white/10 dark:bg-zinc-800/10">
            <input
              type="text"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Explain your approach and answer here..."
              disabled={isLoading}
              className="bg-white/40 dark:bg-bg-dark-surface/40 flex-1 px-4 py-2.5 text-xs rounded-xl border border-card-border outline-none focus:border-brand-primary"
            />
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {currentIdx === questions.length - 1 ? "Submit Interview" : "Send Answer"}
            </Button>
          </form>
        </Card>
      )}

      {/* Feedback mode */}
      {sessionState === "feedback" && (
        <Card className="max-w-2xl mx-auto w-full mt-4">
          <CardHeader>
            <CardTitle className="text-base font-bold">Interview Session Evaluation Report</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-card-border pb-6">
              <div className="h-28 w-28 rounded-full border-4 border-brand-success flex flex-col items-center justify-center font-black bg-brand-success/5 flex-shrink-0">
                <span className="text-3xl text-brand-success">{score}</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Score</span>
              </div>
              <div className="flex-1 flex flex-col gap-2 w-full">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Evaluation Result</h3>
                <p className="text-xs text-zinc-550 leading-relaxed">
                  {score >= 80
                    ? "Superb! You demonstrate excellent technical understanding and articulate your design decisions with clarity."
                    : "Good progress. You understand the foundational aspects, but focus on detailing implementation caveats."}
                </p>
                <ProgressBar value={score} className="mt-1" color={score >= 80 ? "success" : "primary"} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-foreground block mb-2">Interviewer Feedback</h4>
              <p className="p-3.5 rounded-xl border border-card-border bg-zinc-50/50 dark:bg-zinc-800/10 text-xs text-zinc-550 dark:text-zinc-350 leading-relaxed font-semibold">
                {feedback}
              </p>
            </div>

            <Button onClick={handleReset} className="w-full cursor-pointer">
              Practice Another Mock Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
