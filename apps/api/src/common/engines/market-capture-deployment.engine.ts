import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketCaptureDeploymentEngine — "The Expansion General" (Phase 12)
 *
 * Orchestrates the macro-strategy of bringing entire new industries, enterprise customers,
 * or geographical regions onto the live Maal-Material platform.
 */
@Injectable()
export class MarketCaptureDeploymentEngine {
  private readonly logger = new Logger(MarketCaptureDeploymentEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new market capture campaign in a specified region.
   */
  async initializeMarketDeployment(tenantId: string, campaignName: string, targetRegion: string) {
    this.logger.log(
      `Initializing Market Deployment [${campaignName}] for Tenant [${tenantId}] in Region [${targetRegion}]`,
    );

    const deployment = await this.prisma.enterpriseMarketDeployment.create({
      data: {
        tenantId,
        campaignName,
        targetRegion,
        deploymentMetrics: JSON.stringify({ onboardingRate: 0, activeContractors: 0 }),
        status: "PLANNING",
      },
    });

    this.logger.debug(`Deployment Campaign staged. Ready for live execution.`);
    return deployment;
  }

  /**
   * Moves a deployment campaign into the 'EXECUTING' phase.
   */
  async launchDeployment(tenantId: string, campaignId: string) {
    this.logger.log(`Launching Market Deployment Campaign [${campaignId}] into live execution.`);

    return this.prisma.enterpriseMarketDeployment.update({
      where: { id: campaignId },
      data: {
        status: "EXECUTING",
      },
    });
  }
}
