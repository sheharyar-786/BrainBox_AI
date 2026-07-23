"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  sendMessageAction,
  getConversationsAction,
  getMessagesAction,
  deleteConversationAction,
} from "@/app/actions/ai-chat";
import { getStudyMaterialsAction } from "@/app/actions/ai-study";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
}

interface StudyMaterial {
  id: string;
  topic: string;
  summary: string;
  notes: string;
  flashcards: unknown; // Array of { front: string, back: string }
  quiz: unknown; // Array of { question: string, options: string[], answer: string }
}

export default function TutorPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I am your CareerOS AI Learning Mentor. Ask me any question about your notes, career plans, or let's generate study materials." },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"flashcards" | "quizzes">("flashcards");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic study materials states
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [activeMaterialId, setActiveMaterialId] = useState<string>("");

  // Flashcards state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    const result = await getConversationsAction();
    setIsLoadingConversations(false);
    if (result.success && result.conversations) {
      setConversations(result.conversations as unknown as Conversation[]);
    }
  };

  const loadStudyMaterials = async () => {
    const result = await getStudyMaterialsAction();
    if (result.success && result.materials) {
      setMaterials(result.materials as unknown as StudyMaterial[]);
      if (result.materials.length > 0) {
        setActiveMaterialId(result.materials[0].id);
      }
    }
  };

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    setIsLoading(true);
    setErrorMsg(null);
    const result = await getMessagesAction(id);
    setIsLoading(false);
    if (result.success && result.messages) {
      setMessages(result.messages as unknown as ChatMessage[]);
    } else {
      setErrorMsg(result.error || "Failed to load messages.");
    }
  };

  // Load conversations & study materials on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversations().catch(console.error);
      loadStudyMaterials().catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setMessages([
      { role: "assistant", content: "Hello! I am your CareerOS AI Learning Mentor. Ask me any question about your notes, career plans, or let's generate study materials." },
    ]);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;
    const result = await deleteConversationAction(id);
    if (result.success) {
      if (activeConversationId === id) {
        handleStartNewChat();
      }
      loadConversations();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setErrorMsg(null);

    // Optimistically append user message
    const optimisticMsg: ChatMessage = { role: "user", content: userText };
    setMessages((prev) => [...prev, optimisticMsg]);
    setIsLoading(true);

    const result = await sendMessageAction(userText, activeConversationId || undefined);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
      setMessages((prev) => prev.slice(0, -1)); // Remove optimistic msg
    } else if (result.success && result.replyText && result.conversationId) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.replyText! }]);
      if (!activeConversationId) {
        setActiveConversationId(result.conversationId);
        loadConversations();
      }
    }
  };

  // Derive active deck
  const activeMaterial = materials.find((m) => m.id === activeMaterialId);

  const flashcards = (activeMaterial?.flashcards as Array<{ front: string; back: string }>) || [
    { front: "What is the 3rd Normal Form (3NF)?", back: "A table is in 3NF if it is in 2NF and has no transitive functional dependencies (non-prime attributes must only depend on the primary key)." },
    { front: "What is the primary difference between useEffect and useLayoutEffect?", back: "useEffect runs asynchronously after paint. useLayoutEffect runs synchronously before paint, blocking browser rendering." },
    { front: "What is an index in a database?", back: "A data structure that improves the speed of data retrieval operations on a table at the cost of additional writes and storage space." },
  ];

  const quizQuestions = (activeMaterial?.quiz as Array<{ question: string; options: string[]; answer: string }>) || [
    {
      question: "Which hook should be used to memoize the result of a computationally expensive operation in React?",
      options: ["useCallback", "useMemo", "useRef", "useState"],
      answer: "useMemo",
    }
  ];

  const resetQuiz = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    if (currentQuizIdx === quizQuestions.length - 1) {
      setCurrentQuizIdx(0);
      setQuizScore(0);
    }
  };

  // Synchronous reset helper called when deck selection changes
  const resetAllDeckStats = () => {
    setCurrentFlashcard(0);
    setIsFlipped(false);
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleQuizAnswer = (option: string) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);
    if (option === quizQuestions[currentQuizIdx].answer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split("```");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const lines = part.split("\n");
        const code = lines.slice(1).join("\n");
        return (
          <pre key={i} className="bg-zinc-950 p-3 rounded-xl text-zinc-100 font-mono text-[10px] overflow-x-auto my-2 border border-zinc-800 select-all">
            {code}
          </pre>
        );
      }
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: part
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/`(.*?)`/g, "<code class='bg-zinc-200/50 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-[10px]'>$1</code>")
              .replace(/\n/g, "<br />"),
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Tutor & Companion</h1>
        <p className="text-xs text-zinc-555">Review notes, query concepts, and study with AI-generated templates.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Chat Sidebar: History list of conversations */}
        <Card className="lg:col-span-1 h-[550px] flex flex-col p-4 gap-3 bg-white/20 dark:bg-zinc-800/10">
          <Button onClick={handleStartNewChat} size="sm" variant="glass" className="w-full text-xs cursor-pointer">
            ➕ New Session
          </Button>

          <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 mt-2 block">
            Chat History
          </span>

          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {isLoadingConversations ? (
              <span className="text-[10px] text-zinc-400">Loading chats...</span>
            ) : conversations.length === 0 ? (
              <span className="text-[10px] text-zinc-400">No chats yet.</span>
            ) : (
              conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectConversation(chat.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-[10px] font-semibold transition-colors flex items-center justify-between group group cursor-pointer ${
                    activeConversationId === chat.id
                      ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                      : "border-card-border bg-transparent text-zinc-450 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <span className="truncate mr-2">{chat.title}</span>
                  <span
                    onClick={(e) => handleDeleteConversation(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-brand-accent transition-opacity text-xs"
                  >
                    🗑️
                  </span>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat / Tutor Pane */}
        <Card className="lg:col-span-2 flex flex-col h-[550px] overflow-hidden">
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
                className={`flex max-w-[85%] flex-col p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white dark:bg-zinc-800/60 border border-card-border self-start"
                    : "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white self-end"
                }`}
              >
                <span className="font-bold text-[9px] opacity-60 mb-0.5 uppercase tracking-wide">
                  {msg.role === "assistant" ? "AI Mentor" : "You"}
                </span>
                <div className="whitespace-pre-line">{renderContent(msg.content)}</div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-white dark:bg-zinc-800/60 border border-card-border self-start p-3 rounded-2xl text-xs flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce delay-75" />
                <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce delay-150" />
                <span className="text-[10px] text-zinc-400">Thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border flex gap-2 flex-grow-0 bg-white/10 dark:bg-zinc-800/10">
            <Input
              placeholder="Ask about normal forms, react hooks, or mock interviews..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="bg-white/40 dark:bg-bg-dark-surface/40 flex-1"
            />
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              Send
            </Button>
          </form>
        </Card>

        {/* Study Tools Pane */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-[550px]">
          {/* Deck Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Practice Topic Deck</label>
            <select
              value={activeMaterialId}
              onChange={(e) => {
                setActiveMaterialId(e.target.value);
                resetAllDeckStats();
              }}
              className="w-full px-3 py-2 text-xs rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border outline-none text-foreground font-semibold"
            >
              {materials.length === 0 ? (
                <option value="">Default Deck (React / DB)</option>
              ) : (
                materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.topic}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Tabs header */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-card-border flex-grow-0">
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === "flashcards" ? "bg-white dark:bg-zinc-700 shadow text-foreground" : "text-zinc-500"}`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === "quizzes" ? "bg-white dark:bg-zinc-700 shadow text-foreground" : "text-zinc-500"}`}
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
                  <span className="absolute top-2 right-2 text-[9px] font-bold text-brand-primary uppercase tracking-wide opacity-50">
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
                      <p className="text-xs text-zinc-500 leading-relaxed px-4">
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
                    <span>Question {currentQuizIdx + 1} of {quizQuestions.length} (Score: {quizScore})</span>
                  </div>
                </CardHeader>

                <div className="flex-1 flex flex-col justify-center my-4 gap-4">
                  <p className="text-xs font-bold text-foreground leading-relaxed">
                    {quizQuestions[currentQuizIdx].question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {quizQuestions[currentQuizIdx].options.map((option: string) => {
                      let btnStyle = "border-card-border hover:bg-zinc-50 dark:hover:bg-zinc-800/40";
                      if (hasAnswered) {
                        if (option === quizQuestions[currentQuizIdx].answer) {
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
                  {hasAnswered && currentQuizIdx < quizQuestions.length - 1 && (
                    <Button size="sm" onClick={handleNextQuiz} className="cursor-pointer">
                      Next Question
                    </Button>
                  )}
                  {hasAnswered && currentQuizIdx === quizQuestions.length - 1 && (
                    <Button size="sm" onClick={resetQuiz} className="cursor-pointer">
                      Restart Quiz
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
