import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseAICopilotEngine — "The Conversational Brain" (Phase 24)
 *
 * Orchestrates chat context, intent recognition, and operational scope
 * for executives interacting directly with the Maal-Material intelligence.
 */
@Injectable()
export class EnterpriseAICopilotEngine {
  private readonly logger = new Logger(EnterpriseAICopilotEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes or resumes a copilot session for an executive.
   */
  async initializeSession(tenantId: string, executiveId: string, initialContext: unknown) {
    this.logger.log(
      `Initializing AI Copilot Session for Executive [${executiveId}] in Tenant [${tenantId}]`,
    );

    const session = await this.prisma.enterpriseAICopilotSession.create({
      data: {
        tenantId,
        executiveId,
        sessionContext: JSON.stringify(initialContext),
        conversationState: JSON.stringify({ history: [] }),
      },
    });

    return session;
  }
}
