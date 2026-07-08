"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter Student",
      price: 0,
      desc: "Perfect for university students getting started with organizing notes and basics of mock interviews.",
      features: [
        "Up to 50MB library storage",
        "Generate 10 flashcard decks",
        "5 mock technical interviews / month",
        "Basic ATS Resume screening",
        "Community forum access",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Career Pro",
      price: isAnnual ? 12 : 15,
      desc: "Ideal for graduates, bootcamp students, and active job seekers aiming to land software engineering roles.",
      features: [
        "5GB library storage space",
        "Unlimited notes & flashcard generation",
        "Unlimited mock interviews & grading",
        "Deep ATS resume scorer & corrections",
        "Code quality repo analyzer (ZIPs)",
        "Interactive Knowledge Graph navigation",
      ],
      cta: "Start 7-Day Trial",
      popular: true,
    },
    {
      name: "Academic Institution",
      price: "Custom",
      desc: "Designed for universities, colleges, and bootcamp coordinators to monitor class progress and placement metrics.",
      features: [
        "Unlimited student workspace storage",
        "Custom domain integration",
        "Class progress dashboard for Mentors",
        "Detailed university placement analytics",
        "Custom API keys & LLM tuning controls",
        "Dedicated account support",
      ],
      cta: "Contact University Sales",
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center flex flex-col gap-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Subscription plans</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Flexible Pricing for Every Journey</h1>
          <p className="text-sm text-zinc-550 max-w-xl mx-auto">
            Choose the plan that fits your career preparation timeline. Switch or cancel at any time.
          </p>

          {/* Toggle switcher */}
          <div className="flex items-center gap-3 justify-center mt-6">
            <span className="text-xs font-semibold text-zinc-500">Monthly billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-11 h-6 bg-zinc-200 dark:bg-zinc-800 border border-card-border rounded-full p-0.5 cursor-pointer"
            >
              <span className={`block w-4.5 h-4.5 bg-brand-primary rounded-full transform transition-transform duration-200 ${isAnnual ? "translate-x-5" : ""}`} />
            </button>
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              Annual billing <span className="px-1.5 py-0.5 bg-brand-success/15 text-brand-success text-[10px] rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 w-full">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col relative ${plan.popular ? "border-brand-primary/50 ring-2 ring-brand-primary/10" : ""}`}
              hoverEffect
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <CardHeader className="flex-grow-0">
                <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-4">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                      <span className="text-xs text-zinc-550">/ month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-550 mt-2 leading-relaxed">{plan.desc}</p>
              </CardHeader>
              <CardContent className="flex-1 mt-6">
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-650 dark:text-zinc-350">
                      <svg className="h-4.5 w-4.5 text-brand-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-8 border-none pt-0">
                <Button variant={plan.popular ? "primary" : "secondary"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
