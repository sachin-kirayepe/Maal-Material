import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CopilotMemoryEngine — "The Persistent Mind" (Phase 3B)
 *
 * Manages conversational memory for enterprise AI copilot sessions.
 * Enables multi-turn reasoning by persisting and retrieving contextual
 * conversation history, allowing copilots to maintain coherent, long-running
 * advisory sessions without losing prior context.
 */
@Injectable()
export class CopilotMemoryEngine {
  private readonly logger = new Logger(CopilotMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a turn in a copilot conversation session.
   */
  async recordTurn(
    tenantId: string,
    userId: string,
    sessionId: string,
    role: string,
    content: string,
    context?: unknown,
  ) {
    this.logger.debug(`Recording [${role}] turn in session [${sessionId}]`);

    return this.prisma.copilotConversationMemory.create({
      data: {
        tenantId,
        userId,
        sessionId,
        role,
        content,
        contextJson: context ? JSON.stringify(context) : null,
      },
    });
  }

  /**
   * Retrieves the full conversation history for a copilot session,
   * ordered chronologically for retrieval-augmented reasoning.
   */
  async getSessionHistory(tenantId: string, userId: string, sessionId: string) {
    return this.prisma.copilotConversationMemory.findMany({
      where: { tenantId, userId, sessionId },
      orderBy: { timestamp: "asc" },
    });
  }

  /**
   * Retrieves the last N turns for a session, useful for windowed-context
   * reasoning when the full history would exceed token limits.
   */
  async getRecentTurns(tenantId: string, userId: string, sessionId: string, limit: number = 20) {
    return this.prisma.copilotConversationMemory.findMany({
      where: { tenantId, userId, sessionId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }
}
