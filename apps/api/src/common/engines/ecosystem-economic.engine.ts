import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemEconomicEngine — "The Financial Simulator" (Phase 3M)
 *
 * Runs economic simulations for ecosystem clusters, evaluating their financial
 * health and projecting future growth or contraction.
 */
@Injectable()
export class EcosystemEconomicEngine {
  private readonly logger = new Logger(EcosystemEconomicEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates or creates an economic model for a specific cluster.
   */
  async simulateEcosystemEconomics(
    tenantId: string,
    clusterName: string,
    financialHealth: number,
    growthProjection: unknown,
  ) {
    this.logger.debug(
      `Simulating Economics for Cluster: [${clusterName}] Health: ${financialHealth}`,
    );

    const existingModel = await this.prisma.ecosystemEconomicModel.findFirst({
      where: { tenantId, clusterName },
    });

    if (existingModel) {
      return this.prisma.ecosystemEconomicModel.update({
        where: { id: existingModel.id },
        data: {
          financialHealth,
          growthProjectionJson: JSON.stringify(growthProjection),
          lastSimulatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.ecosystemEconomicModel.create({
        data: {
          tenantId,
          clusterName,
          financialHealth,
          growthProjectionJson: JSON.stringify(growthProjection),
        },
      });
    }
  }

  /**
   * Retrieves economic clusters that are showing critical signs of distress.
   */
  async getDistressedClusters(tenantId: string, healthThreshold: number = 0.4) {
    return this.prisma.ecosystemEconomicModel.findMany({
      where: {
        tenantId,
        financialHealth: { lte: healthThreshold },
      },
      orderBy: { financialHealth: "asc" },
    });
  }
}
