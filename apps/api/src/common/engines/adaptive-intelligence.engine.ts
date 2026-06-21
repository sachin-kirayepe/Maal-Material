import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveIntelligenceEngine — "The Cognitive Accumulator" (Phase 4A)
 *
 * Orchestrates the AdaptiveLearningCore, tracking macro-level learning velocity
 * and directing compute resources toward high-value optimization targets.
 */
@Injectable()
export class AdaptiveIntelligenceEngine {
  private readonly logger = new Logger(AdaptiveIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pulses the global learning velocity for the enterprise.
   */
  async updateLearningState(
    tenantId: string,
    globalLearningVelocity: number,
    optimizationGains: unknown,
  ) {
    this.logger.log(`Updating Adaptive Learning State [Velocity: ${globalLearningVelocity}]`);

    const core = await this.prisma.adaptiveLearningCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.adaptiveLearningCore.update({
        where: { id: core.id },
        data: {
          globalLearningVelocity,
          cumulativeOptimizationGainsJson: JSON.stringify(optimizationGains),
          lastEvolvedAt: new Date(),
        },
      });
    } else {
      return this.prisma.adaptiveLearningCore.create({
        data: {
          tenantId,
          globalLearningVelocity,
          cumulativeOptimizationGainsJson: JSON.stringify(optimizationGains),
        },
      });
    }
  }

  /**
   * Evaluates if the learning velocity is stagnating, requiring novel algorithmic exploration.
   */
  async evaluateCognitiveStagnation(tenantId: string): Promise<boolean> {
    const core = await this.prisma.adaptiveLearningCore.findFirst({
      where: { tenantId },
    });

    if (!core) return false;

    if (core.globalLearningVelocity < 0.1) {
      this.logger.warn(
        `Adaptive Learning Velocity is extremely low (${core.globalLearningVelocity}). Enterprise intelligence is stagnating. Triggering exploration mode.`,
      );
      return true; // System should try new experimental workflow topologies
    }

    return false;
  }
}
