import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalMemoryEngine — "The Enterprise Hippocampus" (Phase 4C)
 *
 * Orchestrates the UniversalMemoryGraph, managing the enterprise's long-term historical memory,
 * tracking memory volume and aggregate wisdom indices.
 */
@Injectable()
export class UniversalMemoryEngine {
  private readonly logger = new Logger(UniversalMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the global memory volume and wisdom index for the enterprise.
   */
  async updateMemoryState(tenantId: string, volumeBytes: bigint, wisdomIndex: number) {
    this.logger.log(
      `Updating Universal Memory Graph [Volume: ${volumeBytes} bytes, Wisdom Index: ${wisdomIndex}]`,
    );

    const graph = await this.prisma.universalMemoryGraph.findFirst({
      where: { tenantId },
    });

    if (graph) {
      return this.prisma.universalMemoryGraph.update({
        where: { id: graph.id },
        data: {
          totalMemoryVolumeBytes: volumeBytes,
          organizationalWisdomIndex: wisdomIndex,
          lastArchivedAt: new Date(),
        },
      });
    } else {
      return this.prisma.universalMemoryGraph.create({
        data: {
          tenantId,
          totalMemoryVolumeBytes: volumeBytes,
          organizationalWisdomIndex: wisdomIndex,
        },
      });
    }
  }

  /**
   * Evaluates the enterprise's current wisdom index against a required threshold.
   */
  async validateWisdomThreshold(tenantId: string, requiredIndex: number): Promise<boolean> {
    const graph = await this.prisma.universalMemoryGraph.findFirst({
      where: { tenantId },
    });

    if (!graph || graph.organizationalWisdomIndex < requiredIndex) {
      this.logger.warn(
        `Enterprise wisdom index (${graph?.organizationalWisdomIndex || 0}) is below required threshold (${requiredIndex}). Deferring to external human expertise.`,
      );
      return false; // The enterprise hasn't learned enough historically to handle this autonomously
    }

    return true;
  }
}
