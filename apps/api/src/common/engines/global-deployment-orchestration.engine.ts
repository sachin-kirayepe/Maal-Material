import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalDeploymentOrchestrationEngine — "The Expansion Architect" (Phase 14)
 *
 * Orchestrates the physical and digital expansion of a tenant's operations
 * into new global regions, ensuring compliance and compute infrastructure scale correctly.
 */
@Injectable()
export class GlobalDeploymentOrchestrationEngine {
  private readonly logger = new Logger(GlobalDeploymentOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stages a new regional expansion for an enterprise tenant!.
   */
  async stageRegionalExpansion(
    tenantId: string,
    regionCode: string,
    complianceProfile: unknown,
    infrastructureScaling: unknown,
  ) {
    this.logger.log(
      `Staging Global Expansion into Region [${regionCode}] for Tenant [${tenantId}]`,
    );

    const region = await this.prisma.globalExpansionRegion.create({
      data: {
        tenantId,
        regionCode,
        complianceProfile: JSON.stringify(complianceProfile),
        infrastructureScaling: JSON.stringify(infrastructureScaling),
        isLive: false,
      },
    });

    this.logger.debug(`Region [${regionCode}] staged. Awaiting final operational Go-Live.`);
    return region;
  }

  /**
   * Pushes a staged region into active Live status.
   */
  async activateRegion(tenantId: string, regionCode: string) {
    this.logger.log(`Activating Region [${regionCode}] for Tenant [${tenantId}].`);

    return this.prisma.globalExpansionRegion.update({
      where: {
        tenantId_regionCode: { tenantId, regionCode },
      },
      data: { isLive: true },
    });
  }
}
