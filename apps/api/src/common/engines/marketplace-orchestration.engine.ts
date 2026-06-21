import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MarketplaceOrchestrationEngine — "The Global Exchange" (Phase 9B)
 *
 * Manages the lifecycle of global marketplace listings, enabling tenants
 * to procure assets and services from each other reliably.
 */
@Injectable()
export class MarketplaceOrchestrationEngine {
  private readonly logger = new Logger(MarketplaceOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Publishes a new asset to the global industrial marketplace.
   */
  async publishListing(
    tenantId: string,
    assetType: string,
    title: string,
    description: string,
    pricingModel: unknown,
  ) {
    this.logger.log(
      `Publishing Global Marketplace Listing: [${assetType}] by Tenant [${tenantId}]`,
    );

    return this.prisma.industrialMarketplaceListing.create({
      data: {
        tenantId,
        assetType,
        title,
        description,
        pricingModel: JSON.stringify(pricingModel),
        availabilityState: "AVAILABLE",
      },
    });
  }

  /**
   * Temporarily reserves an asset from the marketplace during procurement.
   */
  async reserveListing(listingId: string, requestingTenantId: string): Promise<boolean> {
    this.logger.debug(
      `Tenant [${requestingTenantId}] attempting to reserve Listing [${listingId}]`,
    );

    // In a real transactional system, we would lock the row to prevent race conditions.
    const listing = await this.prisma.industrialMarketplaceListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.availabilityState !== "AVAILABLE") {
      this.logger.warn(`Listing [${listingId}] is no longer available.`);
      return false;
    }

    await this.prisma.industrialMarketplaceListing.update({
      where: { id: listingId },
      data: { availabilityState: "RESERVED_PENDING_B2B" },
    });

    return true;
  }
}
