import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FederationAnalyticsEngine — "The Macro-Observer" (Phase 3D)
 *
 * Aggregates operational and financial intelligence at the cluster or alliance level.
 * Crucially, it provides high-level observability (e.g., "Total Volume", "Average Latency")
 * across multiple tenants without breaching the strict data isolation boundaries
 * of individual tenant databases.
 */
@Injectable()
export class FederationAnalyticsEngine {
  private readonly logger = new Logger(FederationAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates and stores a new analytics snapshot for a federation entity.
   */
  async generateSnapshot(
    targetScope: "CLUSTER" | "ALLIANCE",
    targetId: string,
    snapshotPeriod: string,
    aggregatedMetrics: unknown,
  ) {
    this.logger.log(
      `Generating Analytics Snapshot for ${targetScope} [${targetId}] — Period: ${snapshotPeriod}`,
    );

    return this.prisma.federationAnalyticsSnapshot.create({
      data: {
        targetScope,
        targetId,
        snapshotPeriod,
        metricsJson: JSON.stringify(aggregatedMetrics),
      },
    });
  }

  /**
   * Retrieves the historical analytics snapshots for a federation entity to plot macro trends.
   */
  async getSnapshotHistory(
    targetScope: "CLUSTER" | "ALLIANCE",
    targetId: string,
    limit: number = 12,
  ) {
    this.logger.debug(`Fetching snapshot history for ${targetScope} [${targetId}]`);

    return this.prisma.federationAnalyticsSnapshot.findMany({
      where: { targetScope, targetId },
      orderBy: { snapshotPeriod: "desc" },
      take: limit,
    });
  }

  /**
   * Compares the latest snapshot against the previous one to detect trust or volume drift.
   */
  async calculateDrift(targetScope: "CLUSTER" | "ALLIANCE", targetId: string) {
    const snapshots = await this.getSnapshotHistory(targetScope, targetId, 2);

    if (snapshots.length < 2) {
      return null; // Need at least two snapshots to calculate drift
    }

    const current = JSON.parse(snapshots![0]!.metricsJson);
    const previous = JSON.parse(snapshots![1]!.metricsJson);

    // Stub: Calculate delta percentages across known metrics
    const driftReport = {
      volumeDriftPct: this.calcDelta((current as any)?.volume || 0, (previous as any)?.volume || 0),
      latencyDriftPct: this.calcDelta(
        (current as any)?.latency || 0,
        (previous as any)?.latency || 0,
      ),
    };

    this.logger.log(
      `Calculated Federation Drift for ${targetScope} [${targetId}]: ${JSON.stringify(driftReport)}`,
    );
    return driftReport;
  }

  private calcDelta(current?: number, previous?: number): number {
    if (typeof current !== "number" || typeof previous !== "number" || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}
