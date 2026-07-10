"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginInput) => {
    setIsLoading(true);
    setToast(null);

    // Mock authentication handler
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate credential checks
      if (data.email === "john@example.com" && data.password === "password123") {
        setToast({ message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setToast({ message: "Invalid email or password (Try: john@example.com / password123)", type: "error" });
      }
    }, 1500);
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
            className="absolute right-3.5 top-[35px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
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
