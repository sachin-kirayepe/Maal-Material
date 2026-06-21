import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ReputationProfileEngine } from "./reputation-profile.engine";

/**
 * TrustTierGovernanceEngine — "The Gatekeeper"
 *
 * Evaluates an entity's reputation profile against trust tier thresholds
 * to determine operational access privileges.
 */
@Injectable()
export class TrustTierGovernanceEngine {
  private readonly logger = new Logger(TrustTierGovernanceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reputationEngine: ReputationProfileEngine,
  ) {}

  /**
   * Defines a new trust tier with specific thresholds and privileges.
   */
  async defineTier(
    tenantId: string,
    tierName: string,
    minReputation: number,
    privileges: string[],
    maxContractValue?: number,
  ) {
    this.logger.log(`Defining Trust Tier [${tierName}] (Min Rep: ${minReputation})`);

    return this.prisma.trustTierGovernance.upsert({
      where: { tenantId_tierName: { tenantId, tierName } },
      update: {
        minReputation,
        privileges: JSON.stringify(privileges),
        maxContractValue,
        isActive: true,
      },
      create: {
        tenantId,
        tierName,
        minReputation,
        privileges: JSON.stringify(privileges),
        maxContractValue,
      },
    });
  }

  /**
   * Checks if an entity is authorized for a specific operational privilege based on its earned trust tier.
   */
  async checkPrivilege(
    tenantId: string,
    entityType: string,
    entityId: string,
    requiredPrivilege: string,
  ): Promise<boolean> {
    const profile = await this.reputationEngine.getOrCreateProfile(tenantId, entityType, entityId);

    const tier = await this.prisma.trustTierGovernance.findUnique({
      where: { tenantId_tierName: { tenantId, tierName: profile.currentTier } },
    });

    if (!tier || !tier.isActive) {
      this.logger.warn(
        `Entity [${entityType}:${entityId}] has tier [${profile.currentTier}] but no active governance rules found.`,
      );
      return false;
    }

    const privileges: string[] = JSON.parse(tier.privileges);
    const hasPrivilege = privileges.includes(requiredPrivilege);

    this.logger.debug(
      `Privilege check for [${entityType}:${entityId}] (${profile.currentTier}) asking for [${requiredPrivilege}]: ${hasPrivilege ? "GRANTED" : "DENIED"}`,
    );

    return hasPrivilege;
  }
}
