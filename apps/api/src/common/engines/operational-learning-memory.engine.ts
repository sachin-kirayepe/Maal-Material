import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalLearningMemoryEngine — "The Historian" (Phase 19)
 *
 * Maintains the long-term knowledge base of what optimizations
 * actually work in production to prevent repeating mistakes.
 */
@Injectable()
export class OperationalLearningMemoryEngine {
  private readonly logger = new Logger(OperationalLearningMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Commits the results of an experiment to the permanent operational memory.
   */
  async commitLearning(
    tenantId: string,
    experimentId: string,
    learnedContext: unknown,
    successBoolean: boolean,
  ) {
    this.logger.log(
      `Committing Operational Learning [Success: ${successBoolean}] for Experiment [${experimentId}] in Tenant [${tenantId}]`,
    );

    const memory = await this.prisma.operationalLearningMemory.create({
      data: {
        tenantId,
        experimentId,
        learnedContext: JSON.stringify(learnedContext),
        successBoolean,
        integrationStatus: successBoolean ? "PENDING" : "DISCARDED",
      },
    });

    return memory;
  }
}
