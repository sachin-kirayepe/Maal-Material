import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExternalIdentityEngine
 *
 * Manages federated identity mappings between internal Maal-Material entities
 * and external third-party identifiers (e.g., Stripe Connect accounts,
 * WhatsApp phone numbers, GST numbers).
 */
@Injectable()
export class ExternalIdentityEngine {
  private readonly logger = new Logger(ExternalIdentityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the external identifier for a given internal entity at a specific provider.
   * Uses ExternalIntegration's configPayload to store identity mappings.
   */
  async resolveExternalId(
    tenantId: string,
    providerName: string,
    internalEntityId: string,
  ): Promise<string | null> {
    const integration = await this.prisma.externalIntegration.findUnique({
      where: { tenantId_providerName: { tenantId, providerName } },
    });

    if (!integration || integration.status !== "ACTIVE") {
      this.logger.warn(`Integration ${providerName} not active for tenant ${tenantId}`);
      return null;
    }

    // Parse identity map from configPayload
    const config = integration.configPayload ? JSON.parse(integration.configPayload) : {};
    const identityMap: Record<string, string> = config.identityMap || {};

    return identityMap[internalEntityId] || null;
  }

  /**
   * Registers an external identity mapping for an internal entity.
   */
  async registerExternalId(
    tenantId: string,
    providerName: string,
    internalEntityId: string,
    externalId: string,
  ) {
    this.logger.log(
      `Mapping internal ${internalEntityId} -> external ${externalId} at ${providerName}`,
    );

    const integration = await this.prisma.externalIntegration.findUnique({
      where: { tenantId_providerName: { tenantId, providerName } },
    });

    if (!integration) {
      throw new Error(`Integration ${providerName} not found for tenant ${tenantId}`);
    }

    const config = integration.configPayload ? JSON.parse(integration.configPayload) : {};
    const identityMap: Record<string, string> = config.identityMap || {};

    identityMap[internalEntityId] = externalId;
    config.identityMap = identityMap;

    await this.prisma.externalIntegration.update({
      where: { id: integration.id },
      data: { configPayload: JSON.stringify(config) },
    });

    return { internalEntityId, externalId, provider: providerName };
  }

  /**
   * Lists all registered external identity mappings for a specific provider.
   */
  async listExternalMappings(tenantId: string, providerName: string) {
    const integration = await this.prisma.externalIntegration.findUnique({
      where: { tenantId_providerName: { tenantId, providerName } },
    });

    if (!integration) return {};

    const config = integration.configPayload ? JSON.parse(integration.configPayload) : {};
    return config.identityMap || {};
  }
}
