"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { interviewConfigSchema } from "@/lib/validation/ai";
import { getAIProvider } from "@/lib/ai/provider";

// Helper to authenticate user
async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Generates custom interview questions based on role, tech, and difficulty using AI
 */
export async function generateInterviewQuestionsAction(role: string, difficulty: string, tech: string) {
  try {
    await getAuthUserId();
    
    // Zod validation
    interviewConfigSchema.parse({ role, difficulty, tech });

    const prompt = `
Generate a list of 5 technical mock interview questions for a candidate interviewing for the following role:
Role: ${role}
Target Technologies: ${tech}
Difficulty Level: ${difficulty}

Return a STRICT JSON response containing a single array of strings (the 5 questions):
[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5"
]
Do not include any wrapping markdown formatting, extra comments, or code-block tags. Return ONLY the JSON array.
`;

    const aiProvider = getAIProvider();
    const systemPrompt = "You are a Technical Interviewer. Generate interview questions as standard JSON arrays only.";
    
    const replyText = await aiProvider.generateText(prompt, systemPrompt);
    
    // Clean reply from markdown block wraps if present
    const cleanedJsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let questions: unknown;
    try {
      questions = JSON.parse(cleanedJsonStr);
    } catch (parseErr) {
      console.error("Failed to parse AI response JSON:", cleanedJsonStr, parseErr);
      throw new Error("Failed to parse the AI interview questions. Please try again.");
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI did not return a list of questions.");
    }

    return { success: true, questions: questions as string[] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to generate interview questions.";
    return { error: msg };
  }
}

/**
 * Submits the completed interview session transcript for scoring and feedback using AI, then saves to DB
 */
export async function submitInterviewSessionAction(
  role: string,
  difficulty: string,
  transcript: Array<{ sender: string; content: string }>
) {
  try {
    const userId = await getAuthUserId();

    if (transcript.length === 0) {
      throw new Error("Transcript is empty");
    }

    // Format transcript as a single string
    const transcriptText = transcript
      .map((entry) => `${entry.sender === "INTERVIEWER" ? "Interviewer" : "Candidate"}: ${entry.content}`)
      .join("\n");

    const prompt = `
Evaluate the following candidate mock interview transcript.
Compute an overall score from 0 to 100 based on technical accuracy, clarity, and depth of explanation.
Provide constructive feedback.

Return a STRICT JSON response containing the following structure:
{
  "score": number (0 to 100),
  "feedback": string (brief summary feedback and areas of improvement)
}
Do not include any wrapping markdown formatting, extra comments, or code-block tags. Return ONLY the JSON object.

Transcript:
${transcriptText}
`;

    const aiProvider = getAIProvider();
    const systemPrompt = "You are a Technical Evaluator. Score interviews and return structured JSON reports only.";
    
    const replyText = await aiProvider.generateText(prompt, systemPrompt);
    const cleanedJsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let evaluation: { score?: number; feedback?: string };
    try {
      evaluation = JSON.parse(cleanedJsonStr) as { score?: number; feedback?: string };
    } catch (parseErr) {
      console.error("Failed to parse AI evaluation JSON:", cleanedJsonStr, parseErr);
      throw new Error("Failed to parse the AI interview evaluation. Please try again.");
    }

    const score = Number(evaluation.score) || 75;
    const feedback = evaluation.feedback || "Good effort. Continue practicing core concepts.";

    // Save session in database
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        score,
        feedback,
        transcript: transcriptText,
        role,
        difficulty
      }
    });

    revalidatePath("/interview");
    revalidatePath("/dashboard");
    return { success: true, session };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save interview session.";
    return { error: msg };
  }
}

/**
 * Gets user's past interview sessions list
 */
export async function getInterviewHistoryAction() {
  try {
    const userId = await getAuthUserId();
    const history = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, history };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve interview history.";
    return { error: msg };
  }
}
