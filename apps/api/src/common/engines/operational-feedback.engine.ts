import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalFeedbackEngine — "The Critic" (Phase 9A)
 *
 * Captures explicit and implicit feedback on system-orchestrated decisions
 * to evaluate the utility of the AI models.
 */
@Injectable()
export class OperationalFeedbackEngine {
  private readonly logger = new Logger(OperationalFeedbackEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a user's explicit or implicit feedback on an automated decision.
   */
  async captureFeedback(
    tenantId: string,
    orchestrationId: string,
    score: number,
    implicitSignal?: string,
  ) {
    this.logger.debug(
      `Capturing feedback [Score: ${score}] for Orchestration [${orchestrationId}]`,
    );

    return this.prisma.operationalFeedbackLoop.create({
      data: {
        tenantId,
        orchestrationId,
        feedbackScore: score,
        implicitSignal,
      },
    });
  }

  /**
   * Evaluates if a specific orchestration path is generating poor operational outcomes.
   */
  async evaluateOrchestrationUtility(tenantId: string, orchestrationId: string): Promise<boolean> {
    this.logger.log(`Evaluating utility of Orchestration [${orchestrationId}]`);

    const feedbacks = await this.prisma.operationalFeedbackLoop.findMany({
      where: { tenantId, orchestrationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (feedbacks.length === 0) return true; // Assume useful if no feedback yet

    const averageScore = feedbacks.reduce((acc, f) => acc + f.feedbackScore, 0) / feedbacks.length;

    if (averageScore < 2.5) {
      this.logger.warn(
        `Feedback Engine: Orchestration [${orchestrationId}] has poor utility (Avg Score: ${averageScore}). Needs optimization.`,
      );
      return false; // Poor utility
    }

    return true; // Good utility
  }
}
