import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-2xl relative border border-card-border/80 bg-white/60 dark:bg-bg-dark-surface/60 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground font-display">{title}</CardTitle>
        {description && (
          <p className="text-xs text-zinc-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="mt-4">
        {children}
      </CardContent>
    </Card>
  );
}
