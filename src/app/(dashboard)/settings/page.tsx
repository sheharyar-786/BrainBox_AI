"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("sk-gemini-••••••••••••••••");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-xs text-zinc-550">Configure platform layout options, notifications preferences, and keys.</p>
      </div>

      <div className="max-w-2xl w-full flex flex-col gap-6 mt-2">
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
                className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer border border-card-border ${emailAlerts ? "bg-brand-primary" : "bg-zinc-200 dark:bg-zinc-800"}`}
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
                className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer border border-card-border ${reviewAlerts ? "bg-brand-primary" : "bg-zinc-200 dark:bg-zinc-800"}`}
              >
                <span className={`block w-4.5 h-4.5 bg-white rounded-full transform transition-transform duration-200 ${reviewAlerts ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Developer Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Developer API Keys</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 mt-2">
            <Input
              label="Gemini API Token"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              helperText="Required for custom LLM tutor completions and project evaluations."
            />
            <Button size="sm" className="w-fit self-end cursor-pointer">
              Save Keys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
