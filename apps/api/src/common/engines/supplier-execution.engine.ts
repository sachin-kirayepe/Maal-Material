import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SupplierExecutionEngine — "The External Orchestrator" (Phase 10)
 *
 * Synchronizes cross-tenant supplier activities (e.g., live freight/manufacturing tracking)
 * directly into the requesting tenant's execution reality state.
 */
@Injectable()
export class SupplierExecutionEngine {
  private readonly logger = new Logger(SupplierExecutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a tracking manifest once a B2B procurement is verified.
   */
  async initializeSupplierManifest(
    receivingTenantId: string,
    supplierTenantId: string,
    marketplaceListingId: string,
  ) {
    this.logger.log(
      `Initializing Supplier Manifest: [${supplierTenantId}] fulfilling to [${receivingTenantId}]`,
    );

    return this.prisma.supplierExecutionManifest.create({
      data: {
        receivingTenantId,
        supplierTenantId,
        marketplaceListingId,
        fulfillmentStatus: "MANUFACTURING",
        logisticsPayload: JSON.stringify({ eta: "PENDING", trackingNode: null }),
      },
    });
  }

  /**
   * The Supplier calls this to update the external tenant on physical progress.
   */
  async updateFulfillmentStatus(manifestId: string, newStatus: string, updatedLogistics: unknown) {
    this.logger.debug(`Supplier updating Manifest [${manifestId}] to state: [${newStatus}]`);

    return this.prisma.supplierExecutionManifest.update({
      where: { id: manifestId },
      data: {
        fulfillmentStatus: newStatus,
        logisticsPayload: JSON.stringify(updatedLogistics),
      },
    });
  }
}
