import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SupplierSynchronizationEngine — "The Live Supply Chain" (Phase 12)
 *
 * Synchronizes physical supplier fulfillment centers with the digital reality twin,
 * tracking bulk materials and dispatch capacity in real-time.
 */
@Injectable()
export class SupplierSynchronizationEngine {
  private readonly logger = new Logger(SupplierSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Syncs live telemetry from a physical supplier depot.
   */
  async syncDepotInventory(
    tenantId: string,
    depotId: string,
    liveInventory: unknown,
    activeFleets: number,
  ) {
    this.logger.debug(`Syncing Live Inventory for Depot [${depotId}] under Tenant [${tenantId}]`);

    return this.prisma.supplierFulfillmentCenter.update({
      where: { id: depotId },
      data: {
        liveInventorySync: JSON.stringify(liveInventory),
        dispatchCapacity: activeFleets,
      },
    });
  }
}
