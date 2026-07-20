import { z } from "zod";

export const chatInputSchema = z.object({
  message: z.string().min(1, "Message content cannot be empty"),
  conversationId: z.string().uuid("Invalid conversation identifier").optional().or(z.literal("")),
});

export type ChatInput = z.infer<typeof chatInputSchema>;

export const interviewConfigSchema = z.object({
  role: z.string().min(2, "Interview role is required"),
  tech: z.string().min(1, "Target technologies are required"),
  difficulty: z.enum(["Junior", "Mid-Level", "Senior"]),
});

export type InterviewConfig = z.infer<typeof interviewConfigSchema>;

export const studyMaterialSchema = z.object({
  topic: z.string().min(2, "Study topic is required"),
});

export type StudyMaterialInput = z.infer<typeof studyMaterialSchema>;

export const roadmapConfigSchema = z.object({
  careerPath: z.string().min(2, "Career path selection is required"),
});

export type RoadmapConfig = z.infer<typeof roadmapConfigSchema>;
