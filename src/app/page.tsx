"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const steps = [
    { num: "01", title: "Organize & Learn", desc: "Upload notes, assignments, books, and PDFs into your secure learning library. Get instant AI summaries and answers." },
    { num: "02", title: "Practice & Test", desc: "Generate flashcards and multiple-choice quizzes automatically from your notes to identify weak knowledge areas." },
    { num: "03", title: "Build Portfolio", desc: "Upload code files and projects. Receive modular critiques on architecture, security, and scalability." },
    { num: "04", title: "Mock Interview", desc: "Conduct domain-specific technical interviews. Get assessed on communication, quality, and accuracy." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          {/* Radial backdrop light spot */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6 max-w-4xl"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
            >
              ✨ Your AI-Powered Learning & Career Companion
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none"
            >
              Optimize Your Path From{" "}
              <span className="gradient-text">Student to Professional</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-md sm:text-lg text-zinc-550 leading-relaxed max-w-2xl"
            >
              CareerOS AI is the ultimate mentor platform. Centralize notes, evaluate project code, parse ATS resume layouts, practice mock interviews, and build dynamic career roadmaps.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-2">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Interactive Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 50 }}
            className="w-full max-w-5xl mt-8 rounded-2xl glass-effect p-3 bg-card-bg border-card-border shadow-2xl relative overflow-hidden"
          >
            {/* Top Bar Decoration */}
            <div className="h-6 flex items-center gap-1.5 px-2 border-b border-card-border/80 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-zinc-400 font-semibold ml-2 select-none">
                careeros-ai-dashboard-preview.app
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
              <div className="glass-effect p-4 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-primary">Study Streak</span>
                <span className="text-3xl font-black text-foreground">🔥 14 Days</span>
                <span className="text-[10px] text-zinc-400">Keep it up! Next goal: 21 days milestone.</span>
              </div>
              <div className="glass-effect p-4 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-secondary">Mock Interviews</span>
                <span className="text-3xl font-black text-foreground">📈 84%</span>
                <span className="text-[10px] text-zinc-400">Average readiness score. Target: 90%+.</span>
              </div>
              <div className="glass-effect p-4 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-brand-success">Library Files</span>
                <span className="text-3xl font-black text-foreground">📁 32 Notes</span>
                <span className="text-[10px] text-zinc-400">24 concept tags mapped on Knowledge Graph.</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Value Loops Section */}
        <section className="bg-zinc-50 dark:bg-bg-dark-surface/30 border-y border-card-border py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="text-center flex flex-col gap-3">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Structured Path to Landing Internships & Jobs</h2>
              <p className="text-sm text-zinc-550 max-w-xl mx-auto">
                No chatbots. Just structured loops that accompany your academic learning and professional growth step-by-step.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <Card key={step.num} hoverEffect>
                  <CardHeader>
                    <span className="text-3xl font-black text-brand-primary/20">{step.num}</span>
                    <CardTitle className="text-base font-bold mt-1">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-zinc-550 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto relative overflow-hidden flex flex-col items-center gap-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-secondary/10 rounded-full blur-[90px] pointer-events-none -z-10" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Start Building Your Future Career Today</h2>
          <p className="text-sm text-zinc-550 max-w-md leading-relaxed">
            Gain access to custom AI tutoring, resume builders, code analysis, and domain-specific interviews. Set up in less than 2 minutes.
          </p>
          <Link href="/register" className="mt-2">
            <Button size="lg">Get Started For Free</Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
