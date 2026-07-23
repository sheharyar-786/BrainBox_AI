"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseFileText } from "@/lib/parser";
import { getAIProvider } from "@/lib/ai/provider";
import { cleanStringForDb, cleanDataForDb } from "@/lib/db-cleaner";

// Helper to authenticate user
async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Parses, extracts text, calls AI to analyze resume, and stores the results
 */
export async function analyzeResumeAction(formData: FormData) {
  try {
    const userId = await getAuthUserId();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return { error: "No resume file provided" };
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract text using the parser abstraction
    const extractedText = await parseFileText(buffer, file.name);

    if (!extractedText.trim()) {
      return { error: "Failed to extract text. Please ensure it is a valid document." };
    }

    // 2. Query AI to perform the ATS audit and evaluation
    const prompt = `
Analyze the following candidate resume text for ATS parsing compatibility, keyword density, and technical completeness.
Return a STRICT JSON response containing the following structure:
{
  "atsScore": number (0 to 100),
  "strengths": string[] (list of strengths),
  "weaknesses": string[] (list of weaknesses/gaps),
  "missingKeywords": string[] (list of standard tools/skills missing but expected for fullstack/software roles),
  "recommendations": string[] (list of actionable steps to optimize this CV)
}
Do not include any wrapping markdown formatting, extra comments, or code-block tags. Return ONLY the JSON object.

Resume text:
${extractedText.substring(0, 8000)}
`;

    const aiProvider = getAIProvider();
    const systemPrompt = "You are an ATS Resume Auditor. Analyze resume text and return structured JSON reports only.";
    
    const replyText = await aiProvider.generateText(prompt, systemPrompt);
    
    // Clean reply from markdown block wraps if present
    const cleanedJsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let analysis: {
      atsScore?: number;
      strengths?: string[];
      weaknesses?: string[];
      missingKeywords?: string[];
      recommendations?: string[];
    };
    try {
      analysis = JSON.parse(cleanedJsonStr) as {
        atsScore?: number;
        strengths?: string[];
        weaknesses?: string[];
        missingKeywords?: string[];
        recommendations?: string[];
      };
    } catch (parseErr) {
      console.error("Failed to parse AI response JSON:", cleanedJsonStr, parseErr);
      throw new Error("Failed to parse the AI analysis report. Please try again.");
    }

    const atsScore = Number(analysis.atsScore) || 70;
    const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
    const weaknesses = Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [];
    const missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [];
    const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];

    // 3. Save to database
    const resume = await prisma.resume.create({
      data: {
        userId,
        originalFile: cleanStringForDb(file.name),
        parsedText: cleanStringForDb(extractedText),
        atsScore,
        strengths: cleanDataForDb(strengths),
        weaknesses: cleanDataForDb(weaknesses),
        missingKeywords: cleanDataForDb(missingKeywords),
        recommendations: cleanDataForDb(recommendations)
      }
    });

    revalidatePath("/resume");
    revalidatePath("/dashboard");
    return { success: true, resume };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to analyze resume.";
    return { error: msg };
  }
}

/**
 * Gets the user's latest analyzed resume
 */
export async function getLatestResumeAction() {
  try {
    const userId = await getAuthUserId();
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, resume };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve resume.";
    return { error: msg };
  }
}
