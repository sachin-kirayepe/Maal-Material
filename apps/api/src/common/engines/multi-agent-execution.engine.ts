import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MultiAgentExecutionEngine — "The Agent Spawner" (Phase 7A)
 *
 * Orchestrates the MultiAgentExecutionCore. The master allocator responsible for
 * tracking the active state and population of all specialized autonomous agents.
 */
@Injectable()
export class MultiAgentExecutionEngine {
  private readonly logger = new Logger(MultiAgentExecutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the overall operational footprint of the multi-agent execution layer.
   */
  async updateAgentPopulationSync(
    tenantId: string,
    activeAgentCount: number,
    collaborationScore: number,
  ) {
    this.logger.log(
      `Syncing Multi-Agent Core [Active Agents: ${activeAgentCount}] [Collab Score: ${collaborationScore}]`,
    );

    const core = await this.prisma.multiAgentExecutionCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.multiAgentExecutionCore.update({
        where: { id: core.id },
        data: {
          totalActiveAgents: activeAgentCount,
          systemicCollaborationScore: collaborationScore,
          lastGlobalSyncAt: new Date(),
        },
      });
    } else {
      return this.prisma.multiAgentExecutionCore.create({
        data: {
          tenantId,
          totalActiveAgents: activeAgentCount,
          systemicCollaborationScore: collaborationScore,
        },
      });
    }
  }

  /**
   * Evaluates if the multi-agent swarm is suffering from catastrophic collaboration breakdown.
   */
  async checkCollaborationHealth(tenantId: string): Promise<boolean> {
    const core = await this.prisma.multiAgentExecutionCore.findFirst({
      where: { tenantId },
    });

    if (core && core.systemicCollaborationScore < 0.6) {
      this.logger.warn(
        `CRITICAL: Systemic agent collaboration breakdown detected (Score: ${core.systemicCollaborationScore}). The swarm is failing to negotiate efficiently.`,
      );
      return false; // Swarm is failing to cooperate
    }

    return true; // Agents are collaborating properly
  }
}
