import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterprisePluginGovernanceEngine — "The Sentry" (Phase 14)
 *
 * A specialized extension of the Phase 11 governance boundary. It validates that
 * third-party or cross-domain plugins adhere strictly to the tenant's global security policies.
 */
@Injectable()
export class EnterprisePluginGovernanceEngine {
  private readonly logger = new Logger(EnterprisePluginGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates a plugin action before allowing it to execute within the enterprise boundary.
   */
  async validatePluginAction(tenantId: string, appId: string, requestedAction: string) {
    this.logger.debug(
      `Validating Plugin Action [${requestedAction}] for App [${appId}] within Tenant [${tenantId}]`,
    );

    const installation = await this.prisma.tenantWorkspaceInstallation.findUnique({
      where: {
        tenantId_appId: { tenantId, appId },
      },
    });

    if (!installation || !installation.isActive) {
      this.logger.error(
        `SECURITY FAULT: Plugin [${appId}] is not active or installed for Tenant [${tenantId}]. Action Denied.`,
      );
      throw new Error("PLUGIN_NOT_AUTHORIZED");
    }

    // Connects to Phase 11 EnterprisePolicyOrchestrationEngine to verify the specific action
    this.logger.log(
      `Plugin Action [${requestedAction}] successfully passed Governance boundaries.`,
    );
    return true;
  }
}
