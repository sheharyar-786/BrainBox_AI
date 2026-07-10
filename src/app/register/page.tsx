"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create an Account"
        description="Join CareerOS AI to map notes, quiz weak areas, and practice mock sessions"
      >
        <RegisterForm />

        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-primary font-semibold hover:text-brand-secondary">
            Log in here
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
