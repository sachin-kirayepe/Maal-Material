import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionRealityEngine — "The Truth Reconciler" (Phase 10)
 *
 * Reconciles incoming physical telemetry (IoT, GPS, field reports) against the
 * digital-twin expectations, ensuring the system maintains a perfect representation of reality.
 */
@Injectable()
export class ExecutionRealityEngine {
  private readonly logger = new Logger(ExecutionRealityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ingests live telemetry from a physical execution node (e.g., a connected vehicle or drone).
   */
  async updatePhysicalReality(
    tenantId: string,
    targetEntityId: string,
    physicalState: string,
    payload: unknown,
  ) {
    this.logger.debug(`Ingesting Reality Telemetry for Entity [${targetEntityId}]`);

    // In a high-scale system, this would be an UPSERT to prevent DB bloat.
    // For Phase 10 execution architecture, we append to maintain an audit trail.
    return this.prisma.executionStateGraph.create({
      data: {
        tenantId,
        targetEntityId,
        physicalState,
        telemetryPayload: JSON.stringify(payload),
      },
    });
  }

  /**
   * Validates if a physical asset is currently in the expected orchestration state.
   */
  async verifyRealitySync(
    tenantId: string,
    targetEntityId: string,
    expectedState: string,
  ): Promise<boolean> {
    this.logger.log(
      `Verifying Reality Sync for Entity [${targetEntityId}]. Expected: ${expectedState}`,
    );

    const latestState = await this.prisma.executionStateGraph.findFirst({
      where: { tenantId, targetEntityId },
      orderBy: { lastObservedAt: "desc" },
    });

    if (!latestState) {
      this.logger.warn(`No reality telemetry found for Entity [${targetEntityId}].`);
      return false; // Cannot verify
    }

    const isSynced = latestState.physicalState === expectedState;
    if (!isSynced) {
      this.logger.warn(
        `Reality Desync Detected! Entity is [${latestState.physicalState}], but expected [${expectedState}].`,
      );
    }

    return isSynced;
  }
}
