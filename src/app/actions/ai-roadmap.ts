"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { roadmapConfigSchema } from "@/lib/validation/ai";
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

interface Milestone {
  id: string;
  title: string;
  desc: string;
  done: boolean;
}

/**
 * Generates structured learning paths with milestones and progress tracking using AI
 */
export async function generateRoadmapAction(careerPath: string) {
  try {
    const userId = await getAuthUserId();

    // Zod validation
    roadmapConfigSchema.parse({ careerPath });

    const prompt = `
Generate a structured learning path with exactly 5 milestones for a candidate seeking to become a:
Career Track: ${careerPath}

Return a STRICT JSON response containing the following structure:
{
  "title": "${careerPath} Learning Track",
  "milestones": [
    { "id": "1", "title": "Milestone 1 Title", "desc": "Milestone 1 detailed description and target skills.", "done": false },
    { "id": "2", "title": "Milestone 2 Title", "desc": "Milestone 2 detailed description.", "done": false },
    { "id": "3", "title": "Milestone 3 Title", "desc": "Milestone 3 detailed description.", "done": false },
    { "id": "4", "title": "Milestone 4 Title", "desc": "Milestone 4 detailed description.", "done": false },
    { "id": "5", "title": "Milestone 5 Title", "desc": "Milestone 5 detailed description.", "done": false }
  ]
}
Do not include any wrapping markdown formatting, extra comments, or code-block tags. Return ONLY the JSON object.
`;

    const aiProvider = getAIProvider();
    const systemPrompt = "You are a Career Coach. Generate structured career learning roadmaps in standard JSON formats only.";
    
    const replyText = await aiProvider.generateText(prompt, systemPrompt);
    const cleanedJsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();

    let pathObj: { title?: string; milestones?: Milestone[] };
    try {
      pathObj = JSON.parse(cleanedJsonStr) as { title?: string; milestones?: Milestone[] };
    } catch (parseErr) {
      console.error("Failed to parse AI roadmap JSON:", cleanedJsonStr, parseErr);
      throw new Error("Failed to parse the AI generated roadmap. Please try again.");
    }

    const title = pathObj.title || `${careerPath} Roadmap`;
    const milestones = Array.isArray(pathObj.milestones) ? pathObj.milestones : [];

    // Save roadmap in database
    const roadmap = await prisma.roadmap.create({
      data: {
        userId,
        title: cleanStringForDb(title),
        jsonData: cleanDataForDb(milestones) as unknown as Prisma.InputJsonValue
      }
    });

    revalidatePath("/roadmap");
    revalidatePath("/dashboard");
    return { success: true, roadmap };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to generate learning roadmap.";
    return { error: msg };
  }
}

/**
 * Gets the user's current roadmap
 */
export async function getLatestRoadmapAction() {
  try {
    const userId = await getAuthUserId();
    const roadmap = await prisma.roadmap.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, roadmap };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve roadmap.";
    return { error: msg };
  }
}

/**
 * Updates a milestone's done/completed progress status inside the JSON roadmap data
 */
export async function updateRoadmapMilestoneAction(roadmapId: string, milestoneId: string, isCompleted: boolean) {
  try {
    const userId = await getAuthUserId();

    // Security check: ensure roadmap belongs to this user
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId }
    });

    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const milestones = roadmap.jsonData as unknown as Milestone[];
    const updatedMilestones = milestones.map((m) => {
      if (m.id === milestoneId) {
        return { ...m, done: isCompleted };
      }
      return m;
    });

    // Update in database
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { jsonData: cleanDataForDb(updatedMilestones) as unknown as Prisma.InputJsonValue }
    });

    revalidatePath("/roadmap");
    revalidatePath("/dashboard");
    return { success: true, roadmap: updatedRoadmap };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update milestone progress.";
    return { error: msg };
  }
}
