import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AppMarketplaceIntelligenceEngine — "The Marketplace Curator" (Phase 32)
 *
 * Manages discoverability, app ratings, and suggests relevant extensions
 * to enterprise tenants based on their specific workflows.
 */
@Injectable()
export class AppMarketplaceIntelligenceEngine {
  private readonly logger = new Logger(AppMarketplaceIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Publishes a new third-party app to the global Maal-Material marketplace.
   */
  async publishMarketplaceApp(
    developerId: string,
    appName: string,
    description: string,
    scopes: string[],
  ) {
    this.logger.debug(`Submitting App [${appName}] to Marketplace. Developer: [${developerId}]`);

    const listing = await this.prisma.ecosystemAppMarketplaceListing.create({
      data: {
        developerId,
        appName,
        description,
        requestedScopes: JSON.stringify(scopes),
        approvalStatus: "PENDING_REVIEW",
      },
    });

    this.logger.log(
      `App [${appName}] is in PENDING_REVIEW status. Global AI auditors will verify scope requests.`,
    );
    return listing;
  }
}
