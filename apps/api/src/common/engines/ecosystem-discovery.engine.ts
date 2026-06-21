import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemDiscoveryEngine — "The Matchmaker" (Phase 9B)
 *
 * Utilizes network-effect data (Trust Scores, Relationships) to recommend
 * reliable suppliers and subcontractors across the global Maal-Material platform.
 */
@Injectable()
export class EcosystemDiscoveryEngine {
  private readonly logger = new Logger(EcosystemDiscoveryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Discovers the highest-rated suppliers for a specific asset requirement.
   */
  async discoverSuppliers(requestingTenantId: string, requiredAssetType: string): Promise<any[]> {
    this.logger.log(
      `Ecosystem Discovery: Finding [${requiredAssetType}] for Tenant [${requestingTenantId}]`,
    );

    // Fetch all active listings for the required asset type
    const listings = await this.prisma.industrialMarketplaceListing.findMany({
      where: {
        assetType: requiredAssetType,
        availabilityState: "AVAILABLE",
      },
    });

    if (listings.length === 0) {
      this.logger.warn(`No global listings found for asset type [${requiredAssetType}].`);
      return [];
    }

    // Enhance listings with the provider's Ecosystem Trust Score
    const enhancedListings = await Promise.all(
      listings.map(async (listing) => {
        const trustData = await this.prisma.ecosystemTrustScore.findUnique({
          where: { tenantId: listing.tenantId },
        });

        // Exclude the requesting tenant from their own discovery results
        if (listing.tenantId === requestingTenantId) return null;

        return {
          ...listing,
          providerTrustScore: trustData?.compositeScore || 0.5, // Default neutral if no score
        };
      }),
    );

    // Filter out nulls and sort by highest trust score
    const validListings = enhancedListings.filter(Boolean) as any[];
    validListings.sort((a, b) => b.providerTrustScore - a.providerTrustScore);

    this.logger.log(`Discovered ${validListings.length} reliable ecosystem suppliers.`);
    return validListings;
  }
}
