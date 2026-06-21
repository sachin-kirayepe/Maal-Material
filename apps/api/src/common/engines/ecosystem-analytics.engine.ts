import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EcosystemAnalyticsEngine — "The Pattern Detector"
 *
 * Generates and queries periodic ecosystem-level snapshots. Surfaces hidden patterns
 * like geographic concentration risk, supplier network density, and financial health trends.
 */
@Injectable()
export class EcosystemAnalyticsEngine {
  private readonly logger = new Logger(EcosystemAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates and stores an ecosystem analytics snapshot for a specific metric domain.
   */
  async generateSnapshot(
    tenantId: string,
    snapshotType: string,
    metrics: Record<string, number | string>,
    periodStart: Date,
    periodEnd: Date,
  ) {
    this.logger.log(
      `Generating Ecosystem Snapshot [${snapshotType}] for period ${periodStart.toISOString()} → ${periodEnd.toISOString()}`,
    );

    return this.prisma.ecosystemAnalyticsSnapshot.create({
      data: {
        tenantId,
        snapshotType,
        metrics: JSON.stringify(metrics),
        periodStart,
        periodEnd,
      },
    });
  }

  /**
   * Retrieves the most recent snapshots for a given type, enabling trend analysis.
   */
  async getSnapshotTrend(tenantId: string, snapshotType: string, limit: number = 12) {
    return this.prisma.ecosystemAnalyticsSnapshot.findMany({
      where: { tenantId, snapshotType },
      orderBy: { generatedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Compares two snapshots of the same type to detect metric shifts.
   */
  async compareSnapshots(snapshotIdA: string, snapshotIdB: string) {
    const [a, b] = await Promise.all([
      this.prisma.ecosystemAnalyticsSnapshot.findUnique({ where: { id: snapshotIdA } }),
      this.prisma.ecosystemAnalyticsSnapshot.findUnique({ where: { id: snapshotIdB } }),
    ]);

    if (!a || !b) throw new Error("One or both snapshots not found.");

    const metricsA = JSON.parse(a.metrics);
    const metricsB = JSON.parse(b.metrics);
    const delta: Record<string, { from: unknown; to: unknown }> = {};

    for (const key of new Set([...Object.keys(metricsA), ...Object.keys(metricsB)])) {
      if (metricsA[key] !== metricsB[key]) {
        delta[key] = { from: metricsA[key], to: metricsB[key] };
      }
    }

    this.logger.log(`Snapshot comparison: ${Object.keys(delta).length} metrics changed.`);
    return delta;
  }
}
