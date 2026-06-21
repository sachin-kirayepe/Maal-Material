import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialNetworkEffectEngine
 *
 * Models the compounding value of the ecosystem.
 * E.g., If Vendor A successfully delivers to Tenant X, Y, and Z, their global
 * trust multiplier increases. If Tenant W joins, they immediately benefit from
 * this pre-vetted trust network.
 */
@Injectable()
export class IndustrialNetworkEffectEngine {
  private readonly logger = new Logger(IndustrialNetworkEffectEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a successful cross-tenant interaction to boost network value.
   */
  async recordNetworkInteraction(universalEntityId: string, connectedTenantId: string) {
    this.logger.debug(
      `Recording network effect link for Entity [${universalEntityId}] with Tenant [${connectedTenantId}]`,
    );

    return this.prisma.industrialNetworkEffectLink.upsert({
      where: {
        unique_network_link: { universalEntityId, connectedTenantId },
      },
      update: { trustMultiplier: { increment: 0.1 } },
      create: { universalEntityId, connectedTenantId, trustMultiplier: 1.1 },
    });
  }

  /**
   * Retrieves the aggregated global trust multiplier for an entity across all tenants.
   */
  async getGlobalTrustMultiplier(universalEntityId: string): Promise<number> {
    const links = await this.prisma.industrialNetworkEffectLink.findMany({
      where: { universalEntityId },
    });

    if (links.length === 0) return 1.0;

    // Simple compounding formula
    const totalMultiplier = links.reduce((sum, link) => sum + link.trustMultiplier, 0);
    return totalMultiplier / links.length + links.length * 0.05; // Bonus for widespread usage
  }
}
