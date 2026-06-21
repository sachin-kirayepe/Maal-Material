import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalTaxonomyEngine
 *
 * Automatically translates and maps product graphs, assets, and service catalogs
 * across international borders using the GlobalTaxonomyMapping registry.
 */
@Injectable()
export class GlobalTaxonomyEngine {
  private readonly logger = new Logger(GlobalTaxonomyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the international trade code (e.g., HS Code) for an internal platform category.
   */
  async resolveInternationalTaxonomy(
    tenantId: string,
    internalCategory: string,
    targetRegionCode: string,
  ): Promise<string | null> {
    this.logger.debug(
      `Resolving Taxonomy for Category [${internalCategory}] in Region [${targetRegionCode}]`,
    );

    const mapping = await this.prisma.globalTaxonomyMapping.findFirst({
      where: {
        tenantId,
        internalCategory,
        targetRegionCode,
      },
    });

    if (mapping) {
      this.logger.log(
        `Mapped [${internalCategory}] to International Code [${mapping.externalCode}]`,
      );
      return mapping.externalCode;
    }

    this.logger.warn(
      `No taxonomy mapping found for [${internalCategory}] in Region [${targetRegionCode}].`,
    );
    return null;
  }
}
