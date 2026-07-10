"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { forgotPasswordAction } from "@/app/actions/auth";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setToast(null);

    const result = await forgotPasswordAction(data);

    setIsLoading(false);
    if (result.error) {
      setToast({ message: result.error, type: "error" });
    } else {
      let msg = result.message ?? "Recovery link sent successfully! Check your inbox.";
      if (result.resetToken) {
        msg += ` (Dev/Test link: /reset-password?token=${result.resetToken})`;
      }
      setToast({
        message: msg,
        type: "success",
      });
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          placeholder="name@university.edu"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2 cursor-pointer">
          Send Recovery Email
        </Button>
      </form>

      <div className="text-center text-xs mt-4">
        <Link href="/login" className="text-brand-primary font-semibold hover:text-brand-secondary">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
