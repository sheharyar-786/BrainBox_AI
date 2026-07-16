import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be under 50 characters"),
  university: z.string().min(2, "University name is required"),
  degree: z.string().min(2, "Degree name is required"),
  semester: z.string().min(1, "Semester is required"),
  
  // Optional Onboarding & Personalization
  major: z.string().optional().or(z.literal("")),
  graduationYear: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  careerInterests: z.array(z.string()).default([]),
  bio: z.string().max(500, "Bio must be under 500 characters").optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  
  // Preferences
  languages: z.array(z.string()).default([]),
  learningGoals: z.array(z.string()).default([]),
  studyTarget: z.string().default("30"),
  careerPath: z.string().optional().or(z.literal("")),
});

export interface OnboardingFormFields {
  fullName: string;
  university: string;
  degree: string;
  semester: string;
  major?: string;
  graduationYear?: string;
  country?: string;
  city?: string;
  skills?: string[];
  careerInterests?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  languages?: string[];
  learningGoals?: string[];
  studyTarget?: string;
  careerPath?: string;
}

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const updateProfileSchema = onboardingSchema;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changeEmailSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newEmail: z.string().email("Invalid email address"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
