"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { studyMaterialSchema } from "@/lib/validation/ai";
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

interface Flashcard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface StudyMaterialPayload {
  summary?: string;
  notes?: string;
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
}

/**
 * Generates comprehensive summaries, detailed notes, quizzes, and flashcard decks using AI
 */
export async function generateStudyMaterialAction(topic: string) {
  try {
    const userId = await getAuthUserId();

    // Zod validation
    studyMaterialSchema.parse({ topic });

    const prompt = `
Generate a comprehensive learning guide, flashcard deck, and quiz set for the following topic:
Topic: ${topic}

Return a STRICT JSON response containing the following structure:
{
  "summary": "Brief high-level summary paragraph of the topic.",
  "notes": "Detailed study guide explaining key concepts, syntax, and architecture.",
  "flashcards": [
    { "front": "Question/Term", "back": "Detailed answer/definition" },
    { "front": "Question/Term", "back": "Detailed answer/definition" },
    { "front": "Question/Term", "back": "Detailed answer/definition" }
  ],
  "quiz": [
    {
      "question": "Quiz Question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B"
    },
    {
      "question": "Quiz Question 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    },
    {
      "question": "Quiz Question 3?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option C"
    }
  ]
}
Do not include any wrapping markdown formatting, extra comments, or code-block tags. Return ONLY the JSON object.
`;

    const aiProvider = getAIProvider();
    const systemPrompt = "You are a Study Guide Generator. Create learning materials and return structured JSON reports only.";
    
    const replyText = await aiProvider.generateText(prompt, systemPrompt);
    const cleanedJsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();

    let material: StudyMaterialPayload;
    try {
      material = JSON.parse(cleanedJsonStr) as StudyMaterialPayload;
    } catch (parseErr) {
      console.error("Failed to parse AI study material JSON:", cleanedJsonStr, parseErr);
      throw new Error("Failed to parse the AI generated study guide. Please try again.");
    }

    // Save study material to the database
    const studyMaterial = await prisma.studyMaterial.create({
      data: {
        userId,
        topic: cleanStringForDb(topic),
        summary: cleanStringForDb(material.summary || "Summary generated."),
        notes: cleanStringForDb(material.notes || "Detailed notes generated."),
        flashcards: cleanDataForDb(material.flashcards || []) as unknown as Prisma.InputJsonValue,
        quiz: cleanDataForDb(material.quiz || []) as unknown as Prisma.InputJsonValue
      }
    });

    revalidatePath("/library");
    revalidatePath("/tutor");
    return { success: true, studyMaterial };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to generate study materials.";
    return { error: msg };
  }
}

/**
 * Gets all user-generated study materials
 */
export async function getStudyMaterialsAction() {
  try {
    const userId = await getAuthUserId();
    const materials = await prisma.studyMaterial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, materials };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve study materials.";
    return { error: msg };
  }
}
