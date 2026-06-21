import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ProcessEvolutionEngine — "The Iterative Optimizer" (Phase 3I)
 *
 * The machine-learning loop of the automation matrix. Analyzes
 * `HyperEvolutionMetric` records to autonomously suggest structural
 * evolutions and optimizations to future `HyperAutomationTemplate` versions.
 */
@Injectable()
export class ProcessEvolutionEngine {
  private readonly logger = new Logger(ProcessEvolutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a granular performance metric for a specific process instance.
   */
  async recordMetric(
    tenantId: string,
    instanceId: string,
    metricKey: string,
    metricValue: number,
    context: unknown,
  ) {
    this.logger.debug(`Recording Evolution Metric [${metricKey}]: ${metricValue}`);

    return this.prisma.hyperEvolutionMetric.create({
      data: {
        tenantId,
        instanceId,
        metricKey,
        metricValue,
        contextJson: JSON.stringify(context),
      },
    });
  }

  /**
   * Analyzes historical metrics to calculate an optimization vector for a given workflow domain.
   */
  async analyzeEcosystemMetrics(tenantId: string, domain: string) {
    this.logger.log(`Analyzing Process Evolution Metrics for Domain: [${domain}]`);

    // In a production system, this aggregates millions of metric data points.
    // Stub implementation:
    const recentMetrics = await this.prisma.hyperEvolutionMetric.findMany({
      where: { tenantId },
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    if (recentMetrics.length > 50) {
      this.logger.warn(
        `Optimization Potential Detected: Substantial metric density in domain [${domain}] requires AI template evolution.`,
      );
    }

    return {
      domain,
      analyzedDataPoints: recentMetrics.length,
      optimizationConfidence: 0.85,
    };
  }
}
