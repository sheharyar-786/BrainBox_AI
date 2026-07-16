"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validation/profile";
import type { ChangeEmailInput, ChangePasswordInput } from "@/lib/validation/profile";
import { changeEmail, changePassword } from "@/app/actions/profile";

interface SettingsTabsProps {
  initialEmail: string;
  keysConfigured: {
    gemini: boolean;
    openai: boolean;
  };
}

export function SettingsTabs({ initialEmail, keysConfigured }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<"visuals" | "security" | "keys">("visuals");
  
  // Notification states (saved in client state since they are visual preferences)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(false);

  // Security Toast States
  const [emailToast, setEmailToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [passToast, setPassToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPassLoading, setIsPassLoading] = useState(false);

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      currentPassword: "",
      newEmail: "",
    },
  });

  // Password form
  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = async (data: ChangeEmailInput) => {
    setIsEmailLoading(true);
    setEmailToast(null);
    const result = await changeEmail(data);
    setIsEmailLoading(false);

    if (result.error) {
      setEmailToast({ message: result.error, type: "error" });
    } else {
      setEmailToast({ message: result.message || "Email updated successfully!", type: "success" });
      resetEmail();
    }
  };

  const onPassSubmit = async (data: ChangePasswordInput) => {
    setIsPassLoading(true);
    setPassToast(null);
    const result = await changePassword(data);
    setIsPassLoading(false);

    if (result.error) {
      setToastWithAutoClose(setPassToast, { message: result.error, type: "error" });
    } else {
      setToastWithAutoClose(setPassToast, { message: result.message || "Password changed!", type: "success" });
      resetPass();
    }
  };

  const setToastWithAutoClose = (
    setFn: (value: { message: string; type: "success" | "error" } | null) => void,
    val: { message: string; type: "success" | "error" } | null
  ) => {
    setFn(val);
    setTimeout(() => setFn(null), 5000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full">
      {/* Tabs Selectors */}
      <div className="flex border-b border-card-border gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("visuals")}
          className={`pb-2 px-1 transition-colors cursor-pointer border-b-2 ${
            activeTab === "visuals"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-zinc-400 hover:text-foreground"
          }`}
        >
          Visuals & Alerts
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2 px-1 transition-colors cursor-pointer border-b-2 ${
            activeTab === "security"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-zinc-400 hover:text-foreground"
          }`}
        >
          Account Security
        </button>
        <button
          onClick={() => setActiveTab("keys")}
          className={`pb-2 px-1 transition-colors cursor-pointer border-b-2 ${
            activeTab === "keys"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-zinc-400 hover:text-foreground"
          }`}
        >
          Developer Keys
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex flex-col gap-6 mt-1">
        {/* Tab 1: Visuals & Alerts */}
        {activeTab === "visuals" && (
          <>
            {/* Visual Preference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Visual Themes</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4 mt-2">
                <div>
                  <h4 className="text-xs font-bold">Dark / Light Mode</h4>
                  <p className="text-[10px] text-zinc-500">Toggle dark mode visual layout interfaces.</p>
                </div>
                <ThemeToggle />
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Notification Prefs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold">Weekly Performance Emails</h4>
                    <p className="text-[10px] text-zinc-500">Get summary details on study hours and mock grades.</p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer border border-card-border ${
                      emailAlerts ? "bg-brand-primary" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span className={`block w-4.5 h-4.5 bg-white rounded-full transform transition-transform duration-200 ${emailAlerts ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-card-border pt-4">
                  <div>
                    <h4 className="text-xs font-bold">Revision Reminder Alerts</h4>
                    <p className="text-[10px] text-zinc-500">Get browser notifications when Leitner box review schedules expire.</p>
                  </div>
                  <button
                    onClick={() => setReviewAlerts(!reviewAlerts)}
                    className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer border border-card-border ${
                      reviewAlerts ? "bg-brand-primary" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span className={`block w-4.5 h-4.5 bg-white rounded-full transform transition-transform duration-200 ${reviewAlerts ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tab 2: Account Security */}
        {activeTab === "security" && (
          <>
            {/* Email Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Change Email Address</CardTitle>
                <p className="text-[10px] text-zinc-500">Current email: <span className="font-bold">{initialEmail}</span></p>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-4">
                {emailToast && (
                  <div
                    className={`p-3 rounded-xl border text-[11px] font-semibold ${
                      emailToast.type === "success"
                        ? "bg-brand-success/10 border-brand-success/30 text-brand-success"
                        : "bg-brand-accent/10 border-brand-accent/30 text-brand-accent"
                    }`}
                  >
                    {emailToast.message}
                  </div>
                )}
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="flex flex-col gap-4">
                  <Input
                    label="New Email Address"
                    placeholder="new.email@university.edu"
                    error={emailErrors.newEmail?.message}
                    {...registerEmail("newEmail")}
                  />
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    error={emailErrors.currentPassword?.message}
                    {...registerEmail("currentPassword")}
                  />
                  <Button type="submit" size="sm" isLoading={isEmailLoading} className="w-fit self-end cursor-pointer">
                    Change Email
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Change Account Password</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-4">
                {passToast && (
                  <div
                    className={`p-3 rounded-xl border text-[11px] font-semibold ${
                      passToast.type === "success"
                        ? "bg-brand-success/10 border-brand-success/30 text-brand-success"
                        : "bg-brand-accent/10 border-brand-accent/30 text-brand-accent"
                    }`}
                  >
                    {passToast.message}
                  </div>
                )}
                <form onSubmit={handlePassSubmit(onPassSubmit)} className="flex flex-col gap-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    error={passErrors.currentPassword?.message}
                    {...registerPass("currentPassword")}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      error={passErrors.newPassword?.message}
                      {...registerPass("newPassword")}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      error={passErrors.confirmPassword?.message}
                      {...registerPass("confirmPassword")}
                    />
                  </div>
                  <Button type="submit" size="sm" isLoading={isPassLoading} className="w-fit self-end cursor-pointer">
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tab 3: Developer Keys */}
        {activeTab === "keys" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">AI Provider System Keys</CardTitle>
              <p className="text-[10px] text-zinc-500">Security notice: API keys are defined server-side inside your environment configuration variables (`.env`) to ensure maximum protection.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between border-b border-card-border pb-3">
                  <div>
                    <h5 className="text-xs font-bold">Gemini API Key</h5>
                    <p className="text-[9px] text-zinc-500">Required for custom tutor chat, notes queries, and roadmap generation.</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold tracking-wider ${
                      keysConfigured.gemini
                        ? "bg-brand-success/10 border border-brand-success/30 text-brand-success"
                        : "bg-brand-warning/10 border border-brand-warning/30 text-brand-warning"
                    }`}
                  >
                    {keysConfigured.gemini ? "Active / Configured" : "Not Set"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h5 className="text-xs font-bold">OpenAI API Key</h5>
                    <p className="text-[9px] text-zinc-500">Optional key for custom GPT fallback completions.</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold tracking-wider ${
                      keysConfigured.openai
                        ? "bg-brand-success/10 border border-brand-success/30 text-brand-success"
                        : "bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {keysConfigured.openai ? "Active / Configured" : "Optional"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
