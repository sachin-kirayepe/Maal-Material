import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SupplyNetworkSynchronizationEngine — "The Conductor" (Phase 17)
 *
 * Synchronizes physical logistics and supply chains across the network,
 * tracking the movement of assets between distributed tenants.
 */
@Injectable()
export class SupplyNetworkSynchronizationEngine {
  private readonly logger = new Logger(SupplyNetworkSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tracks a physical asset moving between tenants across the network.
   */
  async synchronizeAssetCustody(
    workflowId: string,
    assetIdentifier: string,
    currentCustodyTenantId: string,
    synchronizationData: unknown,
    nextCustodyTenantId?: string,
  ) {
    this.logger.log(
      `Synchronizing Asset [${assetIdentifier}] currently at [${currentCustodyTenantId}]`,
    );

    const syncRecord = await this.prisma.supplyNetworkSynchronization.create({
      data: {
        workflowId,
        assetIdentifier,
        currentCustodyTenantId,
        nextCustodyTenantId: nextCustodyTenantId || null,
        synchronizationData: JSON.stringify(synchronizationData),
        status: "IN_TRANSIT",
      },
    });

    return syncRecord;
  }
}
