"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileViewProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    image?: string | null;
    role: string;
    createdAt: Date;
    emailVerified?: Date | null;
  };
  profile: {
    university?: string;
    degree?: string;
    semester?: string;
    major?: string | null;
    graduationYear?: number | null;
    country?: string | null;
    city?: string | null;
    skills?: string[];
    careerInterests?: string[];
    bio?: string | null;
    github?: string | null;
    linkedin?: string | null;
    languages?: string[];
    learningGoals?: string[];
    studyTarget?: number;
    careerPath?: string | null;
  } | null;
  stats: {
    gpa: string;
    readiness: number;
  };
}

export function ProfileView({ user, profile, stats }: ProfileViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isVerified = !!user.emailVerified;

  const displayRole = user.role.charAt(0) + user.role.slice(1).toLowerCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-xs text-zinc-500">Review education history, skills pool, and placement badges.</p>
        </div>
        <Button onClick={() => setIsEditOpen(true)} size="sm" className="cursor-pointer">
          ✏️ Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: User Main Card */}
        <div className="flex flex-col gap-6">
          <Card className="text-center flex flex-col items-center justify-center p-6 gap-4">
            <Avatar name={user.fullName} src={user.image ?? undefined} size="lg" className="mb-2" />
            <div>
              <h2 className="text-base font-bold text-foreground">{user.fullName}</h2>
              <p className="text-xs text-zinc-500">{displayRole} • {profile?.major || "Software Engineering"}</p>
              <p className="text-[10px] text-zinc-400">{user.email}</p>
            </div>

            {/* Email verification status badge */}
            <div className="flex items-center gap-1.5 justify-center">
              <span className={`inline-block h-2 w-2 rounded-full ${isVerified ? "bg-brand-success" : "bg-brand-warning"}`} />
              <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                {isVerified ? "Verified Account" : "Pending Verification"}
              </span>
            </div>

            <div className="w-full border-t border-card-border pt-4 grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">GPA</p>
                <p className="text-base font-bold text-brand-primary">{stats.gpa}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Readiness</p>
                <p className="text-base font-bold text-brand-success">{stats.readiness}%</p>
              </div>
            </div>
          </Card>

          {/* Social Profiles & Target Info */}
          <Card className="flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-foreground">Preferences</h3>
              <p className="text-[9px] text-zinc-500">Targets and settings configured during onboarding.</p>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-card-border pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Daily Study Target:</span>
                <span className="font-bold text-foreground">{profile?.studyTarget || 30} mins</span>
              </div>
              {profile?.careerPath && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Career Track:</span>
                  <span className="font-bold text-brand-primary">{profile.careerPath}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Joined Platform:</span>
                <span className="font-bold text-foreground">{joinDate}</span>
              </div>
            </div>

            {/* Social Links */}
            {(profile?.github || profile?.linkedin) && (
              <div className="flex flex-col gap-2 border-t border-card-border pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Social Accounts</span>
                <div className="flex flex-col gap-1.5">
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-primary hover:text-brand-secondary font-semibold truncate flex items-center gap-1.5"
                    >
                      💻 github.com/{profile.github}
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-secondary hover:text-brand-primary font-semibold truncate flex items-center gap-1.5"
                    >
                      💼 linkedin.com/in/{profile.linkedin}
                    </a>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Academic Details & Interests */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Bio Description */}
          {profile?.bio && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Biography</CardTitle>
              </CardHeader>
              <CardContent className="mt-1">
                <p className="text-xs text-foreground leading-relaxed italic">&quot;{profile.bio}&quot;</p>
              </CardContent>
            </Card>
          )}

          {/* Education Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Education Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">University</span>
                <p className="text-xs font-bold text-foreground">{profile?.university || "Not provided"}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Degree Program</span>
                <p className="text-xs font-bold text-foreground">{profile?.degree || "Not provided"}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Semester / Cohort</span>
                <p className="text-xs font-bold text-foreground">{profile?.semester || "Not provided"}</p>
              </div>
              {profile?.graduationYear && (
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Graduation Year</span>
                  <p className="text-xs font-bold text-foreground">{profile.graduationYear}</p>
                </div>
              )}
              {(profile?.city || profile?.country) && (
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Location</span>
                  <p className="text-xs font-bold text-foreground">
                    {profile.city ? `${profile.city}, ` : ""}{profile.country || ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Programming Languages & Skills Pool */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-2">
              {/* Languages */}
              {profile?.languages && profile.languages.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block mb-1.5">LANGUAGES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-2.5 py-0.5 rounded bg-brand-secondary/10 border border-brand-secondary/20 text-[10px] font-semibold text-brand-secondary"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="border-t border-card-border pt-3">
                  <span className="text-[10px] font-bold text-zinc-500 block mb-1.5">TECHNICAL SKILLS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-semibold text-brand-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Interests */}
              {profile?.careerInterests && profile.careerInterests.length > 0 && (
                <div className="border-t border-card-border pt-3">
                  <span className="text-[10px] font-bold text-zinc-500 block mb-1.5">AREAS OF INTEREST</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.careerInterests.map((interest: string) => (
                      <span
                        key={interest}
                        className="px-2.5 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-semibold text-brand-accent"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Goals */}
          {profile?.learningGoals && profile.learningGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Onboarding Learning Goals</CardTitle>
              </CardHeader>
              <CardContent className="mt-2">
                <ul className="flex flex-col gap-2.5">
                  {profile.learningGoals.map((goal: string) => (
                    <li key={goal} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-350">
                      <span className="h-4 w-4 bg-brand-success/15 text-brand-success rounded-full flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
          user={{
            fullName: user.fullName,
            email: user.email,
            image: user.image,
          }}
        />
      )}
    </div>
  );
}
