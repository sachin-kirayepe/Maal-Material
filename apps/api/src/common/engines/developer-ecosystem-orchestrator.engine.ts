import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DeveloperEcosystemOrchestratorEngine — "The Developer Hub" (Phase 32)
 *
 * Manages ISV (Independent Software Vendor) registration, app submission,
 * and ecosystem health on the Maal-Material Super Platform.
 */
@Injectable()
export class DeveloperEcosystemOrchestratorEngine {
  private readonly logger = new Logger(DeveloperEcosystemOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a third-party developer onto the Maal-Material Ecosystem.
   */
  async registerISV(developerName: string, contactEmail: string, apiKeys: unknown) {
    this.logger.log(`Registering new ISV: [${developerName}] - Contact: ${contactEmail}`);

    const isv = await this.prisma.thirdPartyDeveloperAccount.create({
      data: {
        developerName,
        contactEmail,
        verificationLevel: "UNVERIFIED",
        apiKeysJson: JSON.stringify(apiKeys),
      },
    });

    this.logger.debug(
      `Developer Account [${isv.id}] successfully provisioned. Awaiting verification.`,
    );
    return isv;
  }
}
