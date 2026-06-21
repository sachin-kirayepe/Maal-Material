import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * InfrastructureTopologyEngine — "The Topology Mapper" (Phase 3K)
 *
 * Maintains a living, queryable map of the platform's own engine
 * architecture and operational node structure.
 */
@Injectable()
export class InfrastructureTopologyEngine {
  private readonly logger = new Logger(InfrastructureTopologyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a map of the infrastructure topology for a given key/domain.
   */
  async updateTopologyMap(
    tenantId: string,
    topologyKey: string,
    nodeGraph: unknown,
    healthScore: number,
  ) {
    this.logger.log(`Updating Infrastructure Topology: [${topologyKey}] Health: ${healthScore}`);

    const existingMap = await this.prisma.infrastructureTopologyMap.findFirst({
      where: { tenantId, topologyKey },
    });

    if (existingMap) {
      return this.prisma.infrastructureTopologyMap.update({
        where: { id: existingMap.id },
        data: {
          nodeGraphJson: JSON.stringify(nodeGraph),
          healthScore,
        },
      });
    } else {
      return this.prisma.infrastructureTopologyMap.create({
        data: {
          tenantId,
          topologyKey,
          nodeGraphJson: JSON.stringify(nodeGraph),
          healthScore,
        },
      });
    }
  }

  /**
   * Retrieves the current infrastructure map, primarily for meta-orchestrators to review.
   */
  async getTopologyState(tenantId: string, topologyKey: string) {
    return this.prisma.infrastructureTopologyMap.findFirst({
      where: { tenantId, topologyKey },
    });
  }
}
