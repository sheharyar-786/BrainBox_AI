"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Set New Password"
        description="Choose a secure and unique password for your account"
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
