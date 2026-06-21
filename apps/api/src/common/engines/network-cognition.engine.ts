import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * NetworkCognitionEngine — "The Ecosystem Cartographer" (Phase 3O)
 *
 * Tracks the health, efficiency, and reliability of collaboration pathways.
 * Provides the intelligence required to optimize distributed workflows.
 */
@Injectable()
export class NetworkCognitionEngine {
  private readonly logger = new Logger(NetworkCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the intelligence model for a specific ecosystem network zone.
   */
  async updateNetworkIntelligence(
    tenantId: string,
    networkZone: string,
    healthScore: number,
    efficiencyMetrics: unknown,
  ) {
    this.logger.log(`Updating Network Intelligence for [${networkZone}] | Score: ${healthScore}`);

    const existingModel = await this.prisma.networkIntelligenceModel.findFirst({
      where: { tenantId, networkZone },
    });

    if (existingModel) {
      return this.prisma.networkIntelligenceModel.update({
        where: { id: existingModel.id },
        data: {
          healthScore,
          efficiencyMetrics: JSON.stringify(efficiencyMetrics),
          lastAnalyzedAt: new Date(),
        },
      });
    } else {
      return this.prisma.networkIntelligenceModel.create({
        data: {
          tenantId,
          networkZone,
          healthScore,
          efficiencyMetrics: JSON.stringify(efficiencyMetrics),
        },
      });
    }
  }

  /**
   * Retrieves the current network health model for routing optimization.
   */
  async getNetworkModel(tenantId: string, networkZone: string) {
    return this.prisma.networkIntelligenceModel.findFirst({
      where: { tenantId, networkZone },
    });
  }
}
