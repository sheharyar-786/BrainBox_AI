"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { resetPasswordAction } from "@/app/actions/auth";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setToast({ message: "Reset token is missing in URL.", type: "error" });
      return;
    }

    setIsLoading(true);
    setToast(null);

    const result = await resetPasswordAction(token, data.password);

    setIsLoading(false);
    if (result.error) {
      setToast({ message: result.error, type: "error" });
    } else {
      setToast({ message: "Password updated successfully! Redirecting to login...", type: "success" });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
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

      {!token ? (
        <div className="text-center text-xs text-brand-accent font-semibold p-4 border border-brand-accent/20 rounded-xl bg-brand-accent/5">
          Invalid or missing reset token. Please request a new password recovery link.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              label="New Password"
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

          <div className="relative">
            <Input
              label="Confirm New Password"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-[35px] text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-2 cursor-pointer">
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-zinc-400">Loading form...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
