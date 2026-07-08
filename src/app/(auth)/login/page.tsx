"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required.";
    if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsLoading(true);

      // Simulate a login and redirect to the dashboard
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
          <CardTitle className="text-lg font-bold">Welcome Back</CardTitle>
          <p className="text-xs text-zinc-500 mt-1">Enter your credentials to access your dashboard</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              placeholder="name@university.edu"
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
            <div className="flex justify-between items-center text-xs mt-1">
              <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                <input type="checkbox" className="rounded border-card-border" />
                Remember me
              </label>
              <span className="text-brand-primary font-semibold hover:text-brand-secondary cursor-pointer">
                Forgot password?
              </span>
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Log In
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-card-border" />
            <span className="relative px-3 bg-card-bg text-[10px] uppercase font-bold text-zinc-400">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 py-2 border border-card-border rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Google
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 py-2 border border-card-border rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              GitHub
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-primary font-semibold hover:text-brand-secondary">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
