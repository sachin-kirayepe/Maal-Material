import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketplaceIntegrationAnalyticsEngine — "The Ecosystem Auditor" (Phase 23)
 *
 * Tracks plugin health, usage patterns, error rates, and tenant adoption
 * metrics across the entire industrial app marketplace.
 */
@Injectable()
export class MarketplaceIntegrationAnalyticsEngine {
  private readonly logger = new Logger(MarketplaceIntegrationAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates health and adoption metrics for a specific plugin.
   */
  async generatePluginReport(pluginId: string) {
    this.logger.log(`Generating Ecosystem Report for Plugin [${pluginId}]`);

    const activeInstallations = await (this.prisma as any).tenantPluginInstallation.count({
      where: {
        pluginId,
        status: "ACTIVE",
      },
    });

    // Fetch API utilization
    const apiAuth = await (this.prisma as any).pluginAPIAuthorization.findFirst({
      where: { pluginId },
    });

    const callsMade = apiAuth ? apiAuth.callsMade : 0;
    const quotaLimit = apiAuth ? apiAuth.quotaLimit : 0;

    // Fetch isolation status
    const isolation = await (this.prisma as any).pluginResourceIsolation.findUnique({
      where: { pluginId },
    });

    const isolationStatus = isolation ? isolation.isolationStatus : "UNKNOWN";

    return {
      pluginId,
      activeInstallations,
      apiUtilization: {
        callsMade,
        quotaLimit,
        utilizationPercentage: quotaLimit > 0 ? (callsMade / quotaLimit) * 100 : 0,
      },
      health: {
        isolationStatus,
      },
    };
  }
}
