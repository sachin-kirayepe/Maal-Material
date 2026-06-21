import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * NeuralDecisionEngine — "The Prefrontal Cortex" (Phase 4B)
 *
 * Orchestrates the NeuralDecisionCore, mapping enterprise-wide decision logic,
 * strategic cognition state, and total active reasoning load.
 */
@Injectable()
export class NeuralDecisionEngine {
  private readonly logger = new Logger(NeuralDecisionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global neural decision state for the enterprise.
   */
  async updateCognitionState(tenantId: string, reasoningLoad: number, cognitionState: unknown) {
    this.logger.log(`Updating Neural Decision State [Reasoning Load: ${reasoningLoad}]`);

    const core = await this.prisma.neuralDecisionCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.neuralDecisionCore.update({
        where: { id: core.id },
        data: {
          totalActiveReasoningLoad: reasoningLoad,
          macroCognitionStateJson: JSON.stringify(cognitionState),
          lastEvaluatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.neuralDecisionCore.create({
        data: {
          tenantId,
          totalActiveReasoningLoad: reasoningLoad,
          macroCognitionStateJson: JSON.stringify(cognitionState),
        },
      });
    }
  }

  /**
   * Evaluates if the system has available cognitive capacity to process a new strategic challenge.
   */
  async checkCognitiveCapacity(tenantId: string): Promise<boolean> {
    const core = await this.prisma.neuralDecisionCore.findFirst({
      where: { tenantId },
    });

    if (!core) return true;

    if (core.totalActiveReasoningLoad > 0.95) {
      this.logger.warn(
        `Neural Decision Core overloaded (${core.totalActiveReasoningLoad}). Deferring low-priority reasoning tasks.`,
      );
      return false; // System must shed load before taking on new massive reasoning jobs
    }

    return true;
  }
}
