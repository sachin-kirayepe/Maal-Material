import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LiveDigitalTwinEngine — "The Reality Mirror" (Phase 6C)
 *
 * Orchestrates the LiveDigitalTwinCore. Acts as the central construct responsible
 * for mirroring the physical enterprise in real-time with sub-second latency targets.
 */
@Injectable()
export class LiveDigitalTwinEngine {
  private readonly logger = new Logger(LiveDigitalTwinEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the overall synchronization fidelity and active telemetry node count of the digital twin.
   */
  async updateTwinFidelity(tenantId: string, activeNodes: number, fidelityScore: number) {
    this.logger.log(
      `Updating Live Digital Twin [Active Nodes: ${activeNodes}] [Fidelity: ${fidelityScore}]`,
    );

    const core = await this.prisma.liveDigitalTwinCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.liveDigitalTwinCore.update({
        where: { id: core.id },
        data: {
          totalLiveTelemetryNodes: activeNodes,
          ecosystemSynchronizationFidelity: fidelityScore,
          lastTelemetryTickAt: new Date(),
        },
      });
    } else {
      return this.prisma.liveDigitalTwinCore.create({
        data: {
          tenantId,
          totalLiveTelemetryNodes: activeNodes,
          ecosystemSynchronizationFidelity: fidelityScore,
        },
      });
    }
  }

  /**
   * Evaluates if the digital twin is out of sync with physical reality (ghosting).
   */
  async checkFidelityDrift(tenantId: string): Promise<boolean> {
    const core = await this.prisma.liveDigitalTwinCore.findFirst({
      where: { tenantId },
    });

    if (core && core.ecosystemSynchronizationFidelity < 0.9) {
      this.logger.warn(
        `Digital Twin fidelity drift detected (Score: ${core.ecosystemSynchronizationFidelity}). The construct is losing sync with physical reality.`,
      );
      return false; // Twin is ghosting
    }

    return true; // Twin is synchronized
  }
}
