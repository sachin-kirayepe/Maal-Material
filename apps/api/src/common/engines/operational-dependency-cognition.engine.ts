import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalDependencyCognitionEngine — "The Dependency Auditor" (Phase 29)
 *
 * Mathematically tracks the health and latency of logical dependencies
 * across the entire enterprise organization.
 */
@Injectable()
export class OperationalDependencyCognitionEngine {
  private readonly logger = new Logger(OperationalDependencyCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tracks the real-time operational health of a critical edge in the knowledge graph.
   */
  async auditDependency(tenantId: string, edgeId: string, latencyMs: number, health: string) {
    this.logger.debug(
      `Auditing Operational Dependency [${edgeId}] - Latency: ${latencyMs}ms | Health: ${health}`,
    );

    const analytics = await this.prisma.operationalDependencyAnalytics.create({
      data: {
        tenantId,
        dependencyEdgeId: edgeId,
        latencyMs,
        healthStatus: health,
        lastCheckedAt: new Date(),
      },
    });

    if (health === "BROKEN") {
      this.logger.error(
        `CRITICAL DEPENDENCY BROKEN: Edge [${edgeId}] is offline. Initiating workflow consequence inference.`,
      );
    }

    return analytics;
  }
}
