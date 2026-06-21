import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ProductionLoadSheddingEngine — "The Survival Core" (Phase 21)
 *
 * Intentionally drops non-critical read queries or UI updates during extreme
 * CPU/Memory saturation to keep the industrial execution engines alive.
 */
@Injectable()
export class ProductionLoadSheddingEngine {
  private readonly logger = new Logger(ProductionLoadSheddingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates system health and potentially engages load shedding.
   */
  async evaluateShedding(tenantId: string, currentMetricValue: number, metricName: string) {
    this.logger.debug(
      `Evaluating Load Shedding for Tenant [${tenantId}] on Metric [${metricName}] at Value [${currentMetricValue}]`,
    );

    // Fetch active policies for this tenant
    const policies = await this.prisma.productionLoadSheddingPolicy.findMany({
      where: {
        tenantId,
        triggerMetric: metricName,
        isActive: true,
      },
    });

    let shedActionTaken = false;

    for (const policy of policies) {
      if (currentMetricValue >= policy.threshold) {
        this.logger.warn(
          `ENGAGING LOAD SHEDDING: Threshold exceeded for [${metricName}]. Action: ${policy.action}`,
        );
        // In a real implementation, this would trigger an event or direct action
        shedActionTaken = true;
      }
    }

    return shedActionTaken;
  }
}
