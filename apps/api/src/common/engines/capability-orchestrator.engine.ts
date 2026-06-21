import { Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CapabilityOrchestratorEngine
 *
 * Replaces hardcoded role or module checks with dynamic capability checks.
 * Determines if a Tenant has the required dynamic capability to execute a workflow.
 * (e.g. 'CAN_RENT', 'HAS_WORKFORCE', 'AI_ENABLED')
 */
@Injectable()
export class CapabilityOrchestratorEngine {
  private readonly logger = new Logger(CapabilityOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Asserts that a tenant has a specific capability. Throws ForbiddenException if missing.
   * Cached at the tenant context level in production for performance.
   */
  async requireCapability(tenantId: string, capabilityName: string): Promise<void> {
    this.logger.debug(`Checking if tenant ${tenantId} has capability: ${capabilityName}`);

    const capability = await this.prisma.tenantCapability.findUnique({
      where: {
        tenantId_capabilityName: {
          tenantId,
          capabilityName,
        },
      },
    });

    if (!capability || !capability.isActive) {
      this.logger.warn(
        `Tenant ${tenantId} attempted to access missing capability: ${capabilityName}`,
      );
      throw new ForbiddenException(
        `Your account does not have the required capability: ${capabilityName}`,
      );
    }
  }

  /**
   * Returns a boolean indicating if the tenant has a specific capability.
   */
  async hasCapability(tenantId: string, capabilityName: string): Promise<boolean> {
    try {
      await this.requireCapability(tenantId, capabilityName);
      return true;
    } catch {
      return false;
    }
  }
}
