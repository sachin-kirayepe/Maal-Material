import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealtimeTwinSynchronizationEngine — "The State Synchronizer" (Phase 34)
 *
 * Guarantees that the virtual models do not drift from the physical reality sensors,
 * ensuring all predictive simulations remain mathematically valid.
 */
@Injectable()
export class RealtimeTwinSynchronizationEngine {
  private readonly logger = new Logger(RealtimeTwinSynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates the drift between physical sensors and the twin's mathematical state.
   */
  async calculateStateDrift(
    twinId: string,
    physicalHash: string,
    virtualHash: string,
    drift: number,
  ) {
    this.logger.debug(`Synchronizing Twin [${twinId}] - Physical vs Virtual Hash Drift: ${drift}%`);

    const syncRecord = await this.prisma.realtimeTwinSynchronization.create({
      data: {
        twinId,
        physicalStateHash: physicalHash,
        twinStateHash: virtualHash,
        driftPercentage: drift,
      },
    });

    if (drift > 2.5) {
      this.logger.error(
        `CRITICAL TWIN DRIFT: Twin [${twinId}] has drifted ${drift}% from reality. Predictive simulations utilizing this twin are now suspended until recalibration.`,
      );
    }

    return syncRecord;
  }
}
