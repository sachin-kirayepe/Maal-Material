import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalReasoningEngine
 *
 * Provides a highly auditable "Memory Log" for AI agents.
 * Before an agent executes a significant operational change, it must
 * trace its logical reasoning path and confidence score here.
 */
@Injectable()
export class OperationalReasoningEngine {
  private readonly logger = new Logger(OperationalReasoningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an AI agent's internal reasoning logic to the immutable audit trail.
   */
  async traceReasoningPath(
    tenantId: string,
    agentId: string,
    contextHash: string,
    reasoningPath: unknown,
    confidenceScore: number,
    decisionOutcome: string,
  ) {
    this.logger.debug(
      `Tracing AI Reasoning for Agent [${agentId}]. Confidence: ${confidenceScore}`,
    );

    if (confidenceScore < 0.6) {
      this.logger.warn(
        `Agent Reasoning Confidence is extremely low (${confidenceScore}). This should trigger governance.`,
      );
    }

    return this.prisma.aIOperationalReasoningTrace.create({
      data: {
        tenantId,
        agentId,
        contextHash,
        reasoningPath: JSON.stringify(reasoningPath),
        confidenceScore,
        decisionOutcome,
      },
    });
  }
}
