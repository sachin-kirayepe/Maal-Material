import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemFederationEngine — "The Planetary Network Orchestrator" (Phase 4E)
 *
 * Orchestrates the EcosystemFederationCore, mapping the holistic network of
 * collaborating tenants and monitoring overall ecosystem health and trust.
 */
@Injectable()
export class EcosystemFederationEngine {
  private readonly logger = new Logger(EcosystemFederationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global federation state for a specific enterprise tenant!.
   */
  async updateFederationState(tenantId: string, activeCollaborations: number, trustIndex: number) {
    this.logger.log(
      `Updating Ecosystem Federation State [Collaborations: ${activeCollaborations}, Trust Index: ${trustIndex}]`,
    );

    const core = await this.prisma.ecosystemFederationCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.ecosystemFederationCore.update({
        where: { id: core.id },
        data: {
          crossTenantCollaborationsCount: activeCollaborations,
          ecosystemTrustIndex: trustIndex,
          lastSynchronizedAt: new Date(),
        },
      });
    } else {
      return this.prisma.ecosystemFederationCore.create({
        data: {
          tenantId,
          crossTenantCollaborationsCount: activeCollaborations,
          ecosystemTrustIndex: trustIndex,
        },
      });
    }
  }

  /**
   * Evaluates if the tenant has sufficient ecosystem trust to initiate broad federated operations.
   */
  async validateEcosystemTrust(tenantId: string, requiredTrust: number): Promise<boolean> {
    const core = await this.prisma.ecosystemFederationCore.findFirst({
      where: { tenantId },
    });

    if (!core || core.ecosystemTrustIndex < requiredTrust) {
      this.logger.warn(
        `Ecosystem Trust Index (${core?.ecosystemTrustIndex || 0}) is below required threshold (${requiredTrust}). Enterprise cannot initiate broad federated workflows.`,
      );
      return false;
    }

    return true;
  }
}
