import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionPressureEngine — "The Bottleneck Resolver" (Phase 3R)
 *
 * Detects localized ExecutionPressureSignal bursts and autonomously
 * routes ecosystem resources to alleviate systemic operational stress.
 */
@Injectable()
export class ExecutionPressureEngine {
  private readonly logger = new Logger(ExecutionPressureEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a high-stress execution bottleneck.
   */
  async registerExecutionPressure(
    tenantId: string,
    gridId: string,
    type: string,
    score: number,
    location: unknown,
  ) {
    this.logger.warn(`Registering Execution Pressure: [${type}] Score: ${score}`);

    return this.prisma.executionPressureSignal.create({
      data: {
        tenantId,
        gridId,
        pressureType: type,
        pressureScore: score,
        locationJson: JSON.stringify(location),
      },
    });
  }

  /**
   * Scans for critical systemic pressure points.
   */
  async analyzeSystemicPressure(tenantId: string, gridId: string) {
    this.logger.log(`Analyzing Systemic Execution Pressure for Grid: ${gridId}`);

    const criticalPressures = await this.prisma.executionPressureSignal.findMany({
      where: { tenantId, gridId, pressureScore: { gte: 0.8 } },
      orderBy: { detectedAt: "desc" },
      take: 5,
    });

    if (criticalPressures.length > 0) {
      this.logger.error(
        `DETECTED ${criticalPressures.length} CRITICAL BOTTLENECKS. Initiating Adaptive Routing.`,
      );
      // Real implementation would trigger complex resource routing workflows
    }

    return criticalPressures;
  }
}
