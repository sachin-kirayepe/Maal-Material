import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialEconomicEngine — "The Macro Economist" (Phase 7B)
 *
 * Orchestrates the IndustrialEconomicCore. The master engine responsible for mapping
 * and synchronizing macro-financial intelligence across the industrial ecosystem.
 */
@Injectable()
export class IndustrialEconomicEngine {
  private readonly logger = new Logger(IndustrialEconomicEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Syncs the enterprise-wide economic health score and capital velocity.
   */
  async updateMacroEconomics(tenantId: string, capitalVelocity: number, healthScore: number) {
    this.logger.log(
      `Syncing Industrial Economy [Velocity: $${capitalVelocity}/hr] [Health Score: ${healthScore}]`,
    );

    const core = await this.prisma.industrialEconomicCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.industrialEconomicCore.update({
        where: { id: core.id },
        data: {
          totalCapitalVelocity: capitalVelocity,
          systemicEconomicHealthScore: healthScore,
          lastEconomicSyncAt: new Date(),
        },
      });
    } else {
      return this.prisma.industrialEconomicCore.create({
        data: {
          tenantId,
          totalCapitalVelocity: capitalVelocity,
          systemicEconomicHealthScore: healthScore,
        },
      });
    }
  }
}
