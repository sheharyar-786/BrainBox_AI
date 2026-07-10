"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { loginAction, verifyEmailAction } from "@/app/actions/auth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const verifiedParam = searchParams.get("verified");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailParam || "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setToast(null);

    const result = await loginAction(data);

    setIsLoading(false);
    if (result.error) {
      setToast({ message: result.error, type: "error" });
    } else {
      setToast({ message: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    }
  };

  const handleVerifyEmail = async () => {
    if (!tokenParam) return;
    setIsVerifying(true);
    setToast(null);
    const result = await verifyEmailAction(tokenParam);
    setIsVerifying(false);
    if (result.error) {
      setToast({ message: result.error, type: "error" });
    } else {
      setToast({ message: result.message || "Email verified! You can now log in.", type: "success" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert Placeholder */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-brand-success/10 border-brand-success/30 text-brand-success"
              : "bg-brand-accent/10 border-brand-accent/30 text-brand-accent"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Verification Warning Alert */}
      {verifiedParam === "false" && tokenParam && (
        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs font-semibold flex flex-col gap-2">
          <span>Your email is not verified yet. Please click the button below to verify.</span>
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={isVerifying}
            className="w-full py-1.5 px-3 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? "Verifying..." : "Verify Email Now"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          placeholder="name@university.edu"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-[35px] text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>

        <div className="flex justify-between items-center text-xs mt-1">
          <label className="flex items-center gap-2 text-zinc-500 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-card-border"
              {...register("rememberMe")}
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-brand-primary font-semibold hover:text-brand-secondary">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-2 cursor-pointer">
          Log In
        </Button>
      </form>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-zinc-400">Loading form...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
