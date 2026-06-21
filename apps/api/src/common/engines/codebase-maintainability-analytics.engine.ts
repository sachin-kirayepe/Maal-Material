import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CodebaseMaintainabilityAnalyticsEngine — "The Entropy Auditor" (Phase 25)
 *
 * Continuously tracks code health, technical debt accrual, and modularity
 * scores across the entire global repository to ensure 10-year survivability.
 */
@Injectable()
export class CodebaseMaintainabilityAnalyticsEngine {
  private readonly logger = new Logger(CodebaseMaintainabilityAnalyticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates and records the maintainability health of a code node.
   */
  async recordMaintainabilitySnapshot(
    node: string,
    healthScore: number,
    debtEst: number,
    coverage: number,
  ) {
    this.logger.log(
      `Recording Maintainability Snapshot for [${node}] - Health: ${healthScore}/100`,
    );

    const snapshot = await this.prisma.codebaseMaintainabilityIndex.create({
      data: {
        repositoryNode: node,
        healthScore,
        technicalDebtEst: debtEst,
        testCoverage: coverage,
      },
    });

    if (healthScore < 50.0) {
      this.logger.warn(
        `CRITICAL ENTROPY WARNING: Subsystem [${node}] requires immediate structural refactoring.`,
      );
    }

    return snapshot;
  }
}
