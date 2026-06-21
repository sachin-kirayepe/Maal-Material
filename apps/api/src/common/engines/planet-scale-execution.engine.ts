import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PlanetScaleExecutionEngine — "The Civilization Conductor" (Phase 5C)
 *
 * Orchestrates the PlanetScaleExecutionCore. Acts as the apex conductor for worldwide
 * industrial execution, tracking global latency and overall civilization-scale throughput.
 */
@Injectable()
export class PlanetScaleExecutionEngine {
  private readonly logger = new Logger(PlanetScaleExecutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the civilization-scale execution metrics for an enterprise network.
   */
  async updatePlanetaryThroughput(
    tenantId: string,
    globalOpsVolume: number,
    efficiencyIndex: number,
  ) {
    this.logger.log(
      `Updating Planet-Scale Execution [Global Volume: ${globalOpsVolume}, Efficiency: ${efficiencyIndex}]`,
    );

    const core = await this.prisma.planetScaleExecutionCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.planetScaleExecutionCore.update({
        where: { id: core.id },
        data: {
          globalOperationsVolume: globalOpsVolume,
          planetaryEfficiencyIndex: efficiencyIndex,
          lastGlobalSyncAt: new Date(),
        },
      });
    } else {
      return this.prisma.planetScaleExecutionCore.create({
        data: {
          tenantId,
          globalOperationsVolume: globalOpsVolume,
          planetaryEfficiencyIndex: efficiencyIndex,
        },
      });
    }
  }

  /**
   * Validates if the worldwide execution superfabric is healthy enough to sustain planetary loads.
   */
  async checkPlanetaryGridHealth(tenantId: string): Promise<boolean> {
    const core = await this.prisma.planetScaleExecutionCore.findFirst({
      where: { tenantId },
    });

    if (!core || core.planetaryEfficiencyIndex < 0.9) {
      this.logger.warn(
        `Planetary Execution Grid is degraded (Efficiency: ${core?.planetaryEfficiencyIndex || 0}). International workloads may experience severe latency.`,
      );
      return false;
    }

    return true;
  }
}
