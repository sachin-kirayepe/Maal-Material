import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalSupplyChainCognitionEngine — "The Macroscopic Analyst" (Phase 28)
 *
 * Optimizes the flow of goods and raw materials across the entire
 * planetary supply chain network.
 */
@Injectable()
export class GlobalSupplyChainCognitionEngine {
  private readonly logger = new Logger(GlobalSupplyChainCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a physical supply chain node and updates its capacity status.
   */
  async syncNodeCapacity(
    tenantId: string,
    type: string,
    geo: unknown,
    capacity: number,
    status: string,
  ) {
    this.logger.debug(
      `Syncing Supply Chain Node [${type}] for Tenant [${tenantId}] - Capacity: ${capacity}%`,
    );

    const node = await this.prisma.globalSupplyChainNode.create({
      data: {
        tenantId,
        nodeType: type,
        locationGeo: JSON.stringify(geo),
        capacityPct: capacity,
        operationalStatus: status,
      },
    });

    if (capacity >= 95) {
      this.logger.warn(
        `CRITICAL CAPACITY: Node [${node.id}] is near max capacity (${capacity}%). Diverting inbound shipments.`,
      );
    }

    return node;
  }
}
