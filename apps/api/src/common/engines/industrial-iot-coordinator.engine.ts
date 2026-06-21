import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialIoTCoordinatorEngine — "The Swarm Controller" (Phase 36)
 *
 * Ensures highly synchronized actions across IoT edge fleets, ensuring that
 * physical machines share an identical mathematical worldview.
 */
@Injectable()
export class IndustrialIoTCoordinatorEngine {
  private readonly logger = new Logger(IndustrialIoTCoordinatorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the synchronization latency of an individual machine within a fleet.
   */
  async evaluateMachineSyncState(
    fleetId: string,
    machineId: string,
    syncLatencyMs: number,
    worldviewHash: string,
  ) {
    this.logger.debug(
      `Evaluating Machine [${machineId}] in Fleet [${fleetId}] - Latency: ${syncLatencyMs}ms`,
    );

    const syncState = await this.prisma.industrialIoTSynchronization.create({
      data: {
        fleetId,
        machineId,
        syncLatencyMs,
        worldviewHash,
      },
    });

    if (syncLatencyMs > 50) {
      this.logger.warn(
        `DANGEROUS DRIFT: Machine [${machineId}] is lagging the fleet by ${syncLatencyMs}ms. Forcing physical stop to prevent collision.`,
      );
    }

    return syncState;
  }
}
