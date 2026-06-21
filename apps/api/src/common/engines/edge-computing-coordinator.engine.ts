import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EdgeComputingCoordinatorEngine — "The Local Governor" (Phase 35)
 *
 * Manages the hyper-localized execution of workflows (e.g., inside an automated
 * factory or a regional cloud zone) without requiring a round-trip to the central core.
 */
@Injectable()
export class EdgeComputingCoordinatorEngine {
  private readonly logger = new Logger(EdgeComputingCoordinatorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates the status of an extreme-edge node.
   */
  async reportEdgeNodeStatus(fabricId: string, locationId: string, localExecutionLoad: number) {
    this.logger.debug(
      `Edge Node Status - Location [${locationId}] in Fabric [${fabricId}], Load: ${localExecutionLoad * 100}%`,
    );

    const nodeStatus = localExecutionLoad > 0.95 ? "QUARANTINED" : "ONLINE";

    const edgeNode = await this.prisma.edgeComputingNode.create({
      data: {
        fabricId,
        locationId,
        localExecutionLoad,
        nodeStatus,
      },
    });

    if (nodeStatus === "QUARANTINED") {
      this.logger.error(
        `EDGE NODE OVERLOAD: Location [${locationId}] is dropping execution requests. Initiating localized edge-spillover protocols.`,
      );
    }

    return edgeNode;
  }
}
