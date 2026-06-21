import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExtensionAuthorizationEnforcerEngine — "The Zero-Trust Guard" (Phase 32)
 *
 * Evaluates every third-party API request against the explicitly granted
 * EnterpriseAppInstallation scopes before permitting execution.
 */
@Injectable()
export class ExtensionAuthorizationEnforcerEngine {
  private readonly logger = new Logger(ExtensionAuthorizationEnforcerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifies if an installed app has the specific permission scope required.
   */
  async verifyExtensionScope(tenantId: string, appId: string, requiredScope: string) {
    this.logger.debug(
      `Verifying scope [${requiredScope}] for App [${appId}] on Tenant [${tenantId}]`,
    );

    const installation = await this.prisma.enterpriseAppInstallation.findFirst({
      where: { tenantId, appId },
    });

    if (!installation || installation.installationState !== "ACTIVE") {
      this.logger.warn(
        `AUTHORIZATION REJECTED: App [${appId}] is not active for Tenant [${tenantId}].`,
      );
      return false;
    }

    const grantedScopes: string[] = JSON.parse(installation.grantedScopes);
    if (!grantedScopes.includes(requiredScope)) {
      this.logger.warn(
        `SCOPE REJECTED: App [${appId}] attempted to access unauthorized scope [${requiredScope}]. Sandbox terminated.`,
      );
      return false;
    }

    this.logger.debug(`Authorization granted for App [${appId}].`);
    return true;
  }
}
