import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalExecutionNetworkEngine — "The Network Mapper" (Phase 17)
 *
 * Orchestrates the massive topology of localized execution hubs (nodes)
 * across the industrial internet.
 */
@Injectable()
export class GlobalExecutionNetworkEngine {
  private readonly logger = new Logger(GlobalExecutionNetworkEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new execution node into the global industrial network.
   */
  async registerNode(
    tenantId: string,
    nodeName: string,
    locationData: unknown,
    capacityMetrics: unknown,
  ) {
    this.logger.log(`Registering Global Execution Node [${nodeName}] for Tenant [${tenantId}]`);

    const node = await this.prisma.globalExecutionNetworkNode.create({
      data: {
        tenantId,
        nodeName,
        locationData: JSON.stringify(locationData),
        capacityMetrics: JSON.stringify(capacityMetrics),
        isOnline: true,
      },
    });

    this.logger.debug(`Execution Node [${node.id}] is now online on the global fabric.`);
    return node;
  }
}
