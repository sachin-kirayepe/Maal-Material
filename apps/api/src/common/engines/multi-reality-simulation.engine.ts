import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MultiRealitySimulationEngine — "The Scenario Orchestrator" (Phase 4D)
 *
 * Orchestrates the MultiRealitySimulationCore, tracking total concurrent simulations
 * and macro-predictive confidence across the enterprise.
 */
@Injectable()
export class MultiRealitySimulationEngine {
  private readonly logger = new Logger(MultiRealitySimulationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global simulation state for the enterprise.
   */
  async updateSimulationState(
    tenantId: string,
    activeSimulations: number,
    predictiveConfidence: number,
  ) {
    this.logger.log(
      `Updating Multi-Reality Simulation State [Simulations: ${activeSimulations}, Confidence: ${predictiveConfidence}]`,
    );

    const core = await this.prisma.multiRealitySimulationCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.multiRealitySimulationCore.update({
        where: { id: core.id },
        data: {
          activeSimulationsCount: activeSimulations,
          macroPredictiveConfidence: predictiveConfidence,
          lastSimulatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.multiRealitySimulationCore.create({
        data: {
          tenantId,
          activeSimulationsCount: activeSimulations,
          macroPredictiveConfidence: predictiveConfidence,
        },
      });
    }
  }

  /**
   * Evaluates if the predictive engine has enough confidence to operate autonomously.
   */
  async validateMacroConfidence(tenantId: string, requiredConfidence: number): Promise<boolean> {
    const core = await this.prisma.multiRealitySimulationCore.findFirst({
      where: { tenantId },
    });

    if (!core || core.macroPredictiveConfidence < requiredConfidence) {
      this.logger.warn(
        `Macro predictive confidence (${core?.macroPredictiveConfidence || 0}) is below required threshold (${requiredConfidence}). System is highly uncertain.`,
      );
      return false; // Forecasting is currently too noisy or uncertain
    }

    return true;
  }
}
