import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionMemoryEngine — "The Historian" (Phase 3N)
 *
 * Records the outcome of orchestration workflows across the ecosystem.
 * Acts as the long-term memory bank for adaptive learning and cognition engines.
 */
@Injectable()
export class ExecutionMemoryEngine {
  private readonly logger = new Logger(ExecutionMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Commits the result of an execution into the platform's long-term memory.
   */
  async commitMemory(
    tenantId: string,
    workflowDomain: string,
    outcome: string,
    contextData: unknown,
    resultData: unknown,
  ) {
    this.logger.log(`Committing Execution Memory for [${workflowDomain}] Outcome: ${outcome}`);

    return this.prisma.executionMemoryNode.create({
      data: {
        tenantId,
        workflowDomain,
        executionOutcome: outcome, // "SUCCESS", "FAILURE", "ANOMALY"
        contextJson: JSON.stringify(contextData),
        resultJson: JSON.stringify(resultData),
      },
    });
  }

  /**
   * Retrieves past memory nodes for a specific domain to inform current decisions.
   */
  async recallMemories(tenantId: string, workflowDomain: string, limit: number = 100) {
    return this.prisma.executionMemoryNode.findMany({
      where: { tenantId, workflowDomain },
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
  }
}
