import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorldSynchronizationEngine — "The Global Metronome" (Phase 3W)
 *
 * Generates and orchestrates the WorldSynchronizationPulse logic, keeping
 * distributed operational nodes perfectly aligned without systemic drift.
 */
@Injectable()
export class WorldSynchronizationEngine {
  private readonly logger = new Logger(WorldSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Broadcasts a high-frequency synchronization pulse across the ecosystem.
   */
  async emitSyncPulse(tenantId: string, pulseVector: string, stateDelta: unknown) {
    this.logger.debug(`Emitting World Synchronization Pulse [Vector: ${pulseVector}]`);

    return this.prisma.worldSynchronizationPulse.create({
      data: {
        tenantId,
        pulseVector,
        stateDeltaJson: JSON.stringify(stateDelta),
      },
    });
  }

  /**
   * Retrieves the most recent sync pulses to align a newly connected node.
   */
  async getLatestPulses(tenantId: string, limit: number = 100) {
    return this.prisma.worldSynchronizationPulse.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
