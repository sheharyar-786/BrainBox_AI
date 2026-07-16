"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingFormFields, type OnboardingInput } from "@/lib/validation/profile";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  user: {
    fullName: string;
    email: string;
    image?: string | null;
  };
}

export function EditProfileModal({ isOpen, onClose, profile, user }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormFields>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user.fullName,
      university: profile?.university || "",
      degree: profile?.degree || "",
      semester: profile?.semester || "",
      major: profile?.major || "",
      graduationYear: profile?.graduationYear ? String(profile.graduationYear) : "",
      country: profile?.country || "",
      city: profile?.city || "",
      skills: profile?.skills || [],
      careerInterests: profile?.careerInterests || [],
      bio: profile?.bio || "",
      github: profile?.github || "",
      linkedin: profile?.linkedin || "",
      languages: profile?.languages || [],
      learningGoals: profile?.learningGoals || [],
      studyTarget: profile?.studyTarget ? String(profile.studyTarget) : "30",
      careerPath: profile?.careerPath || "",
    },
  });

  const selectedCareerPath = watch("careerPath");
  const selectedSkills = watch("skills") || [];
  const selectedInterests = watch("careerInterests") || [];
  const selectedLanguages = watch("languages") || [];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload immediately
    setIsUploading(true);
    setErrorMsg(null);
    
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    setIsUploading(false);

    if (result.error) {
      setErrorMsg(result.error);
    }
  };

  const toggleArrayItem = (field: "skills" | "careerInterests" | "languages" | "learningGoals", item: string) => {
    const current = watch(field) || [];
    if (current.includes(item)) {
      setValue(field, current.filter((x) => x !== item));
    } else {
      setValue(field, [...current, item]);
    }
  };

  const onSubmit = async (data: OnboardingFormFields) => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await updateProfile(data as OnboardingInput);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      onClose();
    }
  };

  const availableSkills = ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "SQL", "Git", "Next.js", "CI/CD"];
  const availableInterests = ["Web Development", "Cloud Architecture", "Machine Learning", "DevOps", "Cybersecurity", "Mobile Apps"];
  const availableLanguages = ["JavaScript", "TypeScript", "Python", "Go", "Java", "C++", "Rust", "Swift"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Student Profile">
      <div className="max-h-[75vh] overflow-y-auto pr-1">
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 border-b border-card-border pb-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border border-card-border bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-zinc-400 text-lg font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold">
                  Saving...
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
                className="text-[10px] text-zinc-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 file:cursor-pointer"
              />
              <span className="text-[9px] text-zinc-400 mt-1 block">Max size: 2MB. Types: JPEG, PNG, WebP</span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">Education Details</h4>
            <Input
              label="Full Name"
              placeholder="Your Name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <Input
              label="University"
              placeholder="Stanford University"
              error={errors.university?.message}
              {...register("university")}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Degree"
                placeholder="BS Computer Science"
                error={errors.degree?.message}
                {...register("degree")}
              />
              <Input
                label="Semester"
                placeholder="Semester 6"
                error={errors.semester?.message}
                {...register("semester")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Major"
                placeholder="Software Engineering"
                error={errors.major?.message}
                {...register("major")}
              />
              <Input
                label="Graduation Year"
                type="number"
                placeholder="2027"
                error={errors.graduationYear?.message}
                {...register("graduationYear")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Country"
                placeholder="United States"
                error={errors.country?.message}
                {...register("country")}
              />
              <Input
                label="City"
                placeholder="Palo Alto"
                error={errors.city?.message}
                {...register("city")}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="flex flex-col gap-5 border-t border-card-border pt-4">
            <h4 className="text-xs font-extrabold text-brand-secondary uppercase tracking-wider">Career & Skills</h4>
            
            {/* Career Path */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-2">Preferred Career Path</label>
              <div className="grid grid-cols-3 gap-2">
                {["Frontend", "Backend", "Fullstack", "AI Engineer", "Mobile"].map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => setValue("careerPath", path)}
                    className={`py-1.5 px-2 text-[10px] font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedCareerPath === path
                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                        : "border-card-border text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    {path}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-2">Programming Languages</label>
              <div className="flex flex-wrap gap-1.5">
                {availableLanguages.map((lang) => {
                  const active = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArrayItem("languages", lang)}
                      className={`px-2 py-0.5 text-[9px] font-semibold rounded-md border transition-colors cursor-pointer ${
                        active
                          ? "bg-brand-secondary/15 border-brand-secondary text-brand-secondary"
                          : "border-card-border text-zinc-400"
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-2">Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((sk) => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleArrayItem("skills", sk)}
                      className={`px-2 py-0.5 text-[9px] font-semibold rounded-md border transition-colors cursor-pointer ${
                        active
                          ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                          : "border-card-border text-zinc-400"
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Interests */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-2">Interests</label>
              <div className="flex flex-wrap gap-1.5">
                {availableInterests.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleArrayItem("careerInterests", interest)}
                      className={`px-2 py-0.5 text-[9px] font-semibold rounded-md border transition-colors cursor-pointer ${
                        active
                          ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                          : "border-card-border text-zinc-400"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Socials & Bio */}
          <div className="flex flex-col gap-4 border-t border-card-border pt-4">
            <h4 className="text-xs font-extrabold text-brand-accent uppercase tracking-wider">Social & Target</h4>
            <Input
              label="Daily Study Target (minutes)"
              type="number"
              placeholder="30"
              error={errors.studyTarget?.message}
              {...register("studyTarget")}
            />
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Biography</label>
              <textarea
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-card-border bg-white/10 dark:bg-bg-dark-surface/20 text-foreground focus:outline-none focus:border-brand-primary"
                {...register("bio")}
              />
              {errors.bio?.message && <p className="text-[10px] text-brand-accent mt-1">{errors.bio.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="GitHub Username"
                placeholder="github-profile"
                error={errors.github?.message}
                {...register("github")}
              />
              <Input
                label="LinkedIn Profile"
                placeholder="linkedin-profile"
                error={errors.linkedin?.message}
                {...register("linkedin")}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-card-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="w-1/2 cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="w-1/2 cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
