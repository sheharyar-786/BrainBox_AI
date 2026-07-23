"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { chatInputSchema } from "@/lib/validation/ai";
import { getAIProvider } from "@/lib/ai/provider";
import { cleanStringForDb } from "@/lib/db-cleaner";

// Helper to authenticate user
async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Checks message counts in the last minute to prevent spamming
 */
async function checkRateLimit(userId: string) {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  // Count messages sent by this user in the last minute
  const recentCount = await prisma.message.count({
    where: {
      conversation: { userId },
      createdAt: { gte: oneMinuteAgo }
    }
  });

  // Limit to 10 messages per minute
  if (recentCount >= 10) {
    throw new Error("Rate limit exceeded. Please wait a minute before sending another message.");
  }
}

/**
 * Retrieves all conversations of the authenticated user
 */
export async function getConversationsAction() {
  try {
    const userId = await getAuthUserId();
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, conversations };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve conversations.";
    return { error: msg };
  }
}

/**
 * Retrieves messages of a specific conversation
 */
export async function getMessagesAction(conversationId: string) {
  try {
    const userId = await getAuthUserId();
    
    // Security check: ensure conversation belongs to this user
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });

    return { success: true, messages };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve messages.";
    return { error: msg };
  }
}

/**
 * Sends a message in a conversation, calls the AI provider, and returns the response
 */
export async function sendMessageAction(messageText: string, conversationId?: string) {
  try {
    const userId = await getAuthUserId();
    
    // 1. Zod input validation
    chatInputSchema.parse({ message: messageText, conversationId });

    // 2. Database-backed rate limiting
    await checkRateLimit(userId);

    let activeConversationId = conversationId;

    // 3. Create conversation if it doesn't exist
    if (!activeConversationId) {
      const title = messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText;
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          title: cleanStringForDb(title)
        }
      });
      activeConversationId = conversation.id;
    } else {
      // Security check: ensure conversation belongs to this user
      const conversation = await prisma.conversation.findFirst({
        where: { id: activeConversationId, userId }
      });
      if (!conversation) {
        throw new Error("Conversation not found");
      }
    }

    // 4. Save user message to database
    await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        role: "user",
        content: cleanStringForDb(messageText)
      }
    });

    // 5. Build context from previous messages (up to 15 messages)
    const previousMessages = await prisma.message.findMany({
      where: { conversationId: activeConversationId },
      orderBy: { createdAt: "desc" },
      take: 15
    });

    // Reverse to chronological order
    previousMessages.reverse();

    // Call active AI provider
    const aiProvider = getAIProvider();
    
    // Construct instruction system prompt for the career mentor
    const systemPrompt = `You are a CareerOS AI Learning Mentor. You help students prepare for technical technical interviews, build resume projects, understand database normalization, react concepts, and study guides. Be encouraging, professional, and clear. Format code segments with proper markdown.`;

    // Format chat history for prompt
    let contextPrompt = "";
    previousMessages.forEach((msg) => {
      contextPrompt += `${msg.role === "user" ? "Student" : "Mentor"}: ${msg.content}\n`;
    });
    contextPrompt += `Mentor:`;

    const replyText = await aiProvider.generateText(contextPrompt, systemPrompt);

    // 6. Save assistant message to database
    await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        role: "assistant",
        content: cleanStringForDb(replyText)
      }
    });

    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() }
    });

    revalidatePath("/tutor");
    return { success: true, conversationId: activeConversationId, replyText };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to process message.";
    return { error: msg };
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversationAction(conversationId: string) {
  try {
    const userId = await getAuthUserId();
    
    // Security check: ensure conversation belongs to this user
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await prisma.conversation.delete({
      where: { id: conversationId }
    });

    revalidatePath("/tutor");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete conversation.";
    return { error: msg };
  }
}
