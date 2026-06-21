import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DeveloperEcosystemOrchestrationEngine — "The Portal" (Phase 15)
 *
 * Manages developer onboarding, API key issuance, and usage analytics for
 * third-party organizations building on Maal-Material.
 */
@Injectable()
export class DeveloperEcosystemOrchestrationEngine {
  private readonly logger = new Logger(DeveloperEcosystemOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new third-party developer organization.
   */
  async registerDeveloper(organizationName: string, contactEmail: string) {
    this.logger.log(`Registering Developer Ecosystem Portal for [${organizationName}]`);

    const portal = await this.prisma.developerEcosystemPortal.create({
      data: {
        organizationName,
        contactEmail,
        isVerified: false,
      },
    });

    this.logger.debug(`Developer [${organizationName}] registered. Pending core verification.`);
    return portal;
  }
}
