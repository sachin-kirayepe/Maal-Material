import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveLearningEngine — "The Self-Correcting Brain" (Phase 3C)
 *
 * Implements a closed-loop learning cycle: when the platform makes a prediction
 * (e.g., "Supplier X will deliver on time") and the real-world outcome diverges,
 * this engine captures the delta, extracts a lesson, and marks it for model
 * retraining. Over time, the platform self-corrects without human intervention.
 */
@Injectable()
export class AdaptiveLearningEngine {
  private readonly logger = new Logger(AdaptiveLearningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a learning cycle when a prediction diverges from observed reality.
   */
  async recordLearningCycle(
    tenantId: string,
    domain: string,
    triggerEvent: string,
    observedOutcome: string,
    predictedOutcome: string | null,
    deltaScore: number,
    lessonExtracted: string,
  ) {
    this.logger.log(
      `Learning Cycle [${domain}]: Delta=${deltaScore.toFixed(2)} — "${lessonExtracted}"`,
    );

    return this.prisma.adaptiveLearningCycle.create({
      data: {
        tenantId,
        domain,
        triggerEvent,
        observedOutcome,
        predictedOutcome,
        deltaScore,
        lessonExtracted,
        appliedToModel: false,
      },
    });
  }

  /**
   * Retrieves un-applied lessons for a domain, ready for model retraining.
   */
  async getUnappliedLessons(tenantId: string, domain: string) {
    return this.prisma.adaptiveLearningCycle.findMany({
      where: { tenantId, domain, appliedToModel: false },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Marks lessons as applied after they have been ingested into a retraining pipeline.
   */
  async markLessonsApplied(lessonIds: string[]) {
    this.logger.log(`Marking ${lessonIds.length} lessons as applied to model.`);

    for (const id of lessonIds) {
      await this.prisma.adaptiveLearningCycle.update({
        where: { id },
        data: { appliedToModel: true },
      });
    }
  }
}
