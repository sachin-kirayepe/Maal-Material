import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AutonomousObservabilityEngine
 *
 * Provides a holistic "System Health" score to the Command Center.
 * Aggregates unresolved anomalies, active bottlenecks, and recent self-healing
 * interventions to give operators a true picture of operational resilience.
 */
@Injectable()
export class AutonomousObservabilityEngine {
  private readonly logger = new Logger(AutonomousObservabilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a resilience health report for the ecosystem.
   */
  async generateOperationalHealthReport(tenantId: string) {
    this.logger.debug(`Generating autonomous observability report for tenant ${tenantId}`);

    const [activeAnomalies, activeBottlenecks, recentHeals] = await Promise.all([
      this.prisma.systemAnomalyEvent.count({ where: { tenantId, resolvedAt: null } }),
      this.prisma.operationalBottleneckTrace.count({ where: { tenantId, isResolved: false } }),
      this.prisma.selfHealingActionLog.count({
        where: { tenantId, executedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    // Simple health score logic: start at 100, deduct points for issues
    let healthScore = 100;
    healthScore -= activeAnomalies * 10;
    healthScore -= activeBottlenecks * 5;

    // Add a slight bonus if the system is actively healing itself successfully
    healthScore += recentHeals > 0 ? 5 : 0;

    // Bound the score
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      status: healthScore > 80 ? "HEALTHY" : healthScore > 50 ? "DEGRADED" : "CRITICAL",
      score: healthScore,
      activeAnomalies,
      activeBottlenecks,
      autonomousInterventions24h: recentHeals,
    };
  }
}
