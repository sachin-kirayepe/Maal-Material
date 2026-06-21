import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseCopilotEngine — "The Copilot Brain" (Phase 5A)
 *
 * Orchestrates the EnterpriseCopilotCore, tracking the AI copilot's operational footprint
 * and evaluating overall enterprise cognitive readiness.
 */
@Injectable()
export class EnterpriseCopilotEngine {
  private readonly logger = new Logger(EnterpriseCopilotEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global operational footprint for the enterprise copilot.
   */
  async updateCopilotFootprint(
    tenantId: string,
    totalInterventions: number,
    cognitiveReadiness: number,
  ) {
    this.logger.log(
      `Updating Copilot Footprint [Interventions: ${totalInterventions}, Readiness: ${cognitiveReadiness}]`,
    );

    const core = await this.prisma.enterpriseCopilotCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.enterpriseCopilotCore.update({
        where: { id: core.id },
        data: {
          totalAssistanceInterventionsCount: totalInterventions,
          cognitiveReadinessIndex: cognitiveReadiness,
          lastInterventionAt: new Date(),
        },
      });
    } else {
      return this.prisma.enterpriseCopilotCore.create({
        data: {
          tenantId,
          totalAssistanceInterventionsCount: totalInterventions,
          cognitiveReadinessIndex: cognitiveReadiness,
        },
      });
    }
  }

  /**
   * Validates if the enterprise is cognitively ready to receive autonomous assistance in a domain.
   */
  async validateCognitiveReadiness(tenantId: string, requiredReadiness: number): Promise<boolean> {
    const core = await this.prisma.enterpriseCopilotCore.findFirst({
      where: { tenantId },
    });

    if (!core || core.cognitiveReadinessIndex < requiredReadiness) {
      this.logger.warn(
        `Enterprise Cognitive Readiness (${core?.cognitiveReadinessIndex || 0}) is below required threshold (${requiredReadiness}). Reverting to manual human execution.`,
      );
      return false;
    }

    return true;
  }
}
