"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TutorPage() {
  const [messages, setMessages] = useState([
    { sender: "AI", content: "Hello John! I am your CareerOS AI Learning Mentor. Ask me any question about your notes or study guides, or let's generate quizzes and flashcards." },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"flashcards" | "quizzes">("flashcards");

  // Flashcards state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flashcards = [
    { front: "What is the 3rd Normal Form (3NF)?", back: "A table is in 3NF if it is in 2NF and has no transitive functional dependencies (non-prime attributes must only depend on the primary key)." },
    { front: "What is the primary difference between useEffect and useLayoutEffect?", back: "useEffect runs asynchronously after paint. useLayoutEffect runs synchronously before paint, blocking browser rendering." },
    { front: "What is an index in a database?", back: "A data structure that improves the speed of data retrieval operations on a table at the cost of additional writes and storage space." },
  ];

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const quiz = {
    question: "Which hook should be used to memoize the result of a computationally expensive operation in React?",
    options: ["useCallback", "useMemo", "useRef", "useState"],
    answer: "useMemo",
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: "USER", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response after 1 sec
    setTimeout(() => {
      let replyContent = "That's an interesting question! Based on your uploaded class notes, we discuss this concept in detail under the Database Normalization slide.";
      if (inputValue.toLowerCase().includes("normal")) {
        replyContent = "Normalization organizes tables to reduce duplication. 1NF removes repeating groups, 2NF removes partial dependencies, and 3NF removes transitive dependencies.";
      } else if (inputValue.toLowerCase().includes("hook") || inputValue.toLowerCase().includes("react")) {
        replyContent = "React hooks let you use state and lifecycle features in functional components. Custom hooks can package reusable stateful logic.";
      }
      setMessages((prev) => [...prev, { sender: "AI", content: replyContent }]);
    }, 800);
  };

  const handleQuizAnswer = (option: string) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);
    if (option === quiz.answer) {
      setQuizScore(quizScore + 1);
    }
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setHasAnswered(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Tutor & Companion</h1>
        <p className="text-xs text-zinc-550">Review notes, query concepts, and study with AI-generated templates.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Chat / Tutor Pane */}
        <Card className="lg:col-span-3 flex flex-col h-[550px] overflow-hidden">
          <CardHeader className="flex-grow-0 border-b border-card-border pb-3 mb-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span>🤖</span> AI Mentor Session
            </CardTitle>
          </CardHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex max-w-[80%] flex-col p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === "AI" ? "bg-white dark:bg-zinc-800/60 border border-card-border self-start" : "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white self-end"}`}
              >
                <span className="font-bold text-[10px] opacity-60 mb-0.5 uppercase tracking-wide">
                  {msg.sender === "AI" ? "AI Mentor" : "You"}
                </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border flex gap-2 flex-grow-0 bg-white/10">
            <Input
              placeholder="Ask about normal forms, react hooks, or mock interviews..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-white/40 dark:bg-bg-dark-surface/40"
            />
            <Button type="submit" className="cursor-pointer">
              Send
            </Button>
          </form>
        </Card>

        {/* Study Tools Pane */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-[550px]">
          {/* Tabs header */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-card-border flex-grow-0">
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === "flashcards" ? "bg-white dark:bg-zinc-700 shadow text-foreground animate-none" : "text-zinc-500"}`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === "quizzes" ? "bg-white dark:bg-zinc-700 shadow text-foreground animate-none" : "text-zinc-500"}`}
            >
              Quiz Practice
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "flashcards" && (
              <Card className="h-full flex flex-col justify-between p-6">
                <CardHeader className="p-0 flex-grow-0 mb-0">
                  <div className="flex justify-between items-center text-xs text-zinc-400 font-semibold">
                    <span>Flashcard Deck</span>
                    <span>{currentFlashcard + 1} / {flashcards.length}</span>
                  </div>
                </CardHeader>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-card-border/85 rounded-2xl my-6 bg-white/20 dark:bg-zinc-800/20 cursor-pointer select-none relative overflow-hidden transition-all duration-300 hover:border-brand-primary/40 text-center"
                >
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-brand-primary uppercase tracking-wide opacity-50">
                    Click to Flip
                  </span>
                  {!isFlipped ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Front</span>
                      <p className="text-sm font-bold text-foreground leading-relaxed px-4">
                        {flashcards[currentFlashcard].front}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Back</span>
                      <p className="text-xs text-zinc-550 leading-relaxed px-4">
                        {flashcards[currentFlashcard].back}
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center flex-grow-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentFlashcard === 0}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentFlashcard(currentFlashcard - 1);
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentFlashcard === flashcards.length - 1}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentFlashcard(currentFlashcard + 1);
                    }}
                  >
                    Next Card
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "quizzes" && (
              <Card className="h-full flex flex-col justify-between p-6">
                <CardHeader className="p-0 flex-grow-0 mb-0">
                  <div className="flex justify-between items-center text-xs text-zinc-400 font-semibold">
                    <span>Quiz Mode</span>
                    <span>Total Score: {quizScore}</span>
                  </div>
                </CardHeader>

                <div className="flex-1 flex flex-col justify-center my-4 gap-4">
                  <p className="text-xs font-bold text-foreground leading-relaxed">
                    {quiz.question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {quiz.options.map((option) => {
                      let btnStyle = "border-card-border hover:bg-zinc-50 dark:hover:bg-zinc-800/40";
                      if (hasAnswered) {
                        if (option === quiz.answer) {
                          btnStyle = "border-brand-success/50 bg-brand-success/10 text-brand-success";
                        } else if (option === selectedOption) {
                          btnStyle = "border-brand-accent/50 bg-brand-accent/10 text-brand-accent";
                        }
                      }
                      return (
                        <button
                          key={option}
                          disabled={hasAnswered}
                          onClick={() => handleQuizAnswer(option)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 text-left cursor-pointer ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end flex-grow-0">
                  {hasAnswered && (
                    <Button size="sm" onClick={resetQuiz}>
                      Try Again
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
