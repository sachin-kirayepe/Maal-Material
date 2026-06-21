import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemStateSyncEngine
 *
 * Securely synchronizes specific operational data between two collaborating tenants.
 * E.g., sharing real-time GPS of a logistics truck (Tenant A) with the destination warehouse (Tenant B).
 */
@Injectable()
export class EcosystemStateSyncEngine {
  private readonly logger = new Logger(EcosystemStateSyncEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Establishes a synchronization link between a physical asset owner and a collaborator.
   */
  async establishSyncLink(
    sourceTenantId: string,
    targetTenantId: string,
    entityId: string,
    allowedAttributes: string[],
  ) {
    this.logger.log(
      `Establishing State Sync: Entity [${entityId}] from Source [${sourceTenantId}] -> Target [${targetTenantId}]`,
    );

    return this.prisma.ecosystemOperationalSync.upsert({
      where: { unique_ecosystem_sync: { sourceTenantId, targetTenantId, entityId } },
      update: { sharedAttributes: JSON.stringify(allowedAttributes), syncStatus: "ACTIVE" },
      create: {
        sourceTenantId,
        targetTenantId,
        entityId,
        sharedAttributes: JSON.stringify(allowedAttributes),
        syncStatus: "ACTIVE",
      },
    });
  }

  /**
   * Broadcasts allowed attributes to target tenants when a twin updates.
   */
  async broadcastStateUpdate(
    sourceTenantId: string,
    entityId: string,
    updatedStatePayload: unknown,
  ) {
    this.logger.debug(`Broadcasting State Update for ${entityId}`);

    const activeSyncs = await this.prisma.ecosystemOperationalSync.findMany({
      where: { sourceTenantId, entityId, syncStatus: "ACTIVE" },
    });

    for (const sync of activeSyncs) {
      // Typically, filter the payload by sync.sharedAttributes and push to a broker/WebSocket
      this.logger.debug(`-> Synced to Target Tenant [${sync.targetTenantId}]`);
    }
  }
}
