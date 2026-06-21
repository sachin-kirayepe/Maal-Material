import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * InterEnterpriseCognitionEngine — "The Shared Mind" (Phase 4E)
 *
 * Manages InterEnterpriseCognitionNodes, enabling distinct companies to securely pool
 * intelligence data and predictive models for ecosystem-wide supply chain awareness.
 */
@Injectable()
export class InterEnterpriseCognitionEngine {
  private readonly logger = new Logger(InterEnterpriseCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pools strategic intelligence with a trusted partner enterprise.
   */
  async shareEcosystemIntelligence(
    tenantId: string,
    partnerTenantId: string,
    domain: string,
    intelligenceData: unknown,
  ) {
    this.logger.debug(
      `Sharing Intelligence [Owner: ${tenantId}] -> [Partner: ${partnerTenantId}] [Domain: ${domain}]`,
    );

    return this.prisma.interEnterpriseCognitionNode.create({
      data: {
        tenantId,
        partnerTenantId,
        cognitionDomain: domain,
        sharedIntelligenceData: JSON.stringify(intelligenceData),
        isActive: true,
      },
    });
  }

  /**
   * Retrieves shared intelligence provided by trusted external partners.
   */
  async fetchPartnerIntelligence(tenantId: string, domain: string) {
    this.logger.log(`Scanning for shared ecosystem intelligence in domain: ${domain}...`);

    const nodes = await this.prisma.interEnterpriseCognitionNode.findMany({
      where: {
        partnerTenantId: tenantId,
        cognitionDomain: domain,
        isActive: true,
      },
    });

    if (nodes.length > 0) {
      this.logger.log(`Found ${nodes.length} shared cognition nodes from external partners.`);
    }

    return nodes.map((node) => ({
      ...node,
      sharedIntelligenceData: JSON.parse(node.sharedIntelligenceData),
    }));
  }
}
