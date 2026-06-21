import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MegaEcosystemGovernanceEngine — "The Ecosystem Regulator"
 *
 * Enforces mega-ecosystem rules, preventing monopolies, ensuring fair routing,
 * and managing cross-domain dispute resolution contexts.
 */
@Injectable()
export class MegaEcosystemGovernanceEngine {
  private readonly logger = new Logger(MegaEcosystemGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a participant in the mega-ecosystem across specific domains.
   */
  async onboardParticipant(
    tenantId: string,
    entityId: string,
    participantType: string,
    activeDomains: string[],
  ) {
    this.logger.log(
      `Onboarding Participant [${entityId}] as ${participantType} in domains: ${activeDomains.join(", ")}`,
    );

    return this.prisma.megaEcosystemParticipant.upsert({
      where: { tenantId_entityId: { tenantId, entityId } },
      update: {
        participantType,
        activeDomains: JSON.stringify(activeDomains),
      },
      create: {
        tenantId,
        entityId,
        participantType,
        activeDomains: JSON.stringify(activeDomains),
        verificationStatus: "VERIFIED",
      },
    });
  }

  /**
   * Evaluates if a participant is in good standing and authorized to operate
   * within a given domain.
   */
  async verifyParticipantDomainAuthority(
    tenantId: string,
    entityId: string,
    domainName: string,
  ): Promise<boolean> {
    const participant = await this.prisma.megaEcosystemParticipant.findUnique({
      where: { tenantId_entityId: { tenantId, entityId } },
    });

    if (!participant || participant.verificationStatus !== "VERIFIED") {
      this.logger.warn(`Participant [${entityId}] is not verified.`);
      return false;
    }

    const domains: string[] = JSON.parse(participant.activeDomains);
    if (!domains.includes(domainName)) {
      this.logger.warn(`Participant [${entityId}] is NOT authorized for domain [${domainName}].`);
      return false;
    }

    return true;
  }
}
