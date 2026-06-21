import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * KnowledgeConsciousnessEngine — "The Organizational Memory" (Phase 3T)
 *
 * Orchestrates the macro-level organizational memory, syncing and updating
 * the OrganizationalKnowledgeCore state based on continuous operational execution.
 */
@Injectable()
export class KnowledgeConsciousnessEngine {
  private readonly logger = new Logger(KnowledgeConsciousnessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes the overall intelligence maturity of a tenant's knowledge core.
   */
  async syncKnowledgeCore(tenantId: string, reasoningTopologyUpdate: unknown) {
    this.logger.log(`Synchronizing Organizational Knowledge Core for Tenant: ${tenantId}`);

    const core = await this.prisma.organizationalKnowledgeCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.organizationalKnowledgeCore.update({
        where: { id: core.id },
        data: {
          reasoningTopologyJson: JSON.stringify(reasoningTopologyUpdate),
          intelligenceMaturity: this.evaluateMaturity(
            reasoningTopologyUpdate,
            core.intelligenceMaturity,
          ),
          lastSyncedAt: new Date(),
        },
      });
    } else {
      return this.prisma.organizationalKnowledgeCore.create({
        data: {
          tenantId,
          reasoningTopologyJson: JSON.stringify(reasoningTopologyUpdate),
          intelligenceMaturity: 0.1,
        },
      });
    }
  }

  private evaluateMaturity(topologyUpdate: unknown, currentMaturity: number): number {
    return Math.min(1.0, currentMaturity + 0.005);
  }
}
