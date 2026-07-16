"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { onboardingSchema, changeEmailSchema, changePasswordSchema } from "@/lib/validation/profile";
import type { OnboardingInput, ChangeEmailInput, ChangePasswordInput } from "@/lib/validation/profile";
import { storageProvider } from "@/lib/storage";

// Helper to get active session user ID
async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Onboards the user by creating their UserProfile and updating their fullName
 */
export async function onboardUser(values: OnboardingInput) {
  try {
    const userId = await getAuthUserId();
    const validated = onboardingSchema.parse(values);

    // 1. Update User's display name
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: validated.fullName,
        name: validated.fullName,
      },
    });

    // Parse values to integers for database compatibility
    const graduationYearInt = validated.graduationYear ? parseInt(validated.graduationYear, 10) : null;
    const studyTargetInt = validated.studyTarget ? parseInt(validated.studyTarget, 10) : 30;

    // 2. Create or Update UserProfile
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        university: validated.university,
        degree: validated.degree,
        semester: validated.semester,
        skills: validated.skills,
        github: validated.github || null,
        linkedin: validated.linkedin || null,
        bio: validated.bio || null,
        major: validated.major || null,
        graduationYear: graduationYearInt,
        country: validated.country || null,
        city: validated.city || null,
        careerInterests: validated.careerInterests,
        languages: validated.languages,
        learningGoals: validated.learningGoals,
        studyTarget: studyTargetInt,
        careerPath: validated.careerPath || null,
      },
      update: {
        university: validated.university,
        degree: validated.degree,
        semester: validated.semester,
        skills: validated.skills,
        github: validated.github || null,
        linkedin: validated.linkedin || null,
        bio: validated.bio || null,
        major: validated.major || null,
        graduationYear: graduationYearInt,
        country: validated.country || null,
        city: validated.city || null,
        careerInterests: validated.careerInterests,
        languages: validated.languages,
        learningGoals: validated.learningGoals,
        studyTarget: studyTargetInt,
        careerPath: validated.careerPath || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to complete onboarding.";
    return { error: message };
  }
}

/**
 * Updates an already onboarded user's profile
 */
export async function updateProfile(values: OnboardingInput) {
  return onboardUser(values); // Re-uses identical validation and upsert logic
}

/**
 * Handles profile avatar upload safely
 */
export async function uploadAvatar(formData: FormData) {
  try {
    const userId = await getAuthUserId();
    const file = formData.get("avatar") as File | null;
    
    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file size (limit to 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: "File size exceeds the 2MB limit" };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Only JPEG, PNG, GIF, or WebP images are allowed" };
    }

    // Call storage provider abstraction
    const imagePath = await storageProvider.uploadFile(file, "uploads");

    // Update user image url
    await prisma.user.update({
      where: { id: userId },
      data: { image: imagePath },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, imagePath };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload avatar.";
    return { error: message };
  }
}

/**
 * Changes user's email address and resets emailVerified status
 */
export async function changeEmail(values: ChangeEmailInput) {
  try {
    const userId = await getAuthUserId();
    const validated = changeEmailSchema.parse(values);

    // Get current user details
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser || !currentUser.passwordHash) {
      return { error: "Authentication failed." };
    }

    // Verify current password matches
    const isPasswordValid = bcrypt.compareSync(validated.currentPassword, currentUser.passwordHash);
    if (!isPasswordValid) {
      return { error: "Incorrect current password." };
    }

    // Check if new email is already in use
    const emailExists = await prisma.user.findUnique({
      where: { email: validated.newEmail },
    });

    if (emailExists && emailExists.id !== userId) {
      return { error: "Email is already in use by another account." };
    }

    // Update email and reset verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: validated.newEmail,
        emailVerified: null, // Reset verification
      },
    });

    // Create verification token for email verification
    const tokenStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email: validated.newEmail,
        token: tokenStr,
        expires,
      },
    });

    console.log(`[Verification] Email verification token generated for updated email ${validated.newEmail}: ${tokenStr}`);

    revalidatePath("/settings");
    return { 
      success: true, 
      message: "Email updated successfully! A verification token has been logged.",
      verificationToken: tokenStr
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update email.";
    return { error: message };
  }
}

/**
 * Changes user's password hash
 */
export async function changePassword(values: ChangePasswordInput) {
  try {
    const userId = await getAuthUserId();
    const validated = changePasswordSchema.parse(values);

    // Get current user details
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser || !currentUser.passwordHash) {
      return { error: "Authentication failed." };
    }

    // Verify current password matches
    const isPasswordValid = bcrypt.compareSync(validated.currentPassword, currentUser.passwordHash);
    if (!isPasswordValid) {
      return { error: "Incorrect current password." };
    }

    // Hash new password
    const newPasswordHash = bcrypt.hashSync(validated.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true, message: "Password updated successfully!" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update password.";
    return { error: message };
  }
}
