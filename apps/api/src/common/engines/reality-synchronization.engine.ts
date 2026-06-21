import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealitySynchronizationEngine — "The Digital Twin Synthesizer" (Phase 3L)
 *
 * Continuously aggregates live telemetry to calculate the true, synchronized
 * state of a physical environment, maintaining an accurate digital twin.
 */
@Injectable()
export class RealitySynchronizationEngine {
  private readonly logger = new Logger(RealitySynchronizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes the digital state of a physical environment based on recent telemetry.
   */
  async synchronizeEnvironmentState(
    tenantId: string,
    environmentKey: string,
    aggregatedState: unknown,
    confidenceScore: number,
  ) {
    this.logger.log(
      `Synchronizing Reality State for [${environmentKey}]. Confidence: ${confidenceScore}`,
    );

    const existingState = await this.prisma.realitySynchronizationState.findFirst({
      where: { tenantId, environmentKey },
    });

    if (existingState) {
      return this.prisma.realitySynchronizationState.update({
        where: { id: existingState.id },
        data: {
          synchronizedStateJson: JSON.stringify(aggregatedState),
          confidenceScore,
        },
      });
    } else {
      return this.prisma.realitySynchronizationState.create({
        data: {
          tenantId,
          environmentKey,
          synchronizedStateJson: JSON.stringify(aggregatedState),
          confidenceScore,
        },
      });
    }
  }

  /**
   * Provides the active, trusted state of an environment for upstream orchestrators.
   */
  async getTrustedRealityState(tenantId: string, environmentKey: string) {
    return this.prisma.realitySynchronizationState.findFirst({
      where: { tenantId, environmentKey },
      orderBy: { lastSyncAt: "desc" },
    });
  }
}
