"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { onboardingSchema, type OnboardingFormFields, type OnboardingInput } from "@/lib/validation/profile";
import { onboardUser } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OnboardingWizardProps {
  initialData: {
    fullName: string;
    email: string;
  };
}

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormFields>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: initialData.fullName,
      university: "",
      degree: "",
      semester: "",
      major: "",
      graduationYear: "",
      country: "",
      city: "",
      skills: [],
      careerInterests: [],
      bio: "",
      github: "",
      linkedin: "",
      languages: [],
      learningGoals: [],
      studyTarget: "30",
      careerPath: "",
    },
  });

  const selectedCareerPath = watch("careerPath");
  const selectedSkills = watch("skills") || [];
  const selectedInterests = watch("careerInterests") || [];
  const selectedLanguages = watch("languages") || [];
  const selectedGoals = watch("learningGoals") || [];

  const handleNext = async () => {
    // Validate only current step fields
    let fieldsToValidate: Array<keyof OnboardingFormFields> = [];
    if (step === 1) {
      fieldsToValidate = ["fullName", "university", "degree", "semester", "major", "graduationYear", "country", "city"];
    } else if (step === 2) {
      fieldsToValidate = ["careerPath", "skills", "careerInterests", "languages", "learningGoals"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
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
    const result = await onboardUser(data as OnboardingInput);
    setIsLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const availableSkills = ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "SQL", "Git", "CI/CD", "Next.js"];
  const availableInterests = ["Web Development", "Cloud Architecture", "Machine Learning", "DevOps", "Cybersecurity", "Mobile Apps"];
  const availableLanguages = ["JavaScript", "TypeScript", "Python", "Go", "Java", "C++", "Rust", "Swift"];
  const availableGoals = ["Ace technical interviews", "Build portfolio projects", "Master system design", "Learn cloud deployment", "Strengthen DS & Algorithms"];

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-8">
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <span
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                {s}
              </span>
              <span className={`text-xs font-bold ${step === s ? "text-foreground" : "text-zinc-400"} hidden sm:inline`}>
                {s === 1 ? "Academic" : s === 2 ? "Interests" : "Preferences"}
              </span>
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 mx-4 ${step > s ? "bg-brand-primary" : "bg-zinc-100 dark:bg-zinc-800"}`} />}
          </React.Fragment>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Academic & Location */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold">Academic & Personal Info</CardTitle>
              <p className="text-[10px] text-zinc-500">Provide details about your university education and location.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-2">
              <Input
                label="Full Name"
                placeholder="Your Full Name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <Input
                label="University"
                placeholder="e.g. Stanford University"
                error={errors.university?.message}
                {...register("university")}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Degree"
                  placeholder="e.g. BS Computer Science"
                  error={errors.degree?.message}
                  {...register("degree")}
                />
                <Input
                  label="Semester"
                  placeholder="e.g. Fall 2026 / Semester 6"
                  error={errors.semester?.message}
                  {...register("semester")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Major (Optional)"
                  placeholder="e.g. Software Engineering"
                  error={errors.major?.message}
                  {...register("major")}
                />
                <Input
                  label="Graduation Year (Optional)"
                  type="number"
                  placeholder="e.g. 2027"
                  error={errors.graduationYear?.message}
                  {...register("graduationYear")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Country (Optional)"
                  placeholder="e.g. United States"
                  error={errors.country?.message}
                  {...register("country")}
                />
                <Input
                  label="City (Optional)"
                  placeholder="e.g. Palo Alto"
                  error={errors.city?.message}
                  {...register("city")}
                />
              </div>
              <Button type="button" onClick={handleNext} className="w-full mt-4 cursor-pointer">
                Continue to Interests
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Skills & Career Path */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold">Career Focus & Skills</CardTitle>
              <p className="text-[10px] text-zinc-500">Pick your path, selected languages, and skills pool.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 mt-2">
              {/* Career Path Selection */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Preferred Career Path</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Frontend", "Backend", "Fullstack", "AI Engineer", "Mobile"].map((path) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => setValue("careerPath", path)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors cursor-pointer ${
                        selectedCareerPath === path
                          ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                          : "border-card-border bg-white/10 dark:bg-bg-dark-surface/20 text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      {path}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Languages */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Languages you code in</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableLanguages.map((lang) => {
                    const active = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem("languages", lang)}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? "bg-brand-secondary/15 border-brand-secondary text-brand-secondary"
                            : "border-card-border bg-transparent text-zinc-400"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Selector */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Skills Pool</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map((sk) => {
                    const active = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleArrayItem("skills", sk)}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                            : "border-card-border bg-transparent text-zinc-400"
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
                <label className="text-xs font-bold text-foreground block mb-2">Areas of Interest</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableInterests.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleArrayItem("careerInterests", interest)}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                            : "border-card-border bg-transparent text-zinc-400"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button type="button" variant="secondary" onClick={handleBack} className="w-1/3 cursor-pointer">
                  Back
                </Button>
                <Button type="button" onClick={handleNext} className="w-2/3 cursor-pointer">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Preferences & Socials */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-extrabold">Preferences & Profile</CardTitle>
              <p className="text-[10px] text-zinc-500">Finish your onboarding with goals, targets, and links.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-2">
              {/* Learning Goals */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Learning Goals</label>
                <div className="flex flex-col gap-1.5">
                  {availableGoals.map((goal) => {
                    const active = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleArrayItem("learningGoals", goal)}
                        className={`w-full text-left py-2 px-3 text-xs rounded-xl border transition-colors cursor-pointer flex items-center justify-between ${
                          active
                            ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary font-semibold"
                            : "border-card-border text-zinc-400"
                        }`}
                      >
                        <span>{goal}</span>
                        {active && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Study Target */}
              <Input
                label="Daily Study Target (minutes)"
                type="number"
                placeholder="30"
                error={errors.studyTarget?.message}
                {...register("studyTarget")}
              />

              {/* Short Bio */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Short Biography</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-card-border bg-white/10 dark:bg-bg-dark-surface/20 text-foreground focus:outline-none focus:border-brand-primary"
                  {...register("bio")}
                />
                {errors.bio?.message && <p className="text-[10px] text-brand-accent mt-1">{errors.bio.message}</p>}
              </div>

              {/* Social Profiles */}
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

              <div className="flex gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={handleBack} className="w-1/3 cursor-pointer">
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-2/3 cursor-pointer">
                  Complete Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
