import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AppMarketplaceEngine
 *
 * Provides discoverability for extensions. Allows developers to publish verified
 * plugins (e.g. AI Optimizers, ERP Connectors) and allows tenants to browse them.
 */
@Injectable()
export class AppMarketplaceEngine {
  private readonly logger = new Logger(AppMarketplaceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Publishes a new extension to the marketplace directory.
   */
  async publishAppListing(
    developerId: string,
    pluginKey: string,
    name: string,
    description: string,
    category: string,
  ) {
    this.logger.log(`Publishing App to Marketplace: [${pluginKey}] by Dev ${developerId}`);

    return this.prisma.appMarketplaceListing.create({
      data: {
        pluginKey,
        developerId,
        name,
        description,
        category,
        isVerified: false, // Requires admin vetting before full public visibility
      },
    });
  }

  /**
   * Retrieves top-rated, verified apps for a tenant to browse.
   */
  async browseMarketplace(categoryFilter?: string) {
    this.logger.debug(`Browsing marketplace. Category Filter: ${categoryFilter || "ALL"}`);

    const whereClause: unknown = { isVerified: true };
    if (categoryFilter) {
      (whereClause as any).category = categoryFilter;
    }

    return this.prisma.appMarketplaceListing.findMany({
      where: whereClause as any,
      orderBy: { rating: "desc" },
      take: 20,
    });
  }
}
