import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkflowOptimizationEngine — "The Process Refactorer" (Phase 4A)
 *
 * Manages OptimizationWorkflowNodes, continuously analyzing historical friction
 * and refactoring industrial processes for higher yield and lower latency.
 */
@Injectable()
export class WorkflowOptimizationEngine {
  private readonly logger = new Logger(WorkflowOptimizationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Proposes a new optimization hypothesis based on historical workflow friction.
   */
  async proposeOptimization(
    tenantId: string,
    historicalWorkflowId: string,
    hypothesis: unknown,
    confidence: number,
  ) {
    this.logger.debug(
      `Proposing Workflow Optimization [Workflow: ${historicalWorkflowId}] [Confidence: ${confidence}]`,
    );

    return this.prisma.optimizationWorkflowNode.create({
      data: {
        tenantId,
        historicalWorkflowId,
        optimizationHypothesisJson: JSON.stringify(hypothesis),
        confidenceScore: confidence,
        isActive: true,
      },
    });
  }

  /**
   * Scans for high-confidence optimization hypotheses ready for production testing.
   */
  async getHighConfidenceOptimizations(tenantId: string) {
    this.logger.log(`Scanning for high-confidence workflow optimizations...`);

    const optimizations = await this.prisma.optimizationWorkflowNode.findMany({
      where: {
        tenantId,
        isActive: true,
        confidenceScore: { gte: 0.85 }, // Only consider highly probable optimizations
      },
      orderBy: { confidenceScore: "desc" },
    });

    if (optimizations.length > 0) {
      this.logger.log(
        `Found ${optimizations.length} optimization hypotheses ready for A/B testing.`,
      );
    }

    return optimizations;
  }
}
