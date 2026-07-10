"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@/lib/validation/auth";
import { type LoginInput, type RegisterInput, type ForgotPasswordInput } from "@/lib/validation/auth";

// Error utility helper
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// 1. Login Action
export async function loginAction(values: LoginInput) {
  try {
    const validated = loginSchema.parse(values);
    
    // Call NextAuth signIn
    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please try again." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    return { error: getErrorMessage(error) };
  }
}

// 2. Register Action
export async function registerAction(values: RegisterInput) {
  try {
    const validated = registerSchema.parse(values);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: "Email is already registered." };
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(validated.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        fullName: validated.name,
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
      },
    });

    // Create a verification token for email verification
    const tokenStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email: validated.email,
        token: tokenStr,
        expires,
      },
    });

    console.log(`[Verification] Email verification token generated for ${validated.email}: ${tokenStr}`);

    return { 
      success: true, 
      message: "Account created! A verification link has been generated.",
      verificationToken: tokenStr
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// 3. Verify Email Action
export async function verifyEmailAction(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { error: "Invalid verification token." };
    }

    const hasExpired = new Date() > verificationToken.expires;
    if (hasExpired) {
      await prisma.verificationToken.delete({ where: { token } });
      return { error: "Verification token has expired." };
    }

    // Update user's emailVerified status
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Clean up used token
    await prisma.verificationToken.delete({ where: { token } });

    return { success: true, message: "Email verified successfully!" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// 4. Forgot Password Action
export async function forgotPasswordAction(values: ForgotPasswordInput) {
  try {
    const validated = forgotPasswordSchema.parse(values);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: true, message: "If the email exists, a reset link has been sent." };
    }

    // Create reset token
    const tokenStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.deleteMany({
      where: { email: validated.email },
    });

    await prisma.passwordResetToken.create({
      data: {
        email: validated.email,
        token: tokenStr,
        expires,
      },
    });

    console.log(`[Reset Password] Reset token generated for ${validated.email}: ${tokenStr}`);

    return { 
      success: true, 
      message: "If the email exists, a reset link has been sent.",
      resetToken: tokenStr
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// 5. Reset Password Action
export async function resetPasswordAction(token: string, passwordHashInput: string) {
  try {
    if (passwordHashInput.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { error: "Invalid password reset token." };
    }

    const hasExpired = new Date() > resetToken.expires;
    if (hasExpired) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return { error: "Password reset token has expired." };
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(passwordHashInput, 10);

    // Update user's password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // Clean up token
    await prisma.passwordResetToken.delete({ where: { token } });

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
