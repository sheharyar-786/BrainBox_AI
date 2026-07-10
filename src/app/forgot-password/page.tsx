"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        description="Enter your email address and we will send you a recovery link"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
