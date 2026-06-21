import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedEnterpriseMemoryEngine — "The Long-Term Recall" (Phase 24)
 *
 * Provides a semantic memory ledger that allows the AI Copilot to recall
 * historical anomalies, past failures, and successful resolutions.
 */
@Injectable()
export class DistributedEnterpriseMemoryEngine {
  private readonly logger = new Logger(DistributedEnterpriseMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Commits a significant operational event to long-term memory.
   */
  async commitMemory(
    tenantId: string,
    category: string,
    semanticContent: string,
    context: unknown,
  ) {
    this.logger.debug(`Committing Enterprise Memory [${category}] for Tenant [${tenantId}]`);

    const memory = await this.prisma.distributedEnterpriseMemory.create({
      data: {
        tenantId,
        memoryCategory: category,
        semanticContent,
        contextData: JSON.stringify(context),
      },
    });

    return memory;
  }
}
