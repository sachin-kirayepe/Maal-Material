import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FederationAllianceEngine — "The Alliance Manager" (Phase 3D)
 *
 * Manages the lifecycle and contractual terms of Industrial Federation Alliances.
 * This allows tenants to formally federate, operating under shared governance models
 * (e.g., DEMOCRATIC or LEAD_TENANT) while sharing ecosystem revenue and operational data.
 */
@Injectable()
export class FederationAllianceEngine {
  private readonly logger = new Logger(FederationAllianceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Proposes a new federation alliance between multiple tenants.
   */
  async proposeAlliance(
    allianceName: string,
    memberTenants: string[],
    governanceModel: string,
    terms: unknown,
  ) {
    this.logger.log(
      `Proposing Federation Alliance: [${allianceName}] with ${memberTenants.length} tenants under [${governanceModel}] governance.`,
    );

    return this.prisma.industrialFederationAlliance.create({
      data: {
        allianceName,
        memberTenantsJson: JSON.stringify(memberTenants),
        governanceModel,
        allianceTermsJson: JSON.stringify(terms),
        status: "PROPOSED",
      },
    });
  }

  /**
   * Ratifies an alliance, making it an active operational entity.
   */
  async ratifyAlliance(allianceId: string) {
    this.logger.log(`Ratifying Alliance [${allianceId}] into ACTIVE state.`);

    return this.prisma.industrialFederationAlliance.update({
      where: { id: allianceId },
      data: { status: "ACTIVE" },
    });
  }

  /**
   * Dissolves an active or proposed alliance.
   */
  async dissolveAlliance(allianceId: string) {
    this.logger.warn(`Dissolving Alliance [${allianceId}].`);

    return this.prisma.industrialFederationAlliance.update({
      where: { id: allianceId },
      data: { status: "DISSOLVED" },
    });
  }

  /**
   * Retrieves all active alliances a tenant is participating in.
   */
  async getTenantAlliances(tenantId: string) {
    // Queries all alliances containing the tenant ID in the JSON array
    // Note: In a production heavily scaled environment, this would use a dedicated join table or native JSONB querying.
    return this.prisma.industrialFederationAlliance.findMany({
      where: {
        status: "ACTIVE",
        memberTenantsJson: { contains: `"${tenantId}"` },
      },
    });
  }
}
