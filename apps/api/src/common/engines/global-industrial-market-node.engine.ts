import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalIndustrialMarketNodeEngine — "The Ecosystem Gateway" (Phase 31)
 *
 * Manages the verified identity and public profile of organizations
 * operating on the Maal-Material universal market network.
 */
@Injectable()
export class GlobalIndustrialMarketNodeEngine {
  private readonly logger = new Logger(GlobalIndustrialMarketNodeEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a tenant onto the global industrial market network.
   */
  async registerMarketNode(tenantId: string, orgName: string, profileData: unknown) {
    this.logger.log(
      `Registering [${orgName}] to the Maal-Material Global Network (Tenant: ${tenantId})`,
    );

    const node = await this.prisma.globalIndustrialMarketNode.create({
      data: {
        tenantId,
        organizationName: orgName,
        verificationLevel: "UNVERIFIED",
        publicProfileJson: JSON.stringify(profileData),
      },
    });

    this.logger.debug(`Tenant [${tenantId}] is now discoverable on the ecosystem market network.`);
    return node;
  }
}
