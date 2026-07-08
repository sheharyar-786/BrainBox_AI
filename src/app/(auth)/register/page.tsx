"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required.";
    if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsLoading(true);

      // Simulate a registration redirect
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light-base dark:bg-bg-dark-base px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Card className="w-full max-w-md shadow-2xl relative">
        {/* Header Logo */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-lg shadow-lg">
              C
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              CareerOS <span className="text-brand-primary">AI</span>
            </span>
          </Link>
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold">Create an Account</CardTitle>
          <p className="text-xs text-zinc-500 mt-1">Start organizing your studies and prep today</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Switcher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Choose Your Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-card-border">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${role === "STUDENT" ? "bg-white dark:bg-zinc-700 shadow text-foreground animate-none" : "text-zinc-500"}`}
                >
                  Student / Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole("MENTOR")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${role === "MENTOR" ? "bg-white dark:bg-zinc-700 shadow text-foreground animate-none" : "text-zinc-500"}`}
                >
                  Advisor / Mentor
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Email Address"
              placeholder="jane.doe@university.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Sign Up
            </Button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-primary font-semibold hover:text-brand-secondary">
              Log in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
