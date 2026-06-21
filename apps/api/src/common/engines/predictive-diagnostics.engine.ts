import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PredictiveDiagnosticsEngine
 *
 * Scans infrastructure metrics to predict anomalies before they crash the system.
 * By tracking historical latency or queue depth, it can emit proactive warnings
 * to the self-healing orchestrator.
 */
@Injectable()
export class PredictiveDiagnosticsEngine {
  private readonly logger = new Logger(PredictiveDiagnosticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates recent infrastructure metrics for a specific node to detect anomalies.
   */
  async evaluateNodeHealth(tenantId: string, nodeId: string): Promise<boolean> {
    this.logger.debug(`Running predictive diagnostics for node: ${nodeId}`);

    // In a real scenario, this would query a time-series DB or look back at InfrastructureMetric.
    // We simulate a heuristic evaluation.
    const recentMetrics = await this.prisma.infrastructureMetric.findMany({
      where: { tenantId, nodeId },
      orderBy: { timestamp: "desc" },
      take: 5,
    });

    if (recentMetrics.length === 0) return true;

    // Simulate anomaly detection: If average CPU > 95% over the last 5 ticks
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;

    if (avgCpu > 95) {
      this.logger.warn(`Anomaly detected on node ${nodeId}: sustained load.`);
      await this.prisma.systemAnomalyEvent.create({
        data: {
          tenantId,
          anomalyType: "SUSTAINED_CPU_SPIKE",
          severity: "HIGH",
          contextJson: JSON.stringify({ avgCpu, nodeId }),
        },
      });
      return false; // Not healthy
    }

    return true; // Healthy
  }
}
