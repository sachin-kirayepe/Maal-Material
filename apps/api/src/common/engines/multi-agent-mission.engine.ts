import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * MultiAgentMissionEngine — "The Fleet Commander" (Phase 3B)
 *
 * Orchestrates coordinated multi-agent missions where several specialized
 * AI agents must collaborate on a complex operational objective. Manages
 * mission lifecycle, agent assignment, and consensus aggregation.
 */
@Injectable()
export class MultiAgentMissionEngine {
  private readonly logger = new Logger(MultiAgentMissionEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Creates a new multi-agent mission and assigns agents.
   */
  async createMission(
    tenantId: string,
    missionName: string,
    objective: string,
    agentIds: string[],
  ) {
    this.logger.log(`Creating Multi-Agent Mission [${missionName}] with ${agentIds.length} agents`);

    const mission = await this.prisma.multiAgentMission.create({
      data: {
        tenantId,
        missionName,
        objective,
        assignedAgentIds: JSON.stringify(agentIds),
        status: "PLANNING",
      },
    });

    this.eventDispatcher.dispatch("ai", "multi_agent_mission_created", {
      tenantId,
      missionId: mission.id,
      agentIds,
    });

    return mission;
  }

  /**
   * Activates a mission, transitioning assigned agents into operational mode.
   */
  async activateMission(missionId: string) {
    this.logger.log(`Activating Mission [${missionId}]`);

    const mission = await this.prisma.multiAgentMission.update({
      where: { id: missionId },
      data: { status: "ACTIVE" },
    });

    const agentIds: string[] = JSON.parse(mission.assignedAgentIds);

    // Mark all assigned agents as WORKING
    for (const agentId of agentIds) {
      await this.prisma.enterpriseAIAgent
        .update({
          where: { id: agentId },
          data: { status: "WORKING" },
        })
        .catch(() => {
          this.logger.warn(`Agent [${agentId}] not found or already busy.`);
        });
    }

    return mission;
  }

  /**
   * Records the consensus conclusion from a completed multi-agent mission.
   */
  async recordConsensus(missionId: string, consensusData: unknown) {
    this.logger.log(`Recording consensus for Mission [${missionId}]`);

    return this.prisma.multiAgentMission.update({
      where: { id: missionId },
      data: {
        consensusJson: JSON.stringify(consensusData),
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }
}
