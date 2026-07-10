"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterInput) => {
    console.log("Mock registration payload:", data);
    setIsLoading(true);
    setToast(null);

    // Mock registration handler
    setTimeout(() => {
      setIsLoading(false);
      setToast({ message: "Registration successful! Redirecting...", type: "success" });
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
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
        {/* Role Switcher */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Choose Your Role
          </label>
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-card-border">
            <button
              type="button"
              onClick={() => setValue("role", "STUDENT")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                selectedRole === "STUDENT"
                  ? "bg-white dark:bg-zinc-700 shadow text-foreground"
                  : "text-zinc-500 hover:text-zinc-750 dark:hover:text-zinc-350"
              }`}
            >
              Student / Seeker
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "MENTOR")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                selectedRole === "MENTOR"
                  ? "bg-white dark:bg-zinc-700 shadow text-foreground"
                  : "text-zinc-500 hover:text-zinc-750 dark:hover:text-zinc-350"
              }`}
            >
              Advisor / Mentor
            </button>
          </div>
          {errors.role?.message && (
            <span className="text-xs text-brand-accent font-medium">
              {errors.role.message}
            </span>
          )}
        </div>

        <Input
          label="Full Name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          placeholder="jane.doe@university.edu"
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

        <div className="relative">
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-[35px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-2 cursor-pointer">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
