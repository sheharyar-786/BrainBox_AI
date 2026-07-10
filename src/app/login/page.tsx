"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        description="Enter your credentials to access your CareerOS AI dashboard"
      >
        <LoginForm />

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 border-t border-card-border/60" />
          <span className="relative px-3 bg-card-bg text-[10px] uppercase font-bold text-zinc-400">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="flex items-center justify-center gap-2 py-2 border border-card-border rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer bg-white/10 dark:bg-bg-dark-surface/20 text-foreground"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            className="flex items-center justify-center gap-2 py-2 border border-card-border rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer bg-white/10 dark:bg-bg-dark-surface/20 text-foreground"
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
      </AuthCard>
    </AuthLayout>
  );
}
