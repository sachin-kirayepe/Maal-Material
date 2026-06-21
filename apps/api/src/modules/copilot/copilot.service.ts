import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import Groq from "groq-sdk";

@Injectable()
export class CopilotService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
  }

  async getConversations(tenantId: string, userId: string) {
    return this.prisma.copilotConversation.findMany({
      where: { tenantId, userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getConversation(tenantId: string, id: string) {
    return this.prisma.copilotConversation.findUnique({
      where: { id, tenantId },
    });
  }

  async sendMessage(
    tenantId: string,
    userId: string,
    conversationId: string | null,
    message: string,
  ) {
    let conversation;

    if (conversationId) {
      conversation = await this.prisma.copilotConversation.findUnique({
        where: { id: conversationId, tenantId },
      });
    }

    if (!conversation) {
      conversation = await this.prisma.copilotConversation.create({
        data: {
          tenantId,
          userId,
          title: message.substring(0, 50),
          history: JSON.stringify([]),
        },
      });
    }

    const history = JSON.parse(conversation.history);

    // Map history to Groq format
    const groqHistory = history.map((msg: unknown) => ({
      role: (msg as any).role === "assistant" ? "assistant" : "user",
      content: (msg as any).content,
    }));

    // Add System Prompt
    groqHistory.unshift({
      role: "system",
      content:
        "You are the Maal-Material Enterprise Intelligence Assistant. You help contractors, shopkeepers, and admins manage their construction ERP, B2B marketplace, and logistics operations. Provide concise, professional, and accurate answers. Perform calculations accurately.",
    });

    // Add current message
    groqHistory.push({ role: "user", content: message });

    // Get AI Response
    let aiResponse = "I am currently unable to process your request.";
    if (process.env.GROQ_API_KEY) {
      try {
        const completion = await this.groq.chat.completions.create({
          messages: groqHistory,
          model: "llama-3.1-8b-instant",
        });
        aiResponse = completion.choices[0]?.message?.content || aiResponse;
      } catch (err) {
        console.error("Groq API Error:", err);
        aiResponse =
          "I encountered an error connecting to my intelligence core. Please try again later.";
      }
    } else {
      aiResponse =
        "I am operating in simulated mode. To enable real intelligence, please configure GROQ_API_KEY.";
    }

    // Add to local history
    history.push({ role: "user", content: message, timestamp: new Date().toISOString() });
    history.push({ role: "assistant", content: aiResponse, timestamp: new Date().toISOString() });

    return this.prisma.copilotConversation.update({
      where: { id: conversation.id },
      data: { history: JSON.stringify(history) },
    });
  }
}
